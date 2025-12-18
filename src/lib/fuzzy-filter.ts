import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";

/**
 * Fuzzy filter function for TanStack Table
 * Uses match-sorter-utils for ranking-based fuzzy matching
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic filter function needs to work with any data type
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

/**
 * Global fuzzy filter that searches across all columns
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic filter function needs to work with any data type
export const globalFuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Get all column values and concatenate them for searching
  const searchableValues = row
    .getAllCells()
    .map((cell) => {
      const cellValue = cell.getValue();
      if (cellValue == null) return "";
      if (typeof cellValue === "object") return JSON.stringify(cellValue);
      return String(cellValue);
    })
    .join(" ");

  const itemRank = rankItem(searchableValues, value);
  addMeta({ itemRank });
  return itemRank.passed;
};
