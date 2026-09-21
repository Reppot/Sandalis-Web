import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// 🗺️ Склады (таймеры деспавна)
export const stockpiles = pgTable("stockpiles", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  location: text("location").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 📜 История обновлений склада (журнал интенданта)
export const stockpileHistory = pgTable("stockpile_history", {
  id: serial("id").primaryKey(),
  stockpileId: integer("stockpile_id")
    .notNull()
    .references(() => stockpiles.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 📦 Текущие запасы склада (монитор)
export const storageItems = pgTable("storage_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  count: integer("count").notNull().default(0),
  unit: text("unit").notNull().default("шт."),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 📡 Журнал синхронизаций (источник импорта, кол-во позиций)
export const syncLog = pgTable("sync_log", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  itemCount: integer("item_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 🛠️ Сохранённые заказы (рапорты снабжения)
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  count: integer("count").notNull(),
  unit: text("unit").notNull().default("ящ."),
});

export type Stockpile = typeof stockpiles.$inferSelect;
export type StockpileHistoryRow = typeof stockpileHistory.$inferSelect;
export type StorageItemRow = typeof storageItems.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
