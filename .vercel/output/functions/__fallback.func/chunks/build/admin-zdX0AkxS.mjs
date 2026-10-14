import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useSupabase, a as useRates, R as REGION_LABELS } from './useRates-CKVCqFx5.mjs';
import { u as useHead } from './v3-Cqyy4I9j.mjs';
import './server.mjs';
import '../_/nitro.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabase();
    const { rates } = useRates();
    const user = ref(null);
    const checkingSession = ref(true);
    const email = ref("");
    const password = ref("");
    const busy = ref(false);
    const error = ref("");
    const saving = ref(false);
    const msg = ref("");
    const msgOk = ref(false);
    const autoSync = ref(true);
    const toggling = ref(false);
    const lastSyncedAt = ref(null);
    const lastSyncSource = ref(null);
    const syncing = ref(false);
    const syncMsg = ref("");
    const syncOk = ref(false);
    const draft = reactive({
      baghdad: { buy: 0, sell: 0 },
      north: { buy: 0, sell: 0 },
      south: { buy: 0, sell: 0 }
    });
    watch(
      () => ({ ...rates.value }),
      (r) => {
        for (const region of ["baghdad", "north", "south"]) {
          if (r[region]) {
            draft[region].buy = r[region].buy_price;
            draft[region].sell = r[region].sell_price;
          }
        }
      },
      { immediate: true, deep: true }
    );
    function shortTime(t) {
      return new Date(t).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" });
    }
    useHead({ title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u2014 \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-4 py-8" }, _attrs))}>`);
      if (!unref(user) && !unref(checkingSession)) {
        _push(`<div class="card p-6 md:p-8 max-w-sm mx-auto"><h1 class="font-bold text-xl mb-1 text-ink-strong"> \u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u0634\u0631\u0641</h1><p class="text-xs text-slate-500 mb-5">\u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u062D\u0645\u064A \u2014 \u0644\u0644\u0645\u0634\u0631\u0641\u064A\u0646 \u0641\u0642\u0637</p><form class="space-y-3"><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" class="input" dir="ltr"><input${ssrRenderAttr("value", unref(password))} type="password" required placeholder="\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" class="input" dir="ltr"><button type="submit" class="btn btn-primary w-full"${ssrIncludeBooleanAttr(unref(busy)) ? " disabled" : ""}>${ssrInterpolate(unref(busy) ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062F\u062E\u0648\u0644..." : "\u062F\u062E\u0648\u0644")}</button>`);
        if (unref(error)) {
          _push(`<p class="text-drop text-xs text-center">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div>`);
      } else if (unref(user)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div><h1 class="font-bold text-xl text-ink-strong"> \u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0645\u0634\u0631\u0641</h1><p class="text-xs text-muted">${ssrInterpolate(unref(user).email)}</p></div><button class="btn btn-ghost text-sm">\u062E\u0631\u0648\u062C</button></div><div class="card p-4 mb-5"><div class="flex items-center justify-between gap-3 mb-2"><div><h2 class="font-bold text-sm sm:text-base text-ink-strong">\u26A1 \u0645\u0632\u0627\u0645\u0646\u0629 IQWealth \u0627\u0644\u0622\u0644\u064A\u0629</h2><p class="text-[11px] text-muted mt-0.5">${ssrInterpolate(unref(autoSync) ? "\u0627\u0644\u0646\u0645\u0637 \u0627\u0644\u0622\u0644\u064A: \u064A\u064F\u0633\u062D\u0628 \u0633\u0639\u0631 \u0627\u0644\u062F\u0648\u0644\u0627\u0631 (\u0628\u063A\u062F\u0627\u062F) \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0645\u0646 \u0648\u0627\u062C\u0647\u0629 IQWealth \u0643\u0644 3 \u062F\u0642\u0627\u0626\u0642" : "\u0627\u0644\u0646\u0645\u0637 \u0627\u0644\u064A\u062F\u0648\u064A: \u0644\u0627 \u062A\u062D\u062F\u064A\u062B \u062A\u0644\u0642\u0627\u0626\u064A \u2014 \u0627\u0644\u062A\u0639\u062F\u064A\u0644 \u0645\u0646 \u0627\u0644\u062D\u0642\u0648\u0644 \u0623\u062F\u0646\u0627\u0647 \u0641\u0642\u0637")}</p></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", unref(autoSync))}${ssrIncludeBooleanAttr(unref(toggling)) ? " disabled" : ""} class="${ssrRenderClass([unref(autoSync) ? "bg-brand-600" : "bg-slate-300", "relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors items-center"])}"><span class="${ssrRenderClass([unref(autoSync) ? "translate-x-7" : "translate-x-1", "inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform"])}"></span></button></div><div class="flex items-center justify-between gap-3 flex-wrap"><p class="text-[11px] text-slate-400">`);
        if (unref(lastSyncedAt)) {
          _push(`<!--[-->\u0622\u062E\u0631 \u0645\u0632\u0627\u0645\u0646\u0629 API: ${ssrInterpolate(shortTime(unref(lastSyncedAt)))} \u2014 ${ssrInterpolate(unref(lastSyncSource) === "iqwealth-api" ? "IQWealth \u2705" : "\u0641\u0634\u0644\u062A \u26A0\uFE0F")}<!--]-->`);
        } else {
          _push(`<!--[-->\u0644\u0645 \u062A\u062A\u0645 \u0623\u064A \u0645\u0632\u0627\u0645\u0646\u0629 API \u0628\u0639\u062F<!--]-->`);
        }
        _push(`</p><button class="btn btn-primary h-10 min-h-0 px-3 text-xs"${ssrIncludeBooleanAttr(unref(syncing)) ? " disabled" : ""}>${ssrInterpolate(unref(syncing) ? "\u062C\u0627\u0631\u064D \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629..." : "\u{1F504} \u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u0622\u0646")}</button></div>`);
        if (unref(syncMsg)) {
          _push(`<p class="${ssrRenderClass([unref(syncOk) ? "text-gain" : "text-drop", "text-xs mt-2 text-center"])}">${ssrInterpolate(unref(syncMsg))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(autoSync)) {
          _push(`<p class="text-[11px] text-amber-600 mt-2"> \u26A0\uFE0F \u0627\u0644\u0646\u0645\u0637 \u0627\u0644\u064A\u062F\u0648\u064A \u0645\u064F\u0641\u0639\u064E\u0651\u0644: \u0628\u064A\u0627\u0646\u0627\u062A API \u0644\u0646 \u062A\u064F\u062D\u062F\u064E\u0651\u062B \u2014 \u064A\u062A\u0648\u0641\u0631 \u0632\u0631 \xAB\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u0622\u0646\xBB \u0644\u0633\u062D\u0628 \u0627\u0644\u0642\u064A\u0645 \u064A\u062F\u0648\u064A\u0627\u064B \u0648\u0642\u062A\u0645\u0627 \u062A\u0631\u064A\u062F. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid gap-4"><!--[-->`);
        ssrRenderList(unref(rates), (row, region) => {
          _push(`<div class="card p-4"><div class="flex items-center justify-between mb-3"><h2 class="font-bold text-ink-strong">${ssrInterpolate(unref(REGION_LABELS)[region].ar)}</h2><span class="text-[11px] text-muted price-tabular">\u0622\u062E\u0631 \u062A\u062D\u062F\u064A\u062B: ${ssrInterpolate(shortTime(row.updated_at))}</span></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-[11px] text-gain mb-1 font-bold"> \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0644\u0644\u0645\u0648\u0627\u0637\u0646 (IQD) </label><input${ssrRenderAttr("value", unref(draft)[region].sell)} type="number" min="0" step="250" class="input tabular-nums" dir="ltr"></div><div><label class="block text-[11px] text-brand-600 mb-1 font-bold"> \u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0646 \u0627\u0644\u0645\u0648\u0627\u0637\u0646 (IQD) </label><input${ssrRenderAttr("value", unref(draft)[region].buy)} type="number" min="0" step="250" class="input tabular-nums" dir="ltr"></div></div></div>`);
        });
        _push(`<!--]--></div><div class="sticky bottom-4 mt-5"><button class="btn btn-primary w-full shadow-lg min-h-[48px]"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062D\u0641\u0638 \u0648\u0627\u0644\u0628\u062B..." : " \u062D\u0641\u0638 \u0648\u0628\u062B \u0627\u0644\u062A\u062D\u062F\u064A\u062B")}</button>`);
        if (unref(msg)) {
          _push(`<p class="${ssrRenderClass([unref(msgOk) ? "text-gain" : "text-drop", "text-center text-sm mt-2"])}">${ssrInterpolate(unref(msg))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="py-20 text-center text-slate-400">\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062C\u0644\u0633\u0629...</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-zdX0AkxS.mjs.map
