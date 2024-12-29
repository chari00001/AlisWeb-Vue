import { initialMusteriler } from "./initialStates";

export default {
  namespaced: true,

  state: {
    musteriler: initialMusteriler,
    loading: false,
    error: null,
  },

  mutations: {
    setMusteriler(state, musteriler) {
      state.musteriler = musteriler;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    addMusteri(state, musteri) {
      state.musteriler.push(musteri);
    },
    updateMusteri(state, { id, musteri }) {
      const index = state.musteriler.findIndex((m) => m.id === id);
      if (index !== -1) {
        state.musteriler.splice(index, 1, musteri);
      }
    },
    deleteMusteri(state, id) {
      state.musteriler = state.musteriler.filter((m) => m.id !== id);
    },
  },

  actions: {
    async fetchMusteriler({ commit }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch("http://localhost:8000/musteri");
        if (!response.ok) throw new Error("Müşteriler yüklenirken hata oluştu");
        const data = await response.json();
        commit("setMusteriler", data);
      } catch (error) {
        console.error("Müşteriler yüklenirken hata:", error);
        commit("setError", error.message);
        // API hatası durumunda initial state kullanılıyor
        commit("setMusteriler", initialMusteriler);
      } finally {
        commit("setLoading", false);
      }
    },

    async createMusteri({ commit }, musteriData) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch("http://localhost:8000/musteri", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(musteriData),
        });
        if (!response.ok) throw new Error("Müşteri eklenirken hata oluştu");
        const data = await response.json();
        commit("addMusteri", data);
      } catch (error) {
        console.error("Müşteri eklenirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için geçici ID ile ekleme
        commit("addMusteri", {
          ...musteriData,
          id: Date.now().toString(),
        });
      } finally {
        commit("setLoading", false);
      }
    },

    async updateMusteri({ commit }, { id, musteriData }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/musteri/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(musteriData),
        });
        if (!response.ok) throw new Error("Müşteri güncellenirken hata oluştu");
        const data = await response.json();
        commit("updateMusteri", { id, musteri: data });
      } catch (error) {
        console.error("Müşteri güncellenirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için güncelleme
        commit("updateMusteri", { id, musteri: musteriData });
      } finally {
        commit("setLoading", false);
      }
    },

    async deleteMusteri({ commit }, id) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/musteri/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Müşteri silinirken hata oluştu");
        commit("deleteMusteri", id);
      } catch (error) {
        console.error("Müşteri silinirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için silme
        commit("deleteMusteri", id);
      } finally {
        commit("setLoading", false);
      }
    },
  },

  getters: {
    getMusteriById: (state) => (id) => {
      return state.musteriler.find((m) => m.id === id);
    },
  },
};
