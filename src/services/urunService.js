import api from "./api";

export const urunService = {
  // Tüm ürünleri getir
  async getAllProducts() {
    const response = await api.get("/urun");
    return response.data;
  },

  // Yeni ürün ekle
  async createProduct(productData) {
    const response = await api.post("/urun", productData);
    return response.data;
  },

  // Ürün detayını getir
  async getProductById(id) {
    const response = await api.get(`/urun/${id}`);
    return response.data;
  },

  // Ürün güncelle
  async updateProduct(id, productData) {
    const response = await api.put(`/urun/${id}`, productData);
    return response.data;
  },

  // Ürün sil
  async deleteProduct(id) {
    const response = await api.delete(`/urun/${id}`);
    return response.data;
  },
};

export default urunService;
