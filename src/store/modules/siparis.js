import api from "@/services/api";

const state = {
  siparisler: [],
  loading: false,
  error: null,
};

const mutations = {
  SET_SIPARISLER(state, siparisler) {
    state.siparisler = siparisler;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchUserOrders({ commit }, userId) {
    try {
      commit("SET_LOADING", true);
      console.log("Siparişler getiriliyor...");

      // Siparişleri getir
      const siparisResponse = await api.get(`/auth/siparisler/${userId}`);
      let siparisler = siparisResponse.data;
      console.log("Gelen siparişler:", siparisler);

      // Her sipariş için ürün detaylarını al
      const siparislerWithDetails = await Promise.all(
        siparisler.map(async (siparis) => {
          try {
            // Eğer sipariş veya ürünler dizisi yoksa direkt siparişi döndür
            if (!siparis?.urunler?.length) {
              console.warn(
                `Sipariş için ürün bilgisi bulunamadı (ID: ${siparis?.id})`
              );
              return {
                ...siparis,
                urunler: [],
              };
            }

            // Siparişin ürünleri için detayları al
            const urunlerWithDetails = await Promise.all(
              siparis.urunler.map(async (urun) => {
                try {
                  if (!urun?.urunId) {
                    console.warn("Ürün ID'si bulunamadı:", urun);
                    return urun;
                  }

                  console.log(`Ürün detayı getiriliyor (ID: ${urun.urunId})`);
                  const urunResponse = await api.get(`/urun/${urun.urunId}`);
                  const urunDetay = urunResponse.data;
                  console.log("Gelen ürün detayı:", urunDetay);

                  return {
                    ...urun,
                    urun: {
                      id: urunDetay.id,
                      ad: urunDetay.urunAdi,
                      aciklama: urunDetay.aciklama,
                      fiyat: urunDetay.urunFiyat,
                      resimUrl: urunDetay.resimUrl,
                      kategoriId: urunDetay.kategoriId,
                      durum: urunDetay.durum,
                      olusturmaZamani: urunDetay.olusturmaZamani,
                      guncellenmeZamani: urunDetay.guncellenmeZamani,
                    },
                  };
                } catch (error) {
                  console.error(
                    `Ürün detayı alınamadı (ID: ${urun?.urunId}):`,
                    error
                  );
                  return urun;
                }
              })
            );

            return {
              ...siparis,
              urunler: urunlerWithDetails,
            };
          } catch (error) {
            console.error(
              `Sipariş işlenirken hata (ID: ${siparis?.id}):`,
              error
            );
            return {
              ...siparis,
              urunler: [],
            };
          }
        })
      );

      console.log("İşlenmiş siparişler:", siparislerWithDetails);
      commit("SET_SIPARISLER", siparislerWithDetails);
      return siparislerWithDetails;
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error);
      commit("SET_ERROR", "Siparişler yüklenemedi");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  siparisler: (state) => state.siparisler,
  loading: (state) => state.loading,
  error: (state) => state.error,
  getSiparisByDurum: (state) => (durum) => {
    return state.siparisler.filter((siparis) => siparis.durum === durum);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
