import { defineComponent, mergeProps, unref, computed, ref, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { a as useRates, R as REGION_LABELS } from './useRates-BTUaTxag.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "RateCard",
  __ssrInlineRender: true,
  props: {
    region: {}
  },
  setup(__props) {
    const props = __props;
    const { rates, prev, agoText } = useRates();
    const rate = computed(() => rates.value[props.region]);
    const label = REGION_LABELS[props.region];
    const dir = ref("");
    const changed = computed(
      () => dir.value === "up" || dir.value === "down" || dir.value === "up-s" || dir.value === "down-s"
    );
    watch(
      () => rates.value[props.region],
      (n) => {
        const p = prev.value[props.region];
        if (!n || !p) return;
        if (n.sell_price > p.sell) dir.value = "up";
        else if (n.sell_price < p.sell) dir.value = "down";
        else if (n.buy_price > p.buy) dir.value = "up-s";
        else if (n.buy_price < p.buy) dir.value = "down-s";
        setTimeout(() => dir.value = "", 1e3);
      }
    );
    function fmt(v) {
      if (v == null) return "\u2014";
      return v.toLocaleString("en-US");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card p-4 sm:p-6 h-full" }, _attrs))}><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2 sm:gap-3"><span class="text-2xl sm:text-3xl">${ssrInterpolate(unref(label).icon)}</span><div><h3 class="font-bold text-base sm:text-xl leading-tight text-slate-800 dark:text-slate-100">${ssrInterpolate(unref(label).ar)}</h3><p class="text-[11px] sm:text-xs text-muted dark:text-slate-400">${ssrInterpolate(unref(label).en)}</p></div></div><div class="text-left shrink-0"><div class="${ssrRenderClass([unref(changed) ? "bg-cyan-highlight live-dot" : "bg-slate-300 dark:bg-slate-700", "h-2 w-2 rounded-full mb-1 inline-block"])}"></div><p class="text-[11px] text-muted dark:text-slate-500">${ssrInterpolate(unref(agoText)())}</p></div></div><div class="grid grid-cols-2 gap-2.5 sm:gap-3"><div class="rounded-xl bg-mint/10 border border-mint/30 p-2.5 sm:p-4"><p class="text-[10px] sm:text-xs font-bold text-mint-dark dark:text-mint mb-1"> \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0644\u0644\u0645\u0648\u0627\u0637\u0646 </p><p class="${ssrRenderClass([unref(dir) === "up" ? "flash-up" : unref(dir) === "down" ? "flash-down" : "", "price-tabular num-update text-lg sm:text-2xl lg:text-[1.75rem] font-extrabold text-mint-dark dark:text-mint"])}">${ssrInterpolate(fmt((_a = unref(rate)) == null ? void 0 : _a.sell_price))}</p></div><div class="rounded-xl bg-primary-50 dark:bg-brand-500/10 border border-primary-100 dark:border-brand-500/30 p-2.5 sm:p-4"><p class="text-[10px] sm:text-xs font-bold text-primary-700 dark:text-brand-500 mb-1"> \u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0646 \u0627\u0644\u0645\u0648\u0627\u0637\u0646 </p><p class="${ssrRenderClass([unref(dir) === "up-s" ? "flash-up" : unref(dir) === "down-s" ? "flash-down" : "", "price-tabular num-update text-lg sm:text-2xl lg:text-[1.75rem] font-extrabold text-primary-700 dark:text-brand-500"])}">${ssrInterpolate(fmt((_b = unref(rate)) == null ? void 0 : _b.buy_price))}</p></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RateCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RateCalculator",
  __ssrInlineRender: true,
  setup(__props) {
    const selected = ref("baghdad");
    const direction = ref("usd2iqd");
    const amount = ref(null);
    const { rates } = useRates();
    const rate = computed(() => rates.value[selected.value]);
    const regionOptions = REGION_LABELS;
    const youAreSelling = computed(
      () => direction.value === "usd2iqd" ? "\u062F\u0648\u0644\u0627\u0631\u0627\u062A\u0643" : "\u062F\u064A\u0646\u0627\u0631\u0627\u062A\u0643"
    );
    const youAreBuying = computed(
      () => direction.value === "usd2iqd" ? "\u062F\u0648\u0644\u0627\u0631\u0627\u062A" : "\u062F\u064A\u0646\u0627\u0631\u0627\u062A"
    );
    const sellResult = computed(() => {
      if (!amount.value || !rate.value) return 0;
      const r = direction.value === "usd2iqd" ? rate.value.buy_price : 1 / rate.value.buy_price;
      return Math.floor(amount.value * r);
    });
    const buyResult = computed(() => {
      if (!amount.value || !rate.value) return 0;
      const r = direction.value === "usd2iqd" ? rate.value.sell_price : 1 / rate.value.sell_price;
      return Math.floor(amount.value * r * 1e3) / 1e3;
    });
    const spread = computed(
      () => rate.value ? rate.value.sell_price - rate.value.buy_price : 0
    );
    function fmt(v) {
      if (v == null || isNaN(v)) return "\u2014";
      return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card p-4 sm:p-6 lg:p-8" }, _attrs))}><div class="flex items-center justify-between mb-4 flex-wrap gap-3"><h2 class="font-bold text-base sm:text-xl text-slate-800 dark:text-slate-100">\u{1F9EE} \u0622\u0644\u0629 \u062D\u0627\u0633\u0628\u0629 \u0645\u062A\u0642\u062F\u0645\u0629</h2><div class="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden text-xs sm:text-sm"><!--[-->`);
      ssrRenderList(unref(regionOptions), (r, key) => {
        _push(`<button class="${ssrRenderClass([unref(selected) === key ? "bg-brand-600 text-white" : "text-muted hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800", "px-3 sm:px-4 min-h-[44px] sm:min-h-[48px] font-bold transition-colors"])}">${ssrInterpolate(r.ar)}</button>`);
      });
      _push(`<!--]--></div></div><div class="grid md:grid-cols-2 gap-4 lg:gap-6"><div><div class="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden mb-3 text-sm"><button class="${ssrRenderClass([unref(direction) === "usd2iqd" ? "bg-brand-600 text-white" : "text-muted hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800", "flex-1 min-h-[48px] font-bold transition-colors"])}"> USD \u2192 IQD </button><button class="${ssrRenderClass([unref(direction) === "iqd2usd" ? "bg-brand-600 text-white" : "text-muted hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800", "flex-1 min-h-[48px] font-bold transition-colors"])}"> IQD \u2192 USD </button></div><div class="relative"><input${ssrRenderAttr("value", unref(amount))} type="number" min="0" inputmode="decimal" class="input text-xl sm:text-2xl font-extrabold price-tabular"${ssrRenderAttr("placeholder", unref(direction) === "usd2iqd" ? "\u062F\u0648\u0644\u0627\u0631..." : "\u062F\u064A\u0646\u0627\u0631...")}${ssrRenderAttr("dir", unref(direction) === "usd2iqd" ? "ltr" : "rtl")}><span class="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted font-bold">${ssrInterpolate(unref(direction) === "usd2iqd" ? "$" : "IQD")}</span></div></div><div class="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden"><div class="p-3 sm:p-4 bg-mint/5"><div class="flex justify-between items-center gap-3"><div class="min-w-0"><p class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">\u{1F4B0} \u0625\u0630\u0627 \u0628\u0639\u062A ${ssrInterpolate(unref(youAreSelling))} \u0644\u0644\u0645\u062D\u0644</p><p class="text-[11px] text-muted">\u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621 \u0645\u0646 \u0627\u0644\u0645\u0648\u0627\u0637\u0646: ${ssrInterpolate(fmt((_a = unref(rate)) == null ? void 0 : _a.buy_price))}</p></div><p class="price-tabular text-base sm:text-xl lg:text-2xl font-extrabold text-mint-dark dark:text-mint shrink-0"${ssrRenderAttr("dir", unref(direction) === "usd2iqd" ? "rtl" : "ltr")}>${ssrInterpolate(fmt(unref(sellResult)))}</p></div></div><div class="p-3 sm:p-4 bg-primary-50/50 dark:bg-brand-500/5"><div class="flex justify-between items-center gap-3"><div class="min-w-0"><p class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">\u{1F6D2} \u0625\u0630\u0627 \u0627\u0634\u0631\u064A\u062A ${ssrInterpolate(unref(youAreBuying))} \u0645\u0646 \u0627\u0644\u0645\u062D\u0644</p><p class="text-[11px] text-muted">\u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0644\u0644\u0645\u0648\u0627\u0637\u0646: ${ssrInterpolate(fmt((_b = unref(rate)) == null ? void 0 : _b.sell_price))}</p></div><p class="price-tabular text-base sm:text-xl lg:text-2xl font-extrabold text-primary-700 dark:text-brand-500 shrink-0"${ssrRenderAttr("dir", unref(direction) === "usd2iqd" ? "rtl" : "ltr")}>${ssrInterpolate(fmt(unref(buyResult)))}</p></div></div><div class="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/40 text-center"><p class="text-[10px] sm:text-xs text-muted"> \u0627\u0644\u0641\u0631\u0642 \u0628\u064A\u0646 \u0627\u0644\u0628\u064A\u0639 \u0648\u0627\u0644\u0634\u0631\u0627\u0621 (\u0633\u0639\u0631 \u0627\u0644\u0645\u062D\u0644): ${ssrInterpolate(fmt(unref(spread)))} IQD \u0644\u0643\u0644 \u062F\u0648\u0644\u0627\u0631 </p></div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RateCalculator.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { loading, agoText } = useRates();
    useHead({
      title: "\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A \u2014 \u0633\u0639\u0631 \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u064A\u0648\u0645 \u0641\u064A \u0628\u063A\u062F\u0627\u062F \u0648\u0623\u0631\u0628\u064A\u0644 \u0648\u0627\u0644\u0628\u0635\u0631\u0629"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RateCard = _sfc_main$2;
      const _component_RateCalculator = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10" }, _attrs))}><section class="text-center mb-6 sm:mb-10"><h1 class="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-primary-700 dark:text-white mb-2"> \u0633\u0639\u0631 \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u064A\u0648\u0645 \u0641\u064A \u0627\u0644\u0639\u0631\u0627\u0642 </h1><p class="text-muted dark:text-slate-400 text-sm sm:text-base lg:text-lg"> USD \u2194 IQD \xB7 \u0628\u063A\u062F\u0627\u062F \xB7 \u0627\u0644\u0634\u0645\u0627\u0644 \xB7 \u0627\u0644\u062C\u0646\u0648\u0628 \u2014 \u062A\u062D\u062F\u064A\u062B \u0644\u062D\u0638\u064A \u0645\u0628\u0627\u0634\u0631 </p><p class="mt-2 text-xs sm:text-sm text-muted dark:text-slate-500" aria-live="polite"> \u0622\u062E\u0631 \u062A\u062D\u062F\u064A\u062B: <span class="font-bold text-primary-700 dark:text-cyan-highlight">${ssrInterpolate(unref(agoText)())}</span></p></section>`);
      if (unref(loading)) {
        _push(`<section class="grid gap-4 sm:gap-5 md:grid-cols-3" aria-busy="true"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="card p-5 sm:p-6 animate-pulse"><div class="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div><div class="grid grid-cols-2 gap-3"><div class="h-16 sm:h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div><div class="h-16 sm:h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div></div></div>`);
        });
        _push(`<!--]--></section>`);
      } else {
        _push(`<section class="grid gap-4 sm:gap-5 md:grid-cols-3">`);
        _push(ssrRenderComponent(_component_RateCard, { region: "baghdad" }, null, _parent));
        _push(ssrRenderComponent(_component_RateCard, { region: "north" }, null, _parent));
        _push(ssrRenderComponent(_component_RateCard, { region: "south" }, null, _parent));
        _push(`</section>`);
      }
      _push(`<section class="mt-6 sm:mt-10">`);
      _push(ssrRenderComponent(_component_RateCalculator, null, null, _parent));
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Buyienjy.mjs.map
