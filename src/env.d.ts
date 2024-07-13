/// <reference path="../.astro/env.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference path="../worker-configuration.d.ts" />
/// <reference types="astro/client" />

type D1Database = import('@cloudflare/workers-types').D1Database
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

type Runtime = import('@astrojs/cloudflare').Runtime<Env>
declare namespace App {
  interface Locals extends Runtime { }
}
