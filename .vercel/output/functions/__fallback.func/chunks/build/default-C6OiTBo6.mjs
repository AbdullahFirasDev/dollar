import { _ as __nuxt_component_0 } from './nuxt-link-DdSlUE1C.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { a as useRates } from './useRates-CKVCqFx5.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

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
      _push(` ${ssrInterpolate(unref(connected) ? "\u0645\u0628\u0627\u0634\u0631" : "...")}</div>`);
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
        "aria-label": "\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A \u2014 \u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-extrabold text-lg sm:text-xl text-ink-strong truncate"${_scopeId}> \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A </span><span class="hidden md:inline text-xs font-semibold text-brand-600 bg-primary-50 rounded-full px-2.5 py-1 shrink-0"${_scopeId}> Iraq \xB7 USD/IQD </span>`);
          } else {
            return [
              createVNode("span", { class: "font-extrabold text-lg sm:text-xl text-ink-strong truncate" }, " \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A "),
              createVNode("span", { class: "hidden md:inline text-xs font-semibold text-brand-600 bg-primary-50 rounded-full px-2.5 py-1 shrink-0" }, " Iraq \xB7 USD/IQD ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex items-center gap-1.5 sm:gap-2" aria-label="\u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0631\u0626\u064A\u0633\u064A">`);
      _push(ssrRenderComponent(_component_LiveBadge, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "hidden sm:inline-flex items-center gap-1.5 h-11 px-3 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-brand-600 transition-all duration-200 ease-in-out",
        title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u2014 \u0644\u0644\u0645\u0634\u0631\u0641\u064A\u0646"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 `);
          } else {
            return [
              createTextVNode(" \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></header><main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t border-slate-200/80 bg-surface"><div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 space-y-3 text-center"><p class="text-sm font-bold text-ink"> \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629 \xA9 \u2014 \u062A\u0645 \u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0628\u0648\u0627\u0633\u0637\u0629 \u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0641\u0631\u0627\u0633 </p><p class="text-xs text-muted"> \u0623\u0633\u0639\u0627\u0631 \u0627\u0633\u062A\u0631\u0634\u0627\u062F\u064A\u0629 \u0645\u0646 \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0645\u062D\u0644\u064A \u2014 \u0642\u062F \u062A\u062E\u062A\u0644\u0641 \u0642\u0644\u064A\u0644\u0627\u064B \u0628\u064A\u0646 \u0627\u0644\u0645\u062D\u0644\u0627\u062A. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "inline-flex sm:hidden items-center justify-center gap-1.5 min-h-[48px] w-full sm:w-auto px-4 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-brand-600 transition-all duration-200 ease-in-out"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 `);
          } else {
            return [
              createTextVNode(" \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 ")
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

export { _sfc_main as default };
//# sourceMappingURL=default-C6OiTBo6.mjs.map
