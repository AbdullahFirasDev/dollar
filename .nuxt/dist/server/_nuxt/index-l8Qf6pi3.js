import { defineComponent, computed, ref, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { u as useRates, R as REGION_LABELS } from "./useRates-SVAc-SFi.js";
import { u as useHead } from "./v3-Cqyy4I9j.js";
import "../server.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/xampp/htdocs/dIQD/node_modules/hookable/dist/index.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/unctx/dist/index.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/xampp/htdocs/dIQD/node_modules/defu/dist/defu.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/ufo/dist/index.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
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
      if (v == null) return "—";
      return v.toLocaleString("en-US");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "card card-hover p-4 sm:p-6 h-full group",
        role: "group",
        "aria-label": unref(label).ar
      }, _attrs))}><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2.5"><span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-brand-600 transition-transform duration-200 ease-in-out group-hover:scale-105"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></span><div><h3 class="font-bold text-base sm:text-lg leading-tight text-ink-strong">${ssrInterpolate(unref(label).ar)}</h3><p class="text-[11px] text-muted">${ssrInterpolate(unref(label).en)}</p></div></div><div class="text-left shrink-0"><span class="${ssrRenderClass([unref(changed) ? "bg-accent" : "bg-slate-300", "block h-2 w-2 rounded-full mb-1 ml-auto transition-colors duration-200"])}"></span><p class="text-[11px] text-muted price-tabular">${ssrInterpolate(unref(agoText)())}</p></div></div><div class="grid grid-cols-2 gap-3"><div class="rounded-xl bg-gain-soft p-3 sm:p-4 transition-all duration-200 ease-in-out"><p class="text-[10px] sm:text-xs font-bold text-gain mb-1"> سعر البيع للمواطن (لكل 100$) </p><p class="${ssrRenderClass([unref(dir) === "up" ? "flash-up" : unref(dir) === "down" ? "flash-down" : "", "price-tabular num-update text-xl sm:text-2xl font-extrabold text-ink-strong"])}">${ssrInterpolate(fmt(unref(rate)?.sell_price * 100))}</p><p class="text-[10px] text-muted mt-1"><span class="${ssrRenderClass([unref(dir) === "up" ? "text-gain" : unref(dir) === "down" ? "text-drop" : "", "font-bold"])}">${ssrInterpolate(unref(dir) === "up" ? "▲" : unref(dir) === "down" ? "▼" : "")}</span> مقابل 100 دولار </p></div><div class="rounded-xl bg-primary-50 p-3 sm:p-4 transition-all duration-200 ease-in-out"><p class="text-[10px] sm:text-xs font-bold text-brand-600 mb-1"> سعر الشراء من المواطن (لكل 100$) </p><p class="${ssrRenderClass([unref(dir) === "up-s" ? "flash-up" : unref(dir) === "down-s" ? "flash-down" : "", "price-tabular num-update text-xl sm:text-2xl font-extrabold text-ink-strong"])}">${ssrInterpolate(fmt(unref(rate)?.buy_price * 100))}</p><p class="text-[10px] text-muted mt-1"><span class="${ssrRenderClass([unref(dir) === "up-s" ? "text-gain" : unref(dir) === "down-s" ? "text-drop" : "", "font-bold"])}">${ssrInterpolate(unref(dir) === "up-s" ? "▲" : unref(dir) === "down-s" ? "▼" : "")}</span> مقابل 100 دولار </p></div></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RateCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
      () => direction.value === "usd2iqd" ? "دولاراتك" : "ديناراتك"
    );
    const youAreBuying = computed(
      () => direction.value === "usd2iqd" ? "دولارات" : "دينارات"
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
      if (v == null || isNaN(v)) return "—";
      return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
    function fmtDisplay(v) {
      if (v == null || isNaN(v)) return "—";
      return v.toLocaleString("en-US");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card p-4 sm:p-6 lg:p-8 h-full" }, _attrs))}><div class="flex items-center justify-between mb-4 flex-wrap gap-3"><h2 class="font-bold text-base sm:text-xl text-ink-strong">آلة حاسبة</h2><div class="flex rounded-xl border border-slate-200/80 bg-page p-1 gap-1 text-xs sm:text-sm" role="tablist" aria-label="اختيار المنطقة"><!--[-->`);
      ssrRenderList(unref(regionOptions), (r, key) => {
        _push(`<button class="${ssrRenderClass([unref(selected) === key ? "bg-brand-600 text-white shadow-sm" : "text-muted hover:bg-surface hover:text-ink", "px-3 sm:px-4 min-h-[40px] rounded-lg font-bold transition-all duration-200 ease-in-out"])}" role="tab"${ssrRenderAttr("aria-selected", unref(selected) === key)}>${ssrInterpolate(r.ar)}</button>`);
      });
      _push(`<!--]--></div></div><div class="grid md:grid-cols-2 gap-4 lg:gap-6"><div><div class="flex rounded-xl border border-slate-200/80 bg-page p-1 gap-1 mb-3 text-sm" role="tablist" aria-label="اتجاه التحويل"><button class="${ssrRenderClass([unref(direction) === "usd2iqd" ? "bg-brand-600 text-white shadow-sm" : "text-muted hover:bg-surface hover:text-ink", "flex-1 min-h-[44px] rounded-lg font-bold transition-all duration-200 ease-in-out"])}" role="tab"${ssrRenderAttr("aria-selected", unref(direction) === "usd2iqd")}> USD → IQD </button><button class="${ssrRenderClass([unref(direction) === "iqd2usd" ? "bg-brand-600 text-white shadow-sm" : "text-muted hover:bg-surface hover:text-ink", "flex-1 min-h-[44px] rounded-lg font-bold transition-all duration-200 ease-in-out"])}" role="tab"${ssrRenderAttr("aria-selected", unref(direction) === "iqd2usd")}> IQD → USD </button></div><div class="relative"><input${ssrRenderAttr("value", unref(amount))} type="number" min="0" inputmode="decimal" class="input text-xl sm:text-2xl font-extrabold price-tabular font-[&#39;Cairo&#39;]"${ssrRenderAttr("placeholder", unref(direction) === "usd2iqd" ? "دولار..." : "دينار...")}${ssrRenderAttr("dir", unref(direction) === "usd2iqd" ? "ltr" : "rtl")}><span class="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted font-bold">${ssrInterpolate(unref(direction) === "usd2iqd" ? "$" : "IQD")}</span></div></div><div class="rounded-xl border border-slate-200/80 divide-y divide-slate-200/80 overflow-hidden"><div class="p-3 sm:p-4 bg-gain-soft"><div class="flex justify-between items-center gap-3"><div class="min-w-0"><p class="text-xs sm:text-sm font-bold text-ink">إذا بعت ${ssrInterpolate(unref(youAreSelling))} للمنفذ</p><p class="text-[11px] text-muted"> سعر الشراء من المواطن (لكل 100$): ${ssrInterpolate(fmtDisplay(unref(rate)?.buy_price * 100))}</p></div><p class="price-tabular text-base sm:text-xl lg:text-2xl font-extrabold text-ink-strong shrink-0"${ssrRenderAttr("dir", unref(direction) === "usd2iqd" ? "rtl" : "ltr")}>${ssrInterpolate(fmt(unref(sellResult)))}</p></div></div><div class="p-3 sm:p-4 bg-primary-50"><div class="flex justify-between items-center gap-3"><div class="min-w-0"><p class="text-xs sm:text-sm font-bold text-ink">إذا اشريت ${ssrInterpolate(unref(youAreBuying))} من المنفذ</p><p class="text-[11px] text-muted"> سعر البيع للمواطن (لكل 100$): ${ssrInterpolate(fmtDisplay(unref(rate)?.sell_price * 100))}</p></div><p class="price-tabular text-base sm:text-xl lg:text-2xl font-extrabold text-ink-strong shrink-0"${ssrRenderAttr("dir", unref(direction) === "usd2iqd" ? "rtl" : "ltr")}>${ssrInterpolate(fmt(unref(buyResult)))}</p></div></div><div class="p-2.5 sm:p-3 bg-page text-center"><p class="text-[10px] sm:text-xs text-muted"> الفرق بين البيع والشراء (سعر المحل): ${ssrInterpolate(fmt(unref(spread) * 100))} IQD لكل 100 دولار </p></div></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RateCalculator.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PwaCtaCard",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const showIosModal = ref(false);
    ref(false);
    const perks = [
      "تحديث لحظي مباشر للأسعار",
      "يعمل حتى مع ضعف الإنترنت",
      "لا يحتاج مساحة تخزين كبيرة"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card card-hover relative overflow-hidden p-5 sm:p-6 h-full flex flex-col" }, _attrs))}><span class="absolute inset-x-0 top-0 h-1.5 bg-brand-600" aria-hidden="true"></span><div class="flex items-center gap-3 mb-3"><span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-brand-600 shrink-0"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></span><div><h3 class="font-bold text-base sm:text-lg text-ink-strong leading-tight">حمّل التطبيق</h3><p class="text-[11px] text-muted leading-tight">الدولار العراقي — PWA</p></div></div><p class="text-sm text-muted leading-relaxed mb-5"> ثبّت التطبيق على هاتفك تثبيتاً مباشراً — يعمل بدون إنترنت ويفتح أسرع بكثير من المتصفح في المرة القادمة. </p><ul class="space-y-2 mb-6"><!--[-->`);
      ssrRenderList(perks, (perk) => {
        _push(`<li class="flex items-center gap-2 text-xs text-ink"><span class="flex h-4 w-4 items-center justify-center rounded-full bg-gain-soft text-gain shrink-0"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg></span> ${ssrInterpolate(perk)}</li>`);
      });
      _push(`<!--]--></ul><button class="btn btn-primary w-full mt-auto gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg><span>تحميل التطبيق</span></button>`);
      if (unref(showIosModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label="إرشادات التثبيت على iOS"><div class="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-md border border-slate-200/80 text-center"><h3 class="text-lg font-bold text-ink-strong mb-2">تثبيت تطبيق الدولار العراقي</h3><p class="text-sm text-muted mb-4 leading-relaxed"> لتثبيت التطبيق على جهاز الآيفون الخاص بك، اتبع الخطوات البسيطة التالية: </p><div class="space-y-3 text-right bg-page p-4 rounded-xl text-xs md:text-sm text-muted"><div class="flex items-center gap-3"><span class="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">1</span><span>اضغط على زر المشاركة <strong class="text-brand-600">Share</strong> في متصفح Safari.</span></div><div class="flex items-center gap-3"><span class="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">2</span><span>انقر لأسفل واختر <strong class="text-brand-600">&quot;إضافة إلى الشاشة الرئيسية&quot;</strong>.</span></div><div class="flex items-center gap-3"><span class="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">3</span><span>اضغط على <strong class="text-brand-600">إضافة (Add)</strong> في الأعلى لتثبيت التطبيق.</span></div></div><button class="btn btn-primary w-full mt-5 text-sm"> فهمت ذلك </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PwaCtaCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { loading, connected, agoText } = useRates();
    useHead({ title: "الدولار العراقي — سعر الدولار اليوم في بغداد وأربيل والبصرة" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RateCard = _sfc_main$3;
      const _component_RateCalculator = _sfc_main$2;
      const _component_PwaCtaCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10" }, _attrs))}><section class="grid grid-cols-1 gap-3 mb-4 sm:mb-6" aria-label="حالة التحديث"><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div class="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-surface px-4 py-3 shadow-sm">`);
      if (unref(connected)) {
        _push(`<span class="live-pulse"><span></span><span></span></span>`);
      } else {
        _push(`<span class="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" aria-hidden="true"></span>`);
      }
      _push(`<div class="min-w-0"><p class="text-sm font-bold text-ink-strong leading-tight">${ssrInterpolate(unref(connected) ? "البث المباشر يعمل الآن" : "جارٍ الاتصال...")}</p><p class="text-[11px] text-muted leading-tight"> أسعار صرف الدولار مقابل الدينار العراقي — تحديث لحظي </p></div><span class="${ssrRenderClass([unref(connected) ? "bg-emerald-50 text-gain" : "bg-slate-100 text-muted", "ml-auto text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0"])}">${ssrInterpolate(unref(connected) ? "LIVE" : "...")}</span></div><div class="flex items-center justify-center md:justify-end gap-2 rounded-2xl border border-slate-200/80 bg-surface px-4 py-3 shadow-sm" aria-live="polite"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-sm text-ink"> آخر تحديث: <span class="font-extrabold text-ink-strong price-tabular">${ssrInterpolate(unref(agoText)())}</span></p></div></div></section><section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">`);
      if (unref(loading)) {
        _push(`<!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="card p-5 animate-pulse" aria-busy="true"><div class="h-5 w-28 bg-slate-200 rounded mb-4"></div><div class="grid grid-cols-2 gap-3"><div class="h-20 rounded-xl bg-slate-200"></div><div class="h-20 rounded-xl bg-slate-200"></div></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_RateCard, { region: "baghdad" }, null, _parent));
        _push(ssrRenderComponent(_component_RateCard, { region: "north" }, null, _parent));
        _push(ssrRenderComponent(_component_RateCard, { region: "south" }, null, _parent));
        _push(`<!--]-->`);
      }
      _push(`<div class="md:col-span-2 lg:col-span-2">`);
      _push(ssrRenderComponent(_component_RateCalculator, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_PwaCtaCard, null, null, _parent));
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-l8Qf6pi3.js.map
