import { d as defineEventHandler, a as useSupabaseAdmin } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/functions-js';
import '@supabase/postgrest-js';
import '@supabase/realtime-js';
import '@supabase/storage-js';
import '@supabase/auth-js';

const index_get = defineEventHandler(async () => {
  var _a, _b, _c, _d;
  const sb = useSupabaseAdmin();
  const [rates, settings] = await Promise.all([
    sb.from("rates").select("*").order("region"),
    sb.from("app_settings").select("auto_sync, last_synced_at, last_sync_source, last_sync_error").eq("id", 1).single()
  ]);
  return {
    rates: (_a = rates.data) != null ? _a : [],
    settings: (_b = settings.data) != null ? _b : null,
    errors: [(_c = rates.error) == null ? void 0 : _c.message, (_d = settings.error) == null ? void 0 : _d.message].filter(Boolean)
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
