export default {
  namespaced: true,

  state: {
    sepetUrunleri: [],
    loading: false,
    error: null,
  },

  mutations: {
    setSepetUrunleri(state, urunler) {
      state.sepetUrunleri = urunler;
    },
    addToSepet(state, { urun, miktar }) {
      const existingItem = state.sepetUrunleri.find(
        (item) => item.urun.id === urun.id
      );
      if (existingItem) {
        existingItem.miktar += miktar;
      } else {
        state.sepetUrunleri.push({ urun, miktar });
      }
      // Sepeti localStorage'a kaydet
      localStorage.setItem("sepet", JSON.stringify(state.sepetUrunleri));
    },
    removeFromSepet(state, urunId) {
      state.sepetUrunleri = state.sepetUrunleri.filter(
        (item) => item.urun.id !== urunId
      );
      // Sepeti localStorage'a kaydet
      localStorage.setItem("sepet", JSON.stringify(state.sepetUrunleri));
    },
    updateMiktar(state, { urunId, miktar }) {
      const item = state.sepetUrunleri.find((item) => item.urun.id === urunId);
      if (item) {
        item.miktar = miktar;
        // Sepeti localStorage'a kaydet
        localStorage.setItem("sepet", JSON.stringify(state.sepetUrunleri));
      }
    },
    clearSepet(state) {
      state.sepetUrunleri = [];
      // Sepeti localStorage'dan temizle
      localStorage.removeItem("sepet");
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
  },

  getters: {
    sepetUrunleri: (state) => state.sepetUrunleri || [],
    sepetToplamTutar: (state) => {
      return (state.sepetUrunleri || []).reduce((total, item) => {
        return total + item.urun.urunFiyat * item.miktar;
      }, 0);
    },
    sepetUrunSayisi: (state) => {
      return (state.sepetUrunleri || []).reduce(
        (total, item) => total + item.miktar,
        0
      );
    },
  },

  actions: {
    // Sepete ürün ekleme
    addItemToCart({ commit }, { urun, miktar = 1 }) {
      try {
        commit("addToSepet", { urun, miktar });
      } catch (error) {
        commit("setError", "Ürün sepete eklenirken hata oluştu");
        console.error("Sepete ekleme hatası:", error);
      }
    },

    // Sepetten ürün çıkarma
    removeItemFromCart({ commit }, urunId) {
      try {
        commit("removeFromSepet", urunId);
      } catch (error) {
        commit("setError", "Ürün sepetten çıkarılırken hata oluştu");
        console.error("Sepetten çıkarma hatası:", error);
      }
    },

    // Ürün miktarını güncelleme
    updateItemQuantity({ commit }, { urunId, miktar }) {
      try {
        commit("updateMiktar", { urunId, miktar });
      } catch (error) {
        commit("setError", "Ürün miktarı güncellenirken hata oluştu");
        console.error("Miktar güncelleme hatası:", error);
      }
    },

    // Sepeti temizleme
    clearCart({ commit }) {
      try {
        commit("clearSepet");
      } catch (error) {
        commit("setError", "Sepet temizlenirken hata oluştu");
        console.error("Sepet temizleme hatası:", error);
      }
    },

    // Sayfa yüklendiğinde localStorage'dan sepeti yükle
    loadSepet({ commit }) {
      try {
        const savedSepet = localStorage.getItem("sepet");
        if (savedSepet) {
          commit("setSepetUrunleri", JSON.parse(savedSepet));
        }
      } catch (error) {
        commit("setError", "Sepet yüklenirken hata oluştu");
        console.error("Sepet yükleme hatası:", error);
      }
    },

    // Sipariş oluşturma
    async siparisOlustur({ commit, state, rootState }) {
      try {
        const siparisData = {
          musteriId: rootState.auth.user.id,
          urunler: state.sepetUrunleri.map((item) => ({
            urunId: item.urun.id,
            urunAdet: item.miktar,
            sabitFiyat: item.urun.urunFiyat,
            toplamFiyat: item.urun.urunFiyat * item.miktar,
          })),
          toplamTutar: state.sepetUrunleri.reduce(
            (total, item) => total + item.urun.urunFiyat * item.miktar,
            0
          ),
          durum: "Onaylandı",
          olusturmaZamani: new Date().toISOString(),
          guncellemeZamani: new Date().toISOString(),
        };

        // Backend'e sipariş oluşturma isteği gönder
        try {
          const response = await fetch("http://localhost:3000/api/siparisler", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(siparisData),
          });

          if (!response.ok) {
            console.warn("Sipariş backend'e kaydedilemedi");
          }
        } catch (error) {
          console.warn("Backend bağlantı hatası:", error);
        }

        // Store'da siparişi oluştur
        await this.dispatch("siparis/createSiparis", siparisData, {
          root: true,
        });

        // Sepeti temizle
        commit("setSepetUrunleri", []);
        localStorage.removeItem("sepet");

        return siparisData;
      } catch (error) {
        throw new Error("Sipariş oluşturulurken bir hata oluştu");
      }
    },
  },
};
