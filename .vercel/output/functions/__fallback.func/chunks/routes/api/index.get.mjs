import { d as defineEventHandler, s as sbSelect, a as sbSingle } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const index_get = defineEventHandler(async () => {
  var _a, _b, _c, _d;
  const [rates, settings] = await Promise.all([
    sbSelect("rates", { select: "*", order: "region" }),
    sbSingle("app_settings", {
      select: "auto_sync, last_synced_at, last_sync_source, last_sync_error",
      eq: { id: 1 }
    })
  ]);
  return {
    rates: (_a = rates.data) != null ? _a : [],
    settings: (_b = settings.data) != null ? _b : null,
    errors: [(_c = rates.error) == null ? void 0 : _c.message, (_d = settings.error) == null ? void 0 : _d.message].filter(Boolean)
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
