import { initialUrunler } from "./initialStates";
import axios from "axios";
export default {
  namespaced: true,

  state: () => ({
    urunler: initialUrunler,
    loading: false,
    error: null,
  }),

  mutations: {
    setUrunler(state, urunler) {
      state.urunler = urunler;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    addUrun(state, urun) {
      state.urunler.push(urun);
    },
    updateUrun(state, { id, urun }) {
      const index = state.urunler.findIndex((u) => u.id === id);
      if (index !== -1) {
        state.urunler.splice(index, 1, urun);
      }
    },
    deleteUrun(state, id) {
      state.urunler = state.urunler.filter((u) => u.id !== id);
    },
  },

  actions: {
    async fetchUrunler({ commit }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch("http://localhost:8000/urun");
        if (!response.ok) throw new Error("Ürünler yüklenirken hata oluştu");
        const data = await response.json();
        commit("setUrunler", data);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
        // API hatası durumunda initial state kullanılıyor
        commit("setUrunler", initialUrunler);
      } finally {
        commit("setLoading", false);
      }
    },

    async createUrun({ commit }, urunData) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await axios.post(
          "http://localhost:8000/urun",
          urunData
        );
        if (response.status !== 200)
          throw new Error("Ürün eklenirken hata oluştu");
        const data = response.data;
        commit("addUrun", data);
      } catch (error) {
        console.error("Ürün eklenirken hata:", error);
        // Hata durumunda frontend'de gösterim için geçici ID ile ekleme
        commit("addUrun", {
          ...urunData,
          id: Date.now().toString(),
        });
      } finally {
        commit("setLoading", false);
      }
    },

    async updateUrun({ commit }, { id, urunData }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/urun/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(urunData),
        });
        if (!response.ok) throw new Error("Ürün güncellenirken hata oluştu");
        const data = await response.json();
        commit("updateUrun", { id, urun: data });
      } catch (error) {
        console.error("Ürün güncellenirken hata:", error);
        // Hata durumunda frontend'de gösterim için güncelleme
        commit("updateUrun", { id, urun: urunData });
      } finally {
        commit("setLoading", false);
      }
    },

    async deleteUrun({ commit }, id) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/urun/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Ürün silinirken hata oluştu");
        commit("deleteUrun", id);
      } catch (error) {
        console.error("Ürün silinirken hata:", error);
        // Hata durumunda frontend'de gösterim için silme
        commit("deleteUrun", id);
      } finally {
        commit("setLoading", false);
      }
    },
  },

  getters: {
    getUrunById: (state) => (id) => {
      return state.urunler.find((u) => u.id === id);
    },
    getAllUrunler: (state) => {
      return state.urunler;
    },
  },
};
