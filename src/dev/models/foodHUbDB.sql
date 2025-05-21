CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- run this in postgresqlCLI to use UUID
CREATE TABLE "users" (
  "user_id" UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" VARCHAR(150) UNIQUE NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "password" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "is_verified" BOOLEAN DEFAULT false
);

CREATE TABLE "workers" (
  "worker_id" UUID PRIMARY KEY,
  "role" VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee')),
  "hire_date" DATE DEFAULT (CURRENT_DATE),
  "is_active" BOOLEAN DEFAULT true
);

CREATE TABLE "clients" (
  "client_id" UUID PRIMARY KEY,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(13) NOT NULL
);

CREATE TABLE "faculties" (
  "faculty_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

CREATE TABLE "stalls" (
  "stall_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "num_id" VARCHAR(100) NOT NULL,
  "location" TEXT NOT NULL,
  "admin_id" UUID NOT NULL,
  "phone" VARCHAR(13) NOT NULL,
  "faculty_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "stall_employees" (
  "stall_id" INTEGER NOT NULL,
  "employee_id" UUID NOT NULL,
  PRIMARY KEY ("stall_id", "employee_id")
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
  "stall_id" INTEGER NOT NULL,
  "category_id" INTEGER
);

CREATE TABLE "sales" (
  "sale_id" SERIAL PRIMARY KEY,
  "client_id" UUID NOT NULL,
  "stall_id" INTEGER NOT NULL,
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
  "stall_id" INTEGER NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'serving', 'completed', 'cancelled')),
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE "workers" ADD CONSTRAINT "fk_worker_user" FOREIGN KEY ("worker_id") REFERENCES "users" ("user_id") ON DELETE CASCADE;

ALTER TABLE "clients" ADD CONSTRAINT "fk_client_user" FOREIGN KEY ("client_id") REFERENCES "users" ("user_id") ON DELETE CASCADE;

ALTER TABLE "stalls" ADD CONSTRAINT "fk_stall_admin" FOREIGN KEY ("admin_id") REFERENCES "workers" ("worker_id") ON DELETE SET NULL;

ALTER TABLE "stalls" ADD CONSTRAINT "fk_stall_faculty" FOREIGN KEY ("faculty_id") REFERENCES "faculties" ("faculty_id") ON DELETE CASCADE;

ALTER TABLE "stall_employees" ADD CONSTRAINT "fk_se_stall" FOREIGN KEY ("stall_id") REFERENCES "stalls" ("stall_id") ON DELETE CASCADE;

ALTER TABLE "stall_employees" ADD CONSTRAINT "fk_se_employee" FOREIGN KEY ("employee_id") REFERENCES "workers" ("worker_id") ON DELETE CASCADE;

ALTER TABLE "products" ADD CONSTRAINT "fk_product_stall" FOREIGN KEY ("stall_id") REFERENCES "stalls" ("stall_id") ON DELETE CASCADE;

ALTER TABLE "products" ADD CONSTRAINT "fk_product_category" FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id") ON DELETE SET NULL;

ALTER TABLE "sales" ADD CONSTRAINT "fk_sale_client" FOREIGN KEY ("client_id") REFERENCES "clients" ("client_id") ON DELETE SET NULL;

ALTER TABLE "sales" ADD CONSTRAINT "fk_sale_stall" FOREIGN KEY ("stall_id") REFERENCES "stalls" ("stall_id") ON DELETE SET NULL;

ALTER TABLE "concepts" ADD CONSTRAINT "fk_concept_sale" FOREIGN KEY ("sale_id") REFERENCES "sales" ("sale_id") ON DELETE CASCADE;

ALTER TABLE "concepts" ADD CONSTRAINT "fk_concept_product" FOREIGN KEY ("product_id") REFERENCES "products" ("product_id") ON DELETE SET NULL;

ALTER TABLE "queue_entries" ADD CONSTRAINT "fk_queue_client" FOREIGN KEY ("client_id") REFERENCES "clients" ("client_id") ON DELETE CASCADE;

ALTER TABLE "queue_entries" ADD CONSTRAINT "fk_queue_stall" FOREIGN KEY ("stall_id") REFERENCES "stalls" ("stall_id") ON DELETE CASCADE;
