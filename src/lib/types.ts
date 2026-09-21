export type OrderUnit = "ящ." | "шт.";

export interface StorageItem {
  name: string;
  count: number;
  unit: string;
}

export interface OrderLine {
  name: string;
  count: number;
  unit: OrderUnit;
}

export interface SyncInfo {
  source: string;
  itemCount: number;
  createdAt: string;
}

export interface StorageResponse {
  items: StorageItem[];
  lastSync: SyncInfo | null;
}

export interface SavedOrderDTO {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  items: OrderLine[];
}

export type ExportFormat = "txt" | "xlsx" | "png" | "clipboard";
export type PanelMode = "export" | "import";
