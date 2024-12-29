import api from "./api";

export const musteriService = {
  // Tüm müşterileri getir
  async getAllCustomers() {
    const response = await api.get("/musteri");
    return response.data;
  },

  // Yeni müşteri ekle
  async createCustomer(customerData) {
    const response = await api.post("/musteri", customerData);
    return response.data;
  },

  // Müşteri detayını getir
  async getCustomerById(id) {
    const response = await api.get(`/musteri/${id}`);
    return response.data;
  },

  // Müşteri güncelle
  async updateCustomer(id, customerData) {
    const response = await api.put(`/musteri/${id}`, customerData);
    return response.data;
  },

  // Müşteri sil
  async deleteCustomer(id) {
    const response = await api.delete(`/musteri/${id}`);
    return response.data;
  },
};

export default musteriService;
