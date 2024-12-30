import api from "@/services/api";

const state = {
  sepetItems: [],
  loading: false,
  error: null,
};

const getters = {
  sepetUrunleri: (state) => state.sepetItems,
  sepetUrunSayisi: (state) => state.sepetItems.length,
  sepetToplamTutar: (state) => {
    return state.sepetItems.reduce((total, item) => {
      const fiyat = item?.urun?.urunFiyat || 0;
      const miktar = item?.miktar || 0;
      return total + fiyat * miktar;
    }, 0);
  },
  loading: (state) => state.loading,
  error: (state) => state.error,
};

const mutations = {
  SET_SEPET_ITEMS(state, items) {
    state.sepetItems = items;
  },
  ADD_TO_CART(state, item) {
    const existingItem = state.sepetItems.find(
      (i) => i?.urun?.id === item?.urun?.id
    );
    if (existingItem) {
      existingItem.miktar += item.miktar;
    } else {
      state.sepetItems.push(item);
    }
    // Sepeti localStorage'a kaydet
    localStorage.setItem("sepet", JSON.stringify(state.sepetItems));
  },
  UPDATE_QUANTITY(state, { urunId, miktar }) {
    const item = state.sepetItems.find((i) => i?.urun?.id === urunId);
    if (item) {
      item.miktar = miktar;
      // Sepeti localStorage'a kaydet
      localStorage.setItem("sepet", JSON.stringify(state.sepetItems));
    }
  },
  REMOVE_FROM_CART(state, urunId) {
    state.sepetItems = state.sepetItems.filter((i) => i?.urun?.id !== urunId);
    // Sepeti localStorage'a kaydet
    localStorage.setItem("sepet", JSON.stringify(state.sepetItems));
  },
  CLEAR_CART(state) {
    state.sepetItems = [];
    // Sepeti localStorage'dan sil
    localStorage.removeItem("sepet");
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  loadSepet({ commit }) {
    try {
      const sepet = localStorage.getItem("sepet");
      if (sepet) {
        commit("SET_SEPET_ITEMS", JSON.parse(sepet));
      }
    } catch (error) {
      console.error("Sepet yüklenirken hata:", error);
      commit("SET_ERROR", "Sepet yüklenemedi");
    }
  },
  addItemToCart({ commit }, item) {
    try {
      commit("ADD_TO_CART", item);
    } catch (error) {
      console.error("Ürün sepete eklenirken hata:", error);
      commit("SET_ERROR", "Ürün sepete eklenemedi");
    }
  },
  updateItemQuantity({ commit }, { urunId, miktar }) {
    try {
      commit("UPDATE_QUANTITY", { urunId, miktar });
    } catch (error) {
      console.error("Ürün miktarı güncellenirken hata:", error);
      commit("SET_ERROR", "Ürün miktarı güncellenemedi");
    }
  },
  removeItemFromCart({ commit }, urunId) {
    try {
      commit("REMOVE_FROM_CART", urunId);
    } catch (error) {
      console.error("Ürün sepetten çıkarılırken hata:", error);
      commit("SET_ERROR", "Ürün sepetten çıkarılamadı");
    }
  },
  clearCart({ commit }) {
    try {
      commit("CLEAR_CART");
    } catch (error) {
      console.error("Sepet temizlenirken hata:", error);
      commit("SET_ERROR", "Sepet temizlenemedi");
    }
  },
  async siparisOlustur({ commit, state, rootState }) {
    try {
      if (!rootState.auth.user || !rootState.auth.user.id) {
        throw new Error("Kullanıcı bilgisi bulunamadı");
      }

      commit("SET_LOADING", true);

      // Her ürün için ayrı sipariş oluştur
      const siparisPromises = state.sepetItems.map(async (item) => {
        const siparisData = {
          urunAdet: parseInt(item.miktar),
          sabitFiyat: parseFloat(item.urun.urunFiyat),
          toplamFiyat: parseFloat(item.urun.urunFiyat * item.miktar),
          musteriId: rootState.auth.user.id,
          urunId: item.urun.id,
          durum: "1",
        };

        console.log("Gönderilen sipariş verisi:", siparisData);

        const response = await api.post("/siparis", siparisData);
        return response.data;
      });

      const yeniSiparisler = await Promise.all(siparisPromises);
      console.log("Oluşturulan siparişler:", yeniSiparisler);

      // Sepeti temizle
      commit("CLEAR_CART");

      return yeniSiparisler;
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error);
      commit(
        "SET_ERROR",
        error.response?.data?.detail || "Sipariş oluşturulurken bir hata oluştu"
      );
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
