import { boolean, integer, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

// 👤 Участники клана (B1-a)
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  discordName: text("discord_name").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  serverId: text("server_id").notNull().default("762509239683776512"),
  serverName: text("server_name").notNull().default("KUNI"),
  roles: text("roles").array().notNull().default([]),
  accessLevel: text("access_level").notNull().default("minimal"),
  isActive: boolean("is_active").notNull().default(true),
  memberSince: timestamp("member_since", { withTimezone: true }),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 🔑 Сессии в БД (B1-a)
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
  lastIp: text("last_ip"),
  userAgent: text("user_agent"),
});

export type Stockpile = typeof stockpiles.$inferSelect;
export type StockpileHistoryRow = typeof stockpileHistory.$inferSelect;
export type StorageItemRow = typeof storageItems.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Session = typeof sessions.$inferSelect;
