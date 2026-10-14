import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { u as useRates, R as REGION_LABELS } from "./useRates-SVAc-SFi.js";
import "C:/xampp/htdocs/dIQD/node_modules/hookable/dist/index.mjs";
import { u as useHead } from "./v3-Cqyy4I9j.js";
import "../server.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/xampp/htdocs/dIQD/node_modules/unctx/dist/index.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/xampp/htdocs/dIQD/node_modules/defu/dist/defu.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/ufo/dist/index.mjs";
import "C:/xampp/htdocs/dIQD/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
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
    useHead({ title: "لوحة التحكم — الدولار العراقي" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl px-4 py-8" }, _attrs))}>`);
      if (!unref(user) && !unref(checkingSession)) {
        _push(`<div class="card p-6 md:p-8 max-w-sm mx-auto"><h1 class="font-bold text-xl mb-1 text-ink-strong"> تسجيل دخول المشرف</h1><p class="text-xs text-slate-500 mb-5">الدخول محمي — للمشرفين فقط</p><form class="space-y-3"><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="البريد الإلكتروني" class="input" dir="ltr"><input${ssrRenderAttr("value", unref(password))} type="password" required placeholder="كلمة المرور" class="input" dir="ltr"><button type="submit" class="btn btn-primary w-full"${ssrIncludeBooleanAttr(unref(busy)) ? " disabled" : ""}>${ssrInterpolate(unref(busy) ? "جارٍ الدخول..." : "دخول")}</button>`);
        if (unref(error)) {
          _push(`<p class="text-drop text-xs text-center">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div>`);
      } else if (unref(user)) {
        _push(`<div><div class="flex items-center justify-between mb-6"><div><h1 class="font-bold text-xl text-ink-strong"> لوحة تحكم المشرف</h1><p class="text-xs text-muted">${ssrInterpolate(unref(user).email)}</p></div><button class="btn btn-ghost text-sm">خروج</button></div><div class="card p-4 mb-5"><div class="flex items-center justify-between gap-3 mb-2"><div><h2 class="font-bold text-sm sm:text-base text-ink-strong">⚡ مزامنة IQWealth الآلية</h2><p class="text-[11px] text-muted mt-0.5">${ssrInterpolate(unref(autoSync) ? "النمط الآلي: يُسحب سعر الدولار (بغداد) تلقائياً من واجهة IQWealth كل 3 دقائق" : "النمط اليدوي: لا تحديث تلقائي — التعديل من الحقول أدناه فقط")}</p></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", unref(autoSync))}${ssrIncludeBooleanAttr(unref(toggling)) ? " disabled" : ""} class="${ssrRenderClass([unref(autoSync) ? "bg-brand-600" : "bg-slate-300", "relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors items-center"])}"><span class="${ssrRenderClass([unref(autoSync) ? "translate-x-7" : "translate-x-1", "inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform"])}"></span></button></div><div class="flex items-center justify-between gap-3 flex-wrap"><p class="text-[11px] text-slate-400">`);
        if (unref(lastSyncedAt)) {
          _push(`<!--[-->آخر مزامنة API: ${ssrInterpolate(shortTime(unref(lastSyncedAt)))} — ${ssrInterpolate(unref(lastSyncSource) === "iqwealth-api" ? "IQWealth ✅" : "فشلت ⚠️")}<!--]-->`);
        } else {
          _push(`<!--[-->لم تتم أي مزامنة API بعد<!--]-->`);
        }
        _push(`</p><button class="btn btn-primary h-10 min-h-0 px-3 text-xs"${ssrIncludeBooleanAttr(unref(syncing)) ? " disabled" : ""}>${ssrInterpolate(unref(syncing) ? "جارٍ المزامنة..." : "🔄 مزامنة الآن")}</button></div>`);
        if (unref(syncMsg)) {
          _push(`<p class="${ssrRenderClass([unref(syncOk) ? "text-gain" : "text-drop", "text-xs mt-2 text-center"])}">${ssrInterpolate(unref(syncMsg))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(autoSync)) {
          _push(`<p class="text-[11px] text-amber-600 mt-2"> ⚠️ النمط اليدوي مُفعَّل: بيانات API لن تُحدَّث — يتوفر زر «مزامنة الآن» لسحب القيم يدوياً وقتما تريد. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid gap-4"><!--[-->`);
        ssrRenderList(unref(rates), (row, region) => {
          _push(`<div class="card p-4"><div class="flex items-center justify-between mb-3"><h2 class="font-bold text-ink-strong">${ssrInterpolate(unref(REGION_LABELS)[region].ar)}</h2><span class="text-[11px] text-muted price-tabular">آخر تحديث: ${ssrInterpolate(shortTime(row.updated_at))}</span></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-[11px] text-gain mb-1 font-bold"> سعر البيع للمواطن (IQD) </label><input${ssrRenderAttr("value", unref(draft)[region].sell)} type="number" min="0" step="250" class="input tabular-nums" dir="ltr"></div><div><label class="block text-[11px] text-brand-600 mb-1 font-bold"> سعر الشراء من المواطن (IQD) </label><input${ssrRenderAttr("value", unref(draft)[region].buy)} type="number" min="0" step="250" class="input tabular-nums" dir="ltr"></div></div></div>`);
        });
        _push(`<!--]--></div><div class="sticky bottom-4 mt-5"><button class="btn btn-primary w-full shadow-lg min-h-[48px]"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "جارٍ الحفظ والبث..." : " حفظ وبث التحديث")}</button>`);
        if (unref(msg)) {
          _push(`<p class="${ssrRenderClass([unref(msgOk) ? "text-gain" : "text-drop", "text-center text-sm mt-2"])}">${ssrInterpolate(unref(msg))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="py-20 text-center text-slate-400">جارٍ التحقق من الجلسة...</div>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=admin-CLvXt2m3.js.map
