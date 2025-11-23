import { DEFAULT_PAGE } from "@/constants"
import { parseAsInteger, useQueryStates } from "nuqs"

export const useHistorialVentasFilters = () => {
  return useQueryStates({
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  })
}

