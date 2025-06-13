CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- run this in postgresqlCLI to use UUID
CREATE TABLE "users" (
  "user_id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" VARCHAR(150) UNIQUE NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "password" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "is_verified" BOOLEAN DEFAULT false,
  "role" VARCHAR(20) NOT NULL CHECK (role IN ('stall', 'client'))
);

CREATE TABLE "stalls" (
  "stall_id" UUID PRIMARY KEY,
  "num_id" VARCHAR(100) NOT NULL,
  "location" TEXT NOT NULL,
  "phone" VARCHAR(13) NOT NULL,
  "facultie" VARCHAR(20) NOT NULL CHECK (role IN ('social', 'engineering', 'biomedical')),
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "clients" (
  "client_id" UUID PRIMARY KEY,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(13) NOT NULL
);

CREATE TABLE "categories" (
  "category_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE "products" (
  "product_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(150) NOT NULL,
  "description" TEXT,
  "stock" INTEGER NOT NULL,
  "price" NUMERIC(10,2) NOT NULL,
  "cost" NUMERIC(10,2) NOT NULL,
  "stall_id" UUID NOT NULL,
  "category_id" INTEGER
);

CREATE TABLE "sales" (
  "sale_id" SERIAL PRIMARY KEY,
  "client_id" UUID NOT NULL,
  "stall_id" UUID NOT NULL,
  "description" TEXT,
  "date_start" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "date_end" TIMESTAMP,
  "total_amount" NUMERIC(12,2) NOT NULL
);

CREATE TABLE "concepts" (
  "concept_id" SERIAL PRIMARY KEY,
  "sale_id" INTEGER NOT NULL,
  "product_id" INTEGER,
  "quantity" INTEGER NOT NULL,
  "unit_price" NUMERIC(10,2) NOT NULL
);

CREATE TABLE "queue_entries" (
  "queue_id" SERIAL PRIMARY KEY,
  "client_id" UUID NOT NULL,
  "stall_id" UUID NOT NULL,
  "status" VARCHAR(15) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'serving', 'completed', 'cancelled')),
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE "stalls" ADD FOREIGN KEY ("stall_id") REFERENCES "users" ("user_id") ON DELETE CASCADE;

ALTER TABLE "clients" ADD FOREIGN KEY ("client_id") REFERENCES "users" ("user_id") ON DELETE CASCADE;

ALTER TABLE "products" ADD FOREIGN KEY ("stall_id") REFERENCES "stalls" ("stall_id") ON DELETE CASCADE;

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id") ON DELETE SET NULL;

ALTER TABLE "sales" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("client_id") ON DELETE SET NULL;

ALTER TABLE "sales" ADD FOREIGN KEY ("stall_id") REFERENCES "stalls" ("stall_id") ON DELETE SET NULL;

ALTER TABLE "concepts" ADD FOREIGN KEY ("sale_id") REFERENCES "sales" ("sale_id") ON DELETE CASCADE;

ALTER TABLE "concepts" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("product_id") ON DELETE SET NULL;

ALTER TABLE "queue_entries" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("client_id") ON DELETE CASCADE;

ALTER TABLE "queue_entries" ADD FOREIGN KEY ("stall_id") REFERENCES "stalls" ("stall_id") ON DELETE CASCADE;
