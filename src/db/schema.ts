import {
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const document = pgTable("document", {
    id: uuid("id").defaultRandom().primaryKey(),
    body: jsonb("body").notNull(), // Stores TipTap JSON format to preserve formatting
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    createdBy: text("created_by").notNull(),
    timerDuration: integer("timer_duration"), // Remaining time in seconds, null for infinite timer
});

export type Document = typeof document.$inferSelect;
