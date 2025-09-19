import { Migration } from '@mikro-orm/migrations';

export class Migration20250919025553 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "request_history" ("id" varchar(255) not null, "method" varchar(255) not null, "url" varchar(255) not null, "headers" text null, "body" text null, "status_code" int not null, "response" text null, "response_time" int not null, "timestamp" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "request_history_pkey" primary key ("id"));`);
  }

}
