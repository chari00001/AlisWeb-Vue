import { initialUrunler } from "./initialStates";

export default {
  namespaced: true,

  state: {
    orders: [],
    loading: false,
    error: null,
  },

  mutations: {
    setOrders(state, orders) {
      state.orders = orders;
    },
    addOrder(state, order) {
      state.orders.unshift(order); // Yeni siparişi başa ekle
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
  },

  getters: {
    allOrders: (state) => state.orders || [],
    totalSpent: (state) => {
      return (state.orders || []).reduce((total, order) => {
        return total + (order.total || 0);
      }, 0);
    },
  },

  actions: {
    // Sepetten sipariş oluştur
    async createOrder({ commit, rootState }) {
      try {
        const cartItems = rootState.sepet.sepetUrunleri;
        if (!cartItems || cartItems.length === 0) {
          throw new Error("Sepetiniz boş");
        }

        // Sipariş öğelerini oluştur
        const items = cartItems.map((item) => {
          const product = initialUrunler.find((p) => p.id === item.urunId);
          return {
            id: product.id,
            quantity: item.miktar,
            urunAdi: product.urunAdi,
            urunFiyat: product.urunFiyat,
            urunGorseli: product.urunGorseli,
          };
        });

        // Toplam tutarları hesapla
        const subtotal = items.reduce(
          (total, item) => total + item.urunFiyat * item.quantity,
          0
        );
        const tax = subtotal * 0.18;
        const total = subtotal + tax;

        // Yeni sipariş oluştur
        const newOrder = {
          id: Date.now().toString(),
          date: new Date(),
          items,
          subtotal,
          tax,
          total,
          status: "Onaylandı",
        };

        // Siparişi kaydet
        commit("addOrder", newOrder);

        // Sepeti temizle
        commit("sepet/clearSepet", null, { root: true });

        return newOrder;
      } catch (error) {
        commit("setError", error.message);
        throw error;
      }
    },

    // Siparişleri yükle (şu an için boş array dönüyor çünkü initialSiparisler boş)
    async loadOrders({ commit }) {
      commit("setLoading", true);
      try {
        commit("setOrders", []);
      } catch (error) {
        commit("setError", error.message);
        console.error("Siparişler yüklenirken hata:", error);
      } finally {
        commit("setLoading", false);
      }
    },
  },
};
