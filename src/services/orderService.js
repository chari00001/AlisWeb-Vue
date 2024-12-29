import api from "./api";

export const orderService = {
  // Sipariş İşlemleri
  async createOrder(orderData) {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  async getUserOrders() {
    const response = await api.get("/orders");
    return response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async cancelOrder(orderId) {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Ödeme İşlemleri
  async initiatePayment(orderId, paymentData) {
    const response = await api.post(`/orders/${orderId}/payment`, paymentData);
    return response.data;
  },

  async verifyPayment(orderId, paymentId) {
    const response = await api.post(`/orders/${orderId}/payment/verify`, {
      paymentId,
    });
    return response.data;
  },

  // Kargo Takip
  async getOrderTracking(orderId) {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  },
};

export default orderService;
