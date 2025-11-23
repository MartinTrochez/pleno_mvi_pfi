"use client"

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { toast } from "sonner";

interface CargaVentasViewProps {
  className?: string;
  onFileAccepted?: (file: File) => void; // para integración futura
}

// Estructura final solicitada
export interface VentaItem {
  fecha: string | null; // tal cual aparece en el Excel
  hora: string | null; // tal cual aparece en el Excel
  nroTransaccion: number | null;
  codigo: string | null;
  descripcion: string | null;
  rubro: string | null;
  cantidad: number | null;
  precioUnitario: number | null;
  importe: number | null;
}

const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ACCEPTED_EXT = ["xlsx"];

export const CargaVentasView = ({ className, onFileAccepted }: CargaVentasViewProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<VentaItem[] | null>(null);

  const validateFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ext || !ACCEPTED_EXT.includes(ext)) {
      return "Formato inválido. Solo .xlsx";
    }
    if (f.size > 5 * 1024 * 1024) { // 5MB  por ahora
      return "El archivo supera el tamaño máximo (5MB)";
    }
    if (!ACCEPTED_MIME.includes(f.type) && ext === "xlsx") {
      // Algunos navegadores pueden no proveer el mime exacto
      return null;
    }
    return null;
  };

    // Mapeo encabezados normalizados -> claves finales solicitadas
    // Ajusta/expande según las columnas reales del archivo
    const HEADER_TO_FINAL: Record<string, keyof VentaItem> = {
      fecha: "fecha",
      date: "fecha",
      dia: "fecha",
      hora: "hora",
      time: "hora",
      "nro_transac": "nroTransaccion",
      "nro_transaccion": "nroTransaccion",
      "nro_de_transaccion": "nroTransaccion",
      transaccion: "nroTransaccion",
      numero: "nroTransaccion",
      nro: "nroTransaccion",
      codigo: "codigo",
      cod: "codigo",
      cod_barras: "codigo",
      barcode: "codigo",
      ean: "codigo",
      descripcion: "descripcion",
      producto: "descripcion",
      nombre_producto: "descripcion",
      rubro: "rubro",
      categoria: "rubro",
      cantidad: "cantidad",
      qty: "cantidad",
      unidades: "cantidad",
      "precio_unitario": "precioUnitario",
      precio: "precioUnitario",
      unit_price: "precioUnitario",
      importe: "importe",
      total: "importe",
      monto: "importe",
    };

    const normalizeHeader = (h: string) => {
      return h
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quitar acentos
        .replace(/\s+/g, "_")
        .replace(/[^\w_]/g, "");
    };

    // Parsear el archivo xlsx a JSON y mapear a estructura final solicitada
    const parseExcel = async (f: File) => {
      try {
    // @ts-ignore: Tipos de 'xlsx' opcionales; instalar @types/xlsx si se requiere tipado estricto
    const XLSX = await import("xlsx");
        const arrayBuffer = await f.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        // Detectar dinámicamente la fila de encabezado en las primeras 10 filas
        const previewRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: null });
        let headerRowIndex = 3; // por defecto: fila 4 (0-index)
        for (let i = 0; i < Math.min(10, previewRows.length); i++) {
          const cells = (previewRows[i] ?? []).map((c) => normalizeHeader(String(c ?? "")));
          const set = new Set(cells);
          const hasFecha = set.has("fecha") || set.has("date") || set.has("dia");
          const hasDescOrCod = set.has("descripcion") || set.has("producto") || set.has("codigo") || set.has("cod") || set.has("cod_barras") || set.has("ean") || set.has("barcode");
          if (hasFecha && hasDescOrCod) {
            headerRowIndex = i;
            break;
          }
        }

        // Leer como objetos usando la fila detectada como encabezado, y valores formateados (raw:false) para mantener la visual del Excel
        const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false, range: headerRowIndex });

        // 1) Re-map: encabezados a claves finales
        const remapped = rawRows.map((row) => {
          const tmp: Partial<VentaItem> & Record<string, any> = {};
          Object.keys(row).forEach((rawKey) => {
            const norm = normalizeHeader(String(rawKey));
            const finalKey = HEADER_TO_FINAL[norm];
            if (finalKey) tmp[finalKey] = row[rawKey];
          });
          return tmp;
        });

        // 2) Transformaciones: formatos y tipos
        const toNum = (v: any): number | null => {
          if (v === null || v === undefined || v === "") return null;
          const n = Number(String(v).replace(/\./g, "").replace(",", "."));
          if (!Number.isFinite(n) || n < 0) return null; // validar >= 0
          return n;
        };

        const toInt = (v: any): number | null => {
          const n = toNum(v);
          return n === null ? null : Math.trunc(n);
        };

        const toStr = (v: any): string | null => {
          if (v === null || v === undefined) return null;
          const s = String(v).trim();
          return s === "" ? null : s;
        };

        const transformed: VentaItem[] = remapped.map((r) => {
          const fecha = toStr(r.fecha ?? null); // mantener como string tal cual
          const hora = toStr(r.hora ?? null);   // mantener como string tal cual
          const nroTransaccion = toInt(r.nroTransaccion ?? null);
          const codigo = toStr(r.codigo ?? null);
          const descripcion = toStr(r.descripcion ?? null);
          const rubro = toStr(r.rubro ?? null);
          const cantidad = toInt(r.cantidad ?? null);
          const precioUnitario = toNum(r.precioUnitario ?? null);
          const importe = toNum(r.importe ?? null);
          return { fecha, hora, nroTransaccion, codigo, descripcion, rubro, cantidad, precioUnitario, importe };
        });

        // 3) Validaciones y filtrados
        const isTotalRow = (desc: string | null) => {
          if (!desc) return false;
          const s = desc.toLowerCase();
          return s.startsWith("total") || s.includes("totales") || s.includes("subtotal");
        };

        const isAllNull = (v: VentaItem) =>
          v.fecha === null && v.hora === null && v.nroTransaccion === null && v.codigo === null &&
          v.descripcion === null && v.rubro === null && v.cantidad === null && v.precioUnitario === null && v.importe === null;

        const validRows = transformed.filter((row) => {
          // Reglas obligatorias
          if (!row.codigo || !row.descripcion || !row.fecha) return false;
          // Filtrar filas de totales
          if (isTotalRow(row.descripcion)) return false;
          // Filtrar totalmente vacías (seguridad extra)
          if (isAllNull(row)) return false;
          return true;
        });

        setParsedData(validRows);
        console.log("Fila de encabezado detectada (0-index):", headerRowIndex, "-> usada como header");
        console.log("Preview parsed rows (raw):", rawRows);
        console.log(`Filas leídas: ${rawRows.length} | Transformadas: ${transformed.length} | Válidas: ${validRows.length}`);
        console.log("Preview transformado a estructura final (válidas):", validRows);
        console.table(validRows.slice(0, 10));
        if (validRows.length > 0) {
          console.log("Estructura (keys):", Object.keys(validRows[0]!));
          console.log("Ejemplo primer item:", validRows[0]);
        } else {
          console.log("No se encontraron filas válidas.");
        }
        return validRows;
      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setError("No se pudo leer el archivo Excel");
        setParsedData(null);
        return null;
      }
    };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const validation = validateFile(f);
    if (validation) {
      setError(validation);
      setFile(null);
      setParsedData(null);
      return;
    }
    setError(null);
    setFile(f);
    onFileAccepted?.(f);
    // parsear inmediatamente para previsualizar y estructurar según DER
    parseExcel(f);
  }, [onFileAccepted]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onBrowseClick = () => inputRef.current?.click();

  const onSubmit = async () => {
    if (!file) return;
    try {
      setUploading(true);
      // mostrar en consola el resultado final que se enviaría a la BD (según DER)
      console.log("Final payload a enviar", parsedData);
      if (parsedData && parsedData.length) {
        console.table(parsedData.slice(0, 20));
        console.log("Ejemplo (primer item):", parsedData[0]);
        console.log("Cantidad de registros:", parsedData.length);
      }
      // integrar con endpoint (ej. fetch POST parsedData)
      await new Promise((r) => setTimeout(r, 700));
      toast.success("Datos cargados correctamente")
      // para disparar toast de éxito
    } catch (e: any) {
      // para disparar toast de error
      toast.error(e.message)
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("p-6 md:p-8", className)}>
      <div className="space-y-8 max-w-5xl mx-auto w-full">
        <h1 className="text-xl font-semibold tracking-tight">Carga de Ventas</h1>
        <div className="bg-background border rounded-xl shadow-sm p-10 flex flex-col items-center max-w-xl mx-auto w-full">
          <h2 className="text-3xl font-semibold text-center mb-8">Subir Archivos</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={onDrop}
            className={cn(
              "w-full border border-dashed rounded-md p-10 text-center cursor-pointer transition-colors",
              "bg-muted/40 hover:bg-muted/60",
              error ? "border-destructive/60" : "border-muted-foreground/20"
            )}
            onClick={onBrowseClick}
          >
            <div className="flex flex-col items-center gap-4 select-none">
              <div className="size-12 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                <UploadCloud className="size-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                Arrastre y suelte archivos o {" "}
                <button
                  type="button"
                  onClick={onBrowseClick}
                  className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
                >
                  Buscar
                </button>
              </p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Formatos Soportados: .xlsx</p>
              {file && !error && (
                <p className="text-xs font-medium text-foreground mt-2">{file.name}</p>
              )}
              {error && (
                <p className="text-xs text-destructive font-medium mt-2">{error}</p>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={!file || !!error || uploading}
            className="mt-10 w-56"
          >
            {uploading ? "Subiendo..." : "Subir Archivo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CargaVentasView;
