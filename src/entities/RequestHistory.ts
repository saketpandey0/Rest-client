import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "crypto";

@Entity()
export class RequestHistory {
  @PrimaryKey()
  id: string = randomUUID();

  @Property()
  method!: string;

  @Property()
  url!: string;

  @Property({ type: "text", nullable: true })
  requestHeaders?: string;

  @Property({ type: "text", nullable: true })
  requestBody?: string;

  @Property()
  status!: number;

  @Property({ type: "text", nullable: true })
  responseHeaders?: string;

  @Property({ type: "text", nullable: true })
  responseBody?: string;

  @Property()
  durationMs!: number;

  @Property()
  createdAt: Date = new Date();
}
