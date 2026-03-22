import { integer, pgTable, varchar, uuid, date } from "drizzle-orm/pg-core";


const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  phone: integer().notNull(),
  email: varchar({ length: 255 }).notNull(),
  experince: varchar({ length: 255 }),
  sector: varchar({ length: 255 }),
  target_role: varchar({ length: 255 }),
  created_at: date().notNull().defaultNow(),
  updated_at: date().notNull().defaultNow(),
});

export default usersTable