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
  headers?: string;

  @Property({ type: "text", nullable: true })
  body?: string | null;

  @Property()
  statusCode!: number;

  @Property({ type: "text", nullable: true })
  response?: string;

//   @Property({ type: "text", nullable: true })
//   responseBody?: string;

  @Property()
  responseTime!: number;

  @Property()
  timestamp!: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
