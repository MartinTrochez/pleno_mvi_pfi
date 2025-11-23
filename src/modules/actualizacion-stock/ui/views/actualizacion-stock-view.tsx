import { ActualizacionStock, columns } from "../components/columns"
import { DataTable } from "../components/data-table"

const data: ActualizacionStock[] = [
  { id: 1, nombre: "Leche Entera 1L", codigoBarra: "7891234567890", categoria: "Lácteos", cantidad: 50, ajusteStock: 0 },
  { id: 2, nombre: "Pan de Molde Integral", codigoBarra: "7890987654321", categoria: "Panadería", cantidad: 30, ajusteStock: 0 },
  { id: 3, nombre: "Arroz 1Kg", codigoBarra: "7891122334455", categoria: "Alimentos", cantidad: 100, ajusteStock: 0 },
  { id: 4, nombre: "Galletitas Dulces", codigoBarra: "7892233445566", categoria: "Snacks", cantidad: 75, ajusteStock: 0 },
  { id: 5, nombre: "Café Molido 250g", codigoBarra: "7893344556677", categoria: "Bebidas", cantidad: 40, ajusteStock: 0 },
  { id: 6, nombre: "Jugo Naranja 1L", codigoBarra: "7894455667788", categoria: "Bebidas", cantidad: 60, ajusteStock: 0 },
  { id: 7, nombre: "Aceite Girasol 1L", codigoBarra: "7895566778899", categoria: "Alimentos", cantidad: 35, ajusteStock: 0 },
  { id: 8, nombre: "Fideos Spaghetti 500g", codigoBarra: "7896677889900", categoria: "Alimentos", cantidad: 80, ajusteStock: 0 },
  { id: 9, nombre: "Queso Barra 200g", codigoBarra: "7897788990011", categoria: "Lácteos", cantidad: 45, ajusteStock: 0 },
  { id: 10, nombre: "Yogur Natural 200g", codigoBarra: "7898899001122", categoria: "Lácteos", cantidad: 55, ajusteStock: 0 },
  { id: 11, nombre: "Chocolate en Barra", codigoBarra: "7899900112233", categoria: "Snacks", cantidad: 70, ajusteStock: 0 },
  { id: 12, nombre: "Agua Mineral 500ml", codigoBarra: "7891011121314", categoria: "Bebidas", cantidad: 90, ajusteStock: 0 },
  { id: 13, nombre: "Arvejas 500g", codigoBarra: "7891213141516", categoria: "Alimentos", cantidad: 65, ajusteStock: 0 },
  { id: 14, nombre: "Dulce de Leche 400g", codigoBarra: "7891415161718", categoria: "Alimentos", cantidad: 50, ajusteStock: 0 },
  { id: 15, nombre: "Gaseosa Cola 1.5L", codigoBarra: "7891617181920", categoria: "Bebidas", cantidad: 120, ajusteStock: 0 }
];

export const ActualizacionStockView = () => {
  return (
    <div className="flex-col items-center">
      <h1 className="pt-8 pl-8 text-xl text-black font-bold">Stock de Productos</h1>
      <div className="p-8">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  )
}
