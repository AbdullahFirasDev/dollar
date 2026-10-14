import { toRef, isRef, ref } from "vue";
import { a as useNuxtApp, b as useRuntimeConfig } from "../server.mjs";
import { createClient } from "@supabase/supabase-js";
import "C:/xampp/htdocs/dIQD/node_modules/hookable/dist/index.mjs";
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
let client = null;
function useSupabase() {
  if (!client) {
    const config = useRuntimeConfig();
    const url = config.public.supabaseUrl;
    const key = config.public.supabaseAnonKey;
    if (!url || !key) {
      throw new Error(
        "Missing Supabase credentials. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY in .env"
      );
    }
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 5 } }
    });
  }
  return client;
}
const REGION_LABELS = {
  baghdad: { ar: "بغداد", en: "Baghdad", icon: "" },
  north: { ar: "الشمال / أربيل", en: "North / Erbil", icon: "" },
  south: { ar: "الجنوب / البصرة", en: "South / Basra", icon: "" }
};
function useRates() {
  const rates = useState("rates", () => ({}));
  const prev = useState(
    "rates-prev",
    () => ({})
  );
  const loading = useState("rates-loading", () => true);
  const connected = useState("rates-connected", () => false);
  const lastUpdatedAt = useState("rates-last-updated", () => null);
  const now = ref(Date.now());
  async function fetchRates() {
    try {
      const supabase = useSupabase();
      const { data, error } = await supabase.from("rates").select("id, region, region_ar, buy_price, sell_price, updated_at").order("region");
      if (error) throw error;
      const map = {};
      let latest = null;
      for (const row of data) {
        map[row.region] = row;
        if (!latest || row.updated_at > latest) latest = row.updated_at;
      }
      prev.value = Object.fromEntries(
        Object.entries(rates.value).map(([k, v]) => [k, { buy: v.buy_price, sell: v.sell_price }])
      );
      rates.value = map;
      lastUpdatedAt.value = latest;
    } catch (e) {
      console.error("[rates] fetch failed", e);
    } finally {
      loading.value = false;
    }
  }
  function agoText() {
    if (!lastUpdatedAt.value) return "...";
    const diff = Math.max(0, now.value - new Date(lastUpdatedAt.value).getTime());
    const mins = Math.floor(diff / 6e4);
    if (mins < 1) return "الآن مباشرة";
    if (mins === 1) return "قبل دقيقة";
    if (mins < 60) return `قبل ${mins} دقائق`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `قبل ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `قبل ${days} يوم`;
  }
  return { rates, prev, loading, connected, lastUpdatedAt, agoText, refresh: fetchRates };
}
export {
  REGION_LABELS as R,
  useRates as a,
  useSupabase as u
};
//# sourceMappingURL=useRates-CKVCqFx5.js.map
