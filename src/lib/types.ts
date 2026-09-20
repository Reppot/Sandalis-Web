export interface StorageItem {
  name: string;
  count: number;
  unit?: string;
}

export type OrderUnit = "ящ." | "шт.";

export interface OrderLine {
  name: string;
  count: number;
  unit: OrderUnit;
}

export interface HistoryEntry {
  id: number;
  message: string;
  createdAt: string;
}

export interface StockpileDTO {
  id: number;
  region: string;
  location: string;
  expiresAt: string;
  updatedAt: string;
  history: HistoryEntry[];
}

export interface SavedOrderDTO {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  items: OrderLine[];
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

export interface ScanResponse {
  items: StorageItem[];
  matchedCodes: number;
  fileName: string;
  fileSize: number;
  strict: boolean;
}

export type Severity = "critical" | "warning" | "safe";
export type ExportFormat = "txt" | "xlsx" | "png" | "clipboard";
export type PanelMode = "export" | "import";
