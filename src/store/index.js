import { createStore } from "vuex";
import auth from "./modules/auth";
import sepet from "./modules/sepet";
import siparis from "./modules/siparis";
import urun from "./modules/urun";
import kategori from "./modules/kategori";
import marka from "./modules/marka";
import musteri from "./modules/musteri";

export default createStore({
  modules: {
    auth,
    sepet,
    siparis,
    urun,
    kategori,
    marka,
    musteri,
  },

  state: {
    loading: false,
    error: null,
  },

  mutations: {
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
  },

  actions: {
    async loadSiparisler({ commit }) {
      commit("setLoading", true);
      try {
        // Önce localStorage'dan yükle
        const savedSiparisler = localStorage.getItem("siparisler");
        if (savedSiparisler) {
          commit("siparis/setSiparisler", JSON.parse(savedSiparisler), {
            root: true,
          });
        }

        // Sonra backend'den yüklemeyi dene
        try {
          const response = await fetch("http://localhost:3000/api/siparisler");
          if (response.ok) {
            const data = await response.json();
            commit("siparis/setSiparisler", data, { root: true });
          }
        } catch (error) {
          console.warn("Backend'den siparişler yüklenemedi:", error);
        }
      } catch (error) {
        console.error("Siparişler yüklenirken hata:", error);
        commit("setError", "Siparişler yüklenemedi");
      } finally {
        commit("setLoading", false);
      }
    },
  },
});
