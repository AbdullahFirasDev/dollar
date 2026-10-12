import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useSupabase, a as useRates, R as REGION_LABELS } from './useRates-BTUaTxag.mjs';
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
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/supabase-js';

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
        _push(`<div class="card p-6 md:p-8 max-w-sm mx-auto"><h1 class="font-bold text-xl mb-1">\u{1F510} \u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u0634\u0631\u0641</h1><p class="text-xs text-slate-500 mb-5">\u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u062D\u0645\u064A \u2014 \u0644\u0644\u0645\u0634\u0631\u0641\u064A\u0646 \u0641\u0642\u0637</p><form class="space-y-3"><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" class="input" dir="ltr"><input${ssrRenderAttr("value", unref(password))} type="password" required placeholder="\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" class="input" dir="ltr"><button type="submit" class="btn btn-primary w-full"${ssrIncludeBooleanAttr(unref(busy)) ? " disabled" : ""}>${ssrInterpolate(unref(busy) ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062F\u062E\u0648\u0644..." : "\u062F\u062E\u0648\u0644")}</button>`);
        if (unref(error)) {
          _push(`<p class="text-red-500 text-xs text-center">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div>`);
      } else if (unref(user)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div><h1 class="font-bold text-xl">\u2699\uFE0F \u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0645\u0634\u0631\u0641</h1><p class="text-xs text-slate-500">${ssrInterpolate(unref(user).email)}</p></div><button class="btn btn-ghost text-sm">\u062E\u0631\u0648\u062C</button></div><div class="grid gap-4"><!--[-->`);
        ssrRenderList(unref(rates), (row, region) => {
          _push(`<div class="card p-4"><div class="flex items-center justify-between mb-3"><h2 class="font-bold">${ssrInterpolate(unref(REGION_LABELS)[region].icon)} ${ssrInterpolate(unref(REGION_LABELS)[region].ar)}</h2><span class="text-[11px] text-slate-400">\u0622\u062E\u0631 \u062A\u062D\u062F\u064A\u062B: ${ssrInterpolate(shortTime(row.updated_at))}</span></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-[11px] text-mint-dark dark:text-mint mb-1 font-bold"> \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0644\u0644\u0645\u0648\u0627\u0637\u0646 (IQD) </label><input${ssrRenderAttr("value", unref(draft)[region].sell)} type="number" min="0" step="250" class="input tabular-nums" dir="ltr"></div><div><label class="block text-[11px] text-primary-700 dark:text-brand-500 mb-1 font-bold"> \u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0646 \u0627\u0644\u0645\u0648\u0627\u0637\u0646 (IQD) </label><input${ssrRenderAttr("value", unref(draft)[region].buy)} type="number" min="0" step="250" class="input tabular-nums" dir="ltr"></div></div></div>`);
        });
        _push(`<!--]--></div><div class="sticky bottom-4 mt-5"><button class="btn btn-primary w-full shadow-lg min-h-[48px]"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062D\u0641\u0638 \u0648\u0627\u0644\u0628\u062B..." : "\u{1F4BE} \u062D\u0641\u0638 \u0648\u0628\u062B \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0632\u0648\u0627\u0631")}</button>`);
        if (unref(msg)) {
          _push(`<p class="${ssrRenderClass([unref(msgOk) ? "text-mint-dark dark:text-mint" : "text-red-500", "text-center text-sm mt-2"])}">${ssrInterpolate(unref(msg))}</p>`);
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
//# sourceMappingURL=admin-Dh5Kd_zG.mjs.map
