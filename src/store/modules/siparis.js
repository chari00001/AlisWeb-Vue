import { initialSiparisler } from "./initialStates";

export default {
  namespaced: true,

  state: {
    siparisler:
      JSON.parse(localStorage.getItem("siparisler")) || initialSiparisler,
    loading: false,
    error: null,
  },

  mutations: {
    setSiparisler(state, siparisler) {
      state.siparisler = siparisler;
      localStorage.setItem("siparisler", JSON.stringify(siparisler));
    },
    addSiparis(state, siparis) {
      state.siparisler.unshift(siparis);
      localStorage.setItem("siparisler", JSON.stringify(state.siparisler));
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
  },

  getters: {
    allSiparisler: (state) => state.siparisler,
    getSiparisByMusteriId: (state) => (musteriId) => {
      return state.siparisler.filter(
        (siparis) => siparis.musteriId === musteriId
      );
    },
    getSiparisCount: (state) => state.siparisler.length,
  },

  actions: {
    async loadSiparisler({ commit }) {
      commit("setLoading", true);
      try {
        // Önce localStorage'dan yükle
        const savedSiparisler = localStorage.getItem("siparisler");
        if (savedSiparisler) {
          commit("setSiparisler", JSON.parse(savedSiparisler));
        }

        // Sonra backend'den yüklemeyi dene
        try {
          const response = await fetch("http://localhost:3000/api/siparisler");
          if (response.ok) {
            const data = await response.json();
            commit("setSiparisler", data);
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

    async createSiparis({ commit, state }, siparisData) {
      try {
        // Yeni sipariş oluştur
        const yeniSiparis = {
          id: Date.now().toString(),
          ...siparisData,
          urunler: siparisData.urunler.map((urun) => ({
            ...urun,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          })),
        };

        // Store'a ekle
        commit("addSiparis", yeniSiparis);
        console.log("Yeni sipariş eklendi:", yeniSiparis);

        return yeniSiparis;
      } catch (error) {
        console.error("Sipariş oluşturma hatası:", error);
        throw new Error("Sipariş oluşturulurken bir hata oluştu");
      }
    },
  },
};
