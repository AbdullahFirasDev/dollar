import { _ as __nuxt_component_0 } from './nuxt-link-DdSlUE1C.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { b as useState, a as useRates } from './useRates-BTUaTxag.mjs';
import { s as sanitizeTag } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@supabase/supabase-js';
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
        class: ["flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 border font-bold", unref(connected) ? "border-mint/40 bg-mint/10 text-mint-dark dark:text-mint" : "border-slate-300 dark:border-slate-700 text-muted"]
      }, _attrs))}><span class="${ssrRenderClass([unref(connected) ? "bg-mint live-dot" : "bg-slate-400", "h-2 w-2 rounded-full"])}"></span> ${ssrInterpolate(unref(connected) ? "\u0645\u0628\u0627\u0634\u0631" : "...")}</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LiveBadge.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_2 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useState("dark", () => true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LiveBadge = _sfc_main$1;
      const _component_ClientOnly = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950" }, _attrs))}><header class="sticky top-0 z-40 backdrop-blur bg-surface/90 dark:bg-slate-950/80 border-b border-primary-100 dark:border-slate-800 shadow-sm"><div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 h-16 flex items-center justify-between gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 min-w-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-2xl shrink-0"${_scopeId}>\u{1F4B5}</span><span class="font-extrabold text-lg sm:text-xl text-primary-700 dark:text-white truncate"${_scopeId}> \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A </span><span class="hidden md:inline text-xs font-semibold text-muted bg-primary-50 dark:bg-slate-800 rounded-full px-2 py-0.5"${_scopeId}> Iraq \xB7 USD/IQD </span>`);
          } else {
            return [
              createVNode("span", { class: "text-2xl shrink-0" }, "\u{1F4B5}"),
              createVNode("span", { class: "font-extrabold text-lg sm:text-xl text-primary-700 dark:text-white truncate" }, " \u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A "),
              createVNode("span", { class: "hidden md:inline text-xs font-semibold text-muted bg-primary-50 dark:bg-slate-800 rounded-full px-2 py-0.5" }, " Iraq \xB7 USD/IQD ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex items-center gap-1.5 sm:gap-2" aria-label="\u0627\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0631\u0626\u064A\u0633\u064A">`);
      _push(ssrRenderComponent(_component_LiveBadge, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "hidden sm:inline-flex items-center gap-1.5 h-12 px-3 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors",
        title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u2014 \u0644\u0644\u0645\u0634\u0631\u0641\u064A\u0646"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u{1F512} \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 `);
          } else {
            return [
              createTextVNode(" \u{1F512} \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="btn btn-ghost !min-h-[48px] !min-w-[48px] !px-2.5" aria-label="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</button></nav></div></header><main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900"><div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 space-y-3 text-center"><p class="text-sm font-bold text-slate-700 dark:text-slate-200"> \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629 \xA9 \u2014 \u062A\u0645 \u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0628\u0648\u0627\u0633\u0637\u0629 \u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0641\u0631\u0627\u0633 </p><p class="text-xs text-muted"> \u0623\u0633\u0639\u0627\u0631 \u0627\u0633\u062A\u0631\u0634\u0627\u062F\u064A\u0629 \u0645\u0646 \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0645\u062D\u0644\u064A \u2014 \u0642\u062F \u062A\u062E\u062A\u0644\u0641 \u0642\u0644\u064A\u0644\u0627\u064B \u0628\u064A\u0646 \u0627\u0644\u0645\u062D\u0644\u0627\u062A. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "inline-flex sm:hidden items-center justify-center gap-1.5 min-h-[48px] w-full sm:w-auto px-4 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u{1F512} \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 `);
          } else {
            return [
              createTextVNode(" \u{1F512} \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 ")
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
//# sourceMappingURL=default-DyNXTAH9.mjs.map
