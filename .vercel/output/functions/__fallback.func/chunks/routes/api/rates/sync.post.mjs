import { d as defineEventHandler, b as getQuery, c as getHeader, s as setResponseStatus, a as useSupabaseAdmin, r as runSync, e as useRuntimeConfig } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const sync_post = defineEventHandler(async (event) => {
  var _a, _b;
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const force = query.force === "true";
  if (force) {
    const auth = (_b = (_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace(/^Bearer\s+/i, "")) != null ? _b : "";
    if (!auth) {
      setResponseStatus(event, 401);
      return { ok: false, error: "\u{1F512} \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u064A\u062F\u0648\u064A\u0629 \u062A\u062A\u0637\u0644\u0628 \u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u0634\u0631\u0641" };
    }
    const { data: userData, error } = await useSupabaseAdmin().auth.getUser(auth);
    if (error || !(userData == null ? void 0 : userData.user)) {
      setResponseStatus(event, 401);
      return { ok: false, error: "\u{1F512} \u062C\u0644\u0633\u0629 \u0627\u0644\u0645\u0634\u0631\u0641 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629 \u2014 \u0633\u062C\u0651\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u0646 \u062C\u062F\u064A\u062F" };
    }
  }
  const result = await runSync(config, { force });
  if (!result.ok) {
    setResponseStatus(event, 502);
  }
  return result;
});

export { sync_post as default };
//# sourceMappingURL=sync.post.mjs.map
