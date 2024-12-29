import { initialKategoriler } from "./initialStates";

export default {
  namespaced: true,

  state: {
    kategoriler: initialKategoriler,
    loading: false,
    error: null,
  },

  mutations: {
    setKategoriler(state, kategoriler) {
      state.kategoriler = kategoriler;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    addKategori(state, kategori) {
      state.kategoriler.push(kategori);
    },
    updateKategori(state, { id, kategori }) {
      const index = state.kategoriler.findIndex((k) => k.id === id);
      if (index !== -1) {
        state.kategoriler.splice(index, 1, kategori);
      }
    },
    deleteKategori(state, id) {
      state.kategoriler = state.kategoriler.filter((k) => k.id !== id);
    },
  },

  actions: {
    async fetchKategoriler({ commit }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch("http://localhost:8000/kategori");
        if (!response.ok)
          throw new Error("Kategoriler yüklenirken hata oluştu");
        const data = await response.json();
        commit("setKategoriler", data);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
        commit("setError", error.message);
        // API hatası durumunda initial state kullanılıyor
        commit("setKategoriler", initialKategoriler);
      } finally {
        commit("setLoading", false);
      }
    },

    async createKategori({ commit }, kategoriData) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch("http://localhost:8000/kategori", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(kategoriData),
        });
        if (!response.ok) throw new Error("Kategori eklenirken hata oluştu");
        const data = await response.json();
        commit("addKategori", data);
      } catch (error) {
        console.error("Kategori eklenirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için geçici ID ile ekleme
        commit("addKategori", {
          ...kategoriData,
          id: Date.now().toString(),
        });
      } finally {
        commit("setLoading", false);
      }
    },

    async updateKategori({ commit }, { id, kategoriData }) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/kategori/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(kategoriData),
        });
        if (!response.ok)
          throw new Error("Kategori güncellenirken hata oluştu");
        const data = await response.json();
        commit("updateKategori", { id, kategori: data });
      } catch (error) {
        console.error("Kategori güncellenirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için güncelleme
        commit("updateKategori", { id, kategori: kategoriData });
      } finally {
        commit("setLoading", false);
      }
    },

    async deleteKategori({ commit }, id) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const response = await fetch(`http://localhost:8000/kategori/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Kategori silinirken hata oluştu");
        commit("deleteKategori", id);
      } catch (error) {
        console.error("Kategori silinirken hata:", error);
        commit("setError", error.message);
        // Hata durumunda frontend'de gösterim için silme
        commit("deleteKategori", id);
      } finally {
        commit("setLoading", false);
      }
    },
  },

  getters: {
    getKategoriById: (state) => (id) => {
      return state.kategoriler.find((k) => k.id === id);
    },
  },
};
