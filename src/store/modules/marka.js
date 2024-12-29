import { initialMarkalar } from "./initialStates";

export default {
  namespaced: true,

  state: {
    markalar: initialMarkalar,
    loading: false,
    error: null,
  },

  mutations: {
    setMarkalar(state, markalar) {
      state.markalar = markalar;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    addMarka(state, marka) {
      state.markalar.push(marka);
    },
    updateMarka(state, { id, marka }) {
      const index = state.markalar.findIndex((m) => m.id === id);
      if (index !== -1) {
        state.markalar.splice(index, 1, marka);
      }
    },
    deleteMarka(state, id) {
      state.markalar = state.markalar.filter((m) => m.id !== id);
    },
  },

  actions: {
    async fetchMarkalar({ commit }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch("http://localhost:8000/marka");
        if (!response.ok) throw new Error("Markalar yüklenirken hata oluştu");
        const data = await response.json();
        commit("setMarkalar", data);
      } catch (error) {
        console.error("Markalar yüklenirken hata:", error);
        commit("setError", error.message);
        // API hatası durumunda initial state kullanılıyor
        commit("setMarkalar", initialMarkalar);
      } finally {
        commit("setLoading", false);
      }
    },

    async createMarka({ commit }, markaData) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch("http://localhost:8000/marka", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(markaData),
        });
        if (!response.ok) throw new Error("Marka eklenirken hata oluştu");
        const data = await response.json();
        commit("addMarka", data);
      } catch (error) {
        console.error("Marka eklenirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için geçici ID ile ekleme
        commit("addMarka", {
          ...markaData,
          id: Date.now().toString(),
        });
      } finally {
        commit("setLoading", false);
      }
    },

    async updateMarka({ commit }, { id, markaData }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/marka/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(markaData),
        });
        if (!response.ok) throw new Error("Marka güncellenirken hata oluştu");
        const data = await response.json();
        commit("updateMarka", { id, marka: data });
      } catch (error) {
        console.error("Marka güncellenirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için güncelleme
        commit("updateMarka", { id, marka: markaData });
      } finally {
        commit("setLoading", false);
      }
    },

    async deleteMarka({ commit }, id) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/marka/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Marka silinirken hata oluştu");
        commit("deleteMarka", id);
      } catch (error) {
        console.error("Marka silinirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için silme
        commit("deleteMarka", id);
      } finally {
        commit("setLoading", false);
      }
    },
  },

  getters: {
    getMarkaById: (state) => (id) => {
      return state.markalar.find((m) => m.id === id);
    },
  },
};
