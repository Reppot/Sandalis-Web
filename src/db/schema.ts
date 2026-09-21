import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// 📦 Текущие запасы закреплённого склада (монитор)
export const storageItems = pgTable("storage_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  count: integer("count").notNull().default(0),
  unit: text("unit").notNull().default("шт."),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 📡 Журнал синхронизаций склада (источник импорта, кол-во позиций)
export const syncLog = pgTable("sync_log", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  itemCount: integer("item_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 🛠️ Сохранённые заказы (рапорты снабжения) — общий архив штаба
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("submitted"),
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

export type StorageItemRow = typeof storageItems.$inferSelect;
export type SyncLogRow = typeof syncLog.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
