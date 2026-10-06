import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'reviewer', 'sales');
  CREATE TYPE "public"."enum_content_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum_content_kind" AS ENUM('offer', 'product', 'knowledge', 'journal', 'material', 'page', 'resource', 'project', 'evidence', 'campaign');
  CREATE TYPE "public"."enum_content_approval" AS ENUM('pending', 'technical-review', 'approved');
  CREATE TYPE "public"."enum_content_evidence_status" AS ENUM('pending', 'verified', 'illustrative');
  CREATE TYPE "public"."enum_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__content_v_version_locale" AS ENUM('de', 'en');
  CREATE TYPE "public"."enum__content_v_version_kind" AS ENUM('offer', 'product', 'knowledge', 'journal', 'material', 'page', 'resource', 'project', 'evidence', 'campaign');
  CREATE TYPE "public"."enum__content_v_version_approval" AS ENUM('pending', 'technical-review', 'approved');
  CREATE TYPE "public"."enum__content_v_version_evidence_status" AS ENUM('pending', 'verified', 'illustrative');
  CREATE TYPE "public"."enum__content_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "role" "enum_users_role" DEFAULT 'editor' NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "reset_password_requested_at" timestamp(3) with time zone,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "content_sections_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE "content_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar,
    "text" varchar
  );

  CREATE TABLE "content_facts" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "value" varchar
  );

  CREATE TABLE "content_related" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "slug" varchar
  );

  CREATE TABLE "content" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "slug" varchar,
    "locale" "enum_content_locale" DEFAULT 'de',
    "kind" "enum_content_kind",
    "eyebrow" varchar,
    "description" varchar,
    "cta_label" varchar,
    "cta_href" varchar,
    "translation" varchar,
    "reading_minutes" numeric,
    "author" varchar,
    "reviewer" varchar,
    "reviewed_at" timestamp(3) with time zone,
    "next_review_at" timestamp(3) with time zone,
    "approval" "enum_content_approval" DEFAULT 'pending',
    "evidence_status" "enum_content_evidence_status" DEFAULT 'pending',
    "evidence_notes" varchar,
    "supplier_reference" varchar,
    "issuer" varchar,
    "scope" varchar,
    "expires_at" timestamp(3) with time zone,
    "image_u_r_l" varchar,
    "image_alt" varchar,
    "image_rights" varchar,
    "image_caption" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_content_status" DEFAULT 'draft'
  );

  CREATE TABLE "_content_v_version_sections_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_sections" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_facts" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_related" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_slug" varchar,
    "version_locale" "enum__content_v_version_locale" DEFAULT 'de',
    "version_kind" "enum__content_v_version_kind",
    "version_eyebrow" varchar,
    "version_description" varchar,
    "version_cta_label" varchar,
    "version_cta_href" varchar,
    "version_translation" varchar,
    "version_reading_minutes" numeric,
    "version_author" varchar,
    "version_reviewer" varchar,
    "version_reviewed_at" timestamp(3) with time zone,
    "version_next_review_at" timestamp(3) with time zone,
    "version_approval" "enum__content_v_version_approval" DEFAULT 'pending',
    "version_evidence_status" "enum__content_v_version_evidence_status" DEFAULT 'pending',
    "version_evidence_notes" varchar,
    "version_supplier_reference" varchar,
    "version_issuer" varchar,
    "version_scope" varchar,
    "version_expires_at" timestamp(3) with time zone,
    "version_image_u_r_l" varchar,
    "version_image_alt" varchar,
    "version_image_rights" varchar,
    "version_image_caption" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__content_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "experiments" (
    "id" serial PRIMARY KEY NOT NULL,
    "hypothesis" varchar NOT NULL,
    "owner" varchar NOT NULL,
    "cost_ceiling_e_u_r" numeric,
    "primary_metric" varchar NOT NULL,
    "decision" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_kv" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "global_slug" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer,
    "content_id" integer,
    "experiments_id" integer
  );

  CREATE TABLE "payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer
  );

  CREATE TABLE "payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_sections_items" ADD CONSTRAINT "content_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_sections" ADD CONSTRAINT "content_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_facts" ADD CONSTRAINT "content_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_related" ADD CONSTRAINT "content_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_sections_items" ADD CONSTRAINT "_content_v_version_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_sections" ADD CONSTRAINT "_content_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_facts" ADD CONSTRAINT "_content_v_version_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_related" ADD CONSTRAINT "_content_v_version_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v" ADD CONSTRAINT "_content_v_parent_id_content_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."content"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiments_fk" FOREIGN KEY ("experiments_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "content_sections_items_order_idx" ON "content_sections_items" USING btree ("_order");
  CREATE INDEX "content_sections_items_parent_id_idx" ON "content_sections_items" USING btree ("_parent_id");
  CREATE INDEX "content_sections_order_idx" ON "content_sections" USING btree ("_order");
  CREATE INDEX "content_sections_parent_id_idx" ON "content_sections" USING btree ("_parent_id");
  CREATE INDEX "content_facts_order_idx" ON "content_facts" USING btree ("_order");
  CREATE INDEX "content_facts_parent_id_idx" ON "content_facts" USING btree ("_parent_id");
  CREATE INDEX "content_related_order_idx" ON "content_related" USING btree ("_order");
  CREATE INDEX "content_related_parent_id_idx" ON "content_related" USING btree ("_parent_id");
  CREATE INDEX "content_slug_idx" ON "content" USING btree ("slug");
  CREATE INDEX "content_updated_at_idx" ON "content" USING btree ("updated_at");
  CREATE INDEX "content_created_at_idx" ON "content" USING btree ("created_at");
  CREATE INDEX "content__status_idx" ON "content" USING btree ("_status");
  CREATE UNIQUE INDEX "slug_locale_idx" ON "content" USING btree ("slug","locale");
  CREATE INDEX "_content_v_version_sections_items_order_idx" ON "_content_v_version_sections_items" USING btree ("_order");
  CREATE INDEX "_content_v_version_sections_items_parent_id_idx" ON "_content_v_version_sections_items" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_sections_order_idx" ON "_content_v_version_sections" USING btree ("_order");
  CREATE INDEX "_content_v_version_sections_parent_id_idx" ON "_content_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_facts_order_idx" ON "_content_v_version_facts" USING btree ("_order");
  CREATE INDEX "_content_v_version_facts_parent_id_idx" ON "_content_v_version_facts" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_related_order_idx" ON "_content_v_version_related" USING btree ("_order");
  CREATE INDEX "_content_v_version_related_parent_id_idx" ON "_content_v_version_related" USING btree ("_parent_id");
  CREATE INDEX "_content_v_parent_idx" ON "_content_v" USING btree ("parent_id");
  CREATE INDEX "_content_v_version_version_slug_idx" ON "_content_v" USING btree ("version_slug");
  CREATE INDEX "_content_v_version_version_updated_at_idx" ON "_content_v" USING btree ("version_updated_at");
  CREATE INDEX "_content_v_version_version_created_at_idx" ON "_content_v" USING btree ("version_created_at");
  CREATE INDEX "_content_v_version_version__status_idx" ON "_content_v" USING btree ("version__status");
  CREATE INDEX "_content_v_created_at_idx" ON "_content_v" USING btree ("created_at");
  CREATE INDEX "_content_v_updated_at_idx" ON "_content_v" USING btree ("updated_at");
  CREATE INDEX "_content_v_latest_idx" ON "_content_v" USING btree ("latest");
  CREATE INDEX "version_slug_version_locale_idx" ON "_content_v" USING btree ("version_slug","version_locale");
  CREATE INDEX "experiments_updated_at_idx" ON "experiments" USING btree ("updated_at");
  CREATE INDEX "experiments_created_at_idx" ON "experiments" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_content_id_idx" ON "payload_locked_documents_rels" USING btree ("content_id");
  CREATE INDEX "payload_locked_documents_rels_experiments_id_idx" ON "payload_locked_documents_rels" USING btree ("experiments_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "content_sections_items" CASCADE;
  DROP TABLE "content_sections" CASCADE;
  DROP TABLE "content_facts" CASCADE;
  DROP TABLE "content_related" CASCADE;
  DROP TABLE "content" CASCADE;
  DROP TABLE "_content_v_version_sections_items" CASCADE;
  DROP TABLE "_content_v_version_sections" CASCADE;
  DROP TABLE "_content_v_version_facts" CASCADE;
  DROP TABLE "_content_v_version_related" CASCADE;
  DROP TABLE "_content_v" CASCADE;
  DROP TABLE "experiments" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_content_locale";
  DROP TYPE "public"."enum_content_kind";
  DROP TYPE "public"."enum_content_approval";
  DROP TYPE "public"."enum_content_evidence_status";
  DROP TYPE "public"."enum_content_status";
  DROP TYPE "public"."enum__content_v_version_locale";
  DROP TYPE "public"."enum__content_v_version_kind";
  DROP TYPE "public"."enum__content_v_version_approval";
  DROP TYPE "public"."enum__content_v_version_evidence_status";
  DROP TYPE "public"."enum__content_v_version_status";`)
}
