import { MikroORM } from "@mikro-orm/core";
import config from "../../mikro-orm.config";

let orm: MikroORM | null = null;

export async function getOrm() {
  if (!orm) {
    orm = await MikroORM.init(config);
  }
  return orm;
}

export async function getEntityManager() {
  const orm = await getOrm();
  return orm.em;
}