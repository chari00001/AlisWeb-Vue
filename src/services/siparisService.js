import api from "./api";

export const siparisService = {
  // Tüm siparişleri getir
  async getAllOrders() {
    const response = await api.get("/siparis");
    return response.data;
  },

  // Yeni sipariş oluştur
  async createOrder(orderData) {
    const response = await api.post("/siparis", orderData);
    return response.data;
  },

  // Sipariş detayını getir
  async getOrderById(id) {
    const response = await api.get(`/siparis/${id}`);
    return response.data;
  },

  // Sipariş güncelle
  async updateOrder(id, orderData) {
    const response = await api.put(`/siparis/${id}`, orderData);
    return response.data;
  },

  // Sipariş sil
  async deleteOrder(id) {
    const response = await api.delete(`/siparis/${id}`);
    return response.data;
  },
};

export default siparisService;
