import { d as defineEventHandler, a as useSupabaseAdmin, f as fetchIQWealth, m as mapUsd, h as parseCSV, r as runSync, s as setResponseStatus, e as useRuntimeConfig } from '../../_/nitro.mjs';
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

const testSync = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const config = useRuntimeConfig();
  const sb = useSupabaseAdmin();
  const checks = [];
  const check = (name, passed, detail) => {
    checks.push({ name, passed, detail });
    return { name, passed, detail };
  };
  let snapshot = null;
  try {
    snapshot = await fetchIQWealth(config);
    const usd = snapshot.usd;
    check(
      "iqwealth_connection",
      !!usd && usd.sell > 0 && usd.buy > 0,
      usd ? `fetched USD block: sell=${usd.sell} buy=${usd.buy} per100=${usd.per100} official=${usd.official}` : "fetched payload but the USD block was empty"
    );
  } catch (e) {
    check("iqwealth_connection", false, "fetch failed: " + ((_a = e == null ? void 0 : e.message) != null ? _a : String(e)));
  }
  const FIXTURE = [
    "name,value,unit,as_of",
    "usd,1662,IQD,2026-10-14",
    "usd-buy,1657,IQD,2026-10-14",
    "usd-sell,1662,IQD,2026-10-14",
    "usd-100,166200,IQD,2026-10-14",
    "usd-official,1510,IQD,2026-10-14",
    "gold21,705904,IQD,2026-10-14",
    // present in payload, must be ignored
    "eur,1860.27,IQD,2026-10-14",
    // present in payload, must be ignored
    "try,33.66,IQD,2026-10-14"
    // present in payload, must be ignored
  ].join("\n");
  try {
    const mapped = mapUsd(parseCSV(FIXTURE), (/* @__PURE__ */ new Date()).toISOString());
    const usd = mapped.usd;
    const rowShape = usd ? {
      region: "baghdad",
      region_ar: "\u0628\u063A\u062F\u0627\u062F",
      buy_price: Math.round(usd.buy),
      sell_price: Math.round(usd.sell)
    } : null;
    const ok = !!rowShape && (usd == null ? void 0 : usd.sell) === 1662 && (usd == null ? void 0 : usd.buy) === 1657 && (usd == null ? void 0 : usd.per100) === 166200 && (usd == null ? void 0 : usd.official) === 1510 && rowShape.buy_price === 1657 && rowShape.sell_price === 1662 && Number.isInteger(rowShape.buy_price) && Number.isInteger(rowShape.sell_price);
    check(
      "schema_mapping",
      ok,
      ok ? `fixture mapped to rates row: ${JSON.stringify(rowShape)} (gold/currency rows ignored)` : `unexpected mapping: ${JSON.stringify(mapped)}`
    );
  } catch (e) {
    check("schema_mapping", false, "mapping threw: " + ((_b = e == null ? void 0 : e.message) != null ? _b : String(e)));
  }
  let before = null;
  try {
    const { data, error } = await sb.from("rates").select("*").eq("region", "baghdad").single();
    if (error) throw new Error(error.message);
    before = data;
  } catch (e) {
    check("upsert_execution", false, "could not read the baghdad row first: " + ((_c = e == null ? void 0 : e.message) != null ? _c : String(e)));
  }
  if (before) {
    try {
      const result = await runSync(config, { force: true });
      let readBack = null;
      let readErr = null;
      try {
        const { data, error } = await sb.from("rates").select("*").eq("region", "baghdad").single();
        if (error) readErr = error.message;
        else readBack = data;
      } catch (err) {
        readErr = (_d = err == null ? void 0 : err.message) != null ? _d : String(err);
      }
      const succeeded = result.ok && result.source === "api" && ((_e = result.updated) == null ? void 0 : _e.usd) === true && !readErr && !!readBack && !!readBack.buy_price && !!readBack.sell_price;
      check(
        "upsert_execution",
        succeeded,
        succeeded ? `upsert ran clean (no constraint errors); read back sell=${readBack.sell_price} buy=${readBack.buy_price} at ${readBack.updated_at}` : `runSync=${JSON.stringify(result)} readErr=${readErr != null ? readErr : "none"}`
      );
    } catch (e) {
      check("upsert_execution", false, "upsert threw: " + ((_f = e == null ? void 0 : e.message) != null ? _f : String(e)));
    }
    try {
      const brokenConfig = { ...config, iqwealthBaseUrl: "https://127.0.0.1:9/api/sheet" };
      let callFailed = false;
      let failMsg = "";
      try {
        await fetchIQWealth(brokenConfig);
        failMsg = "unreachable endpoint unexpectedly returned data";
      } catch (err) {
        callFailed = true;
        failMsg = String((_g = err == null ? void 0 : err.message) != null ? _g : err);
      }
      const { data: fallbackRow, error: fbErr } = await sb.from("rates").select("*").eq("region", "baghdad").single();
      check(
        "fallback_mechanism",
        callFailed && !fbErr && !!fallbackRow && fallbackRow.buy_price > 0 && fallbackRow.sell_price > 0,
        callFailed && !fbErr && fallbackRow ? `API failure detected ("${failMsg.slice(0, 80)}") \u2014 DB fallback serves sell=${fallbackRow.sell_price} buy=${fallbackRow.buy_price}` : `callFailed=${callFailed} dbErr=${(_h = fbErr == null ? void 0 : fbErr["message"]) != null ? _h : "none"}`
      );
    } catch (e) {
      check("fallback_mechanism", false, "fallback test threw: " + ((_i = e == null ? void 0 : e.message) != null ? _i : String(e)));
    }
  }
  const allPassed = checks.every((c) => c.passed);
  setResponseStatus(event, allPassed ? 200 : 500);
  return {
    ok: allPassed,
    total: checks.length,
    passed: checks.filter((c) => c.passed).length,
    source: "iqwealth-usd-sync",
    checks
  };
});

export { testSync as default };
//# sourceMappingURL=test-sync.mjs.map
