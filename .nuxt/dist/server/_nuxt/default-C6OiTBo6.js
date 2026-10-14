import { _ as __nuxt_component_0 } from "./nuxt-link-DdSlUE1C.js";
import { defineComponent, mergeProps, unref, useSSRContext, withCtx, createVNode, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { a as useRates } from "./useRates-CKVCqFx5.js";
import "C:/xampp/htdocs/dIQD/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/xampp/htdocs/dIQD/node_modules/hookable/dist/index.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/unctx/dist/index.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/xampp/htdocs/dIQD/node_modules/defu/dist/defu.mjs";
import "@supabase/supabase-js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LiveBadge",
  __ssrInlineRender: true,
  setup(__props) {
    const { connected } = useRates();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 border font-bold transition-all duration-200 ease-in-out", unref(connected) ? "border-emerald-200 bg-gain-soft text-gain" : "border-slate-300 text-muted"]
      }, _attrs))}>`);
      if (unref(connected)) {
        _push(`<span class="relative flex h-2.5 w-2.5 shrink-0"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gain opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-gain"></span></span>`);
      } else {
        _push(`<span class="h-2.5 w-2.5 rounded-full bg-slate-400 shrink-0"></span>`);
      }
      _push(` ${ssrInterpolate(unref(connected) ? "مباشر" : "...")}</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LiveBadge.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LiveBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-page" }, _attrs))}><header class="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-slate-200/80 shadow-sm"><div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 h-16 flex items-center justify-between gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 min-w-0",
        "aria-label": "الدولار العراقي — الصفحة الرئيسية"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-extrabold text-lg sm:text-xl text-ink-strong truncate"${_scopeId}> الدولار العراقي </span><span class="hidden md:inline text-xs font-semibold text-brand-600 bg-primary-50 rounded-full px-2.5 py-1 shrink-0"${_scopeId}> Iraq · USD/IQD </span>`);
          } else {
            return [
              createVNode("span", { class: "font-extrabold text-lg sm:text-xl text-ink-strong truncate" }, " الدولار العراقي "),
              createVNode("span", { class: "hidden md:inline text-xs font-semibold text-brand-600 bg-primary-50 rounded-full px-2.5 py-1 shrink-0" }, " Iraq · USD/IQD ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex items-center gap-1.5 sm:gap-2" aria-label="التنقل الرئيسي">`);
      _push(ssrRenderComponent(_component_LiveBadge, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "hidden sm:inline-flex items-center gap-1.5 h-11 px-3 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-brand-600 transition-all duration-200 ease-in-out",
        title: "لوحة التحكم — للمشرفين"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` لوحة التحكم `);
          } else {
            return [
              createTextVNode(" لوحة التحكم ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></header><main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t border-slate-200/80 bg-surface"><div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 space-y-3 text-center"><p class="text-sm font-bold text-ink"> جميع الحقوق محفوظة © — تم التطوير بواسطة عبدالله فراس </p><p class="text-xs text-muted"> أسعار استرشادية من السوق المحلي — قد تختلف قليلاً بين المحلات. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "inline-flex sm:hidden items-center justify-center gap-1.5 min-h-[48px] w-full sm:w-auto px-4 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-brand-600 transition-all duration-200 ease-in-out"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` لوحة التحكم `);
          } else {
            return [
              createTextVNode(" لوحة التحكم ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=default-C6OiTBo6.js.map
