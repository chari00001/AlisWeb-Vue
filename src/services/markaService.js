import api from "./api";

export const markaService = {
  // Tüm markaları getir
  async getAllBrands() {
    const response = await api.get("/marka");
    return response.data;
  },

  // Yeni marka ekle
  async createBrand(brandData) {
    const response = await api.post("/marka", brandData);
    return response.data;
  },

  // Marka detayını getir
  async getBrandById(id) {
    const response = await api.get(`/marka/${id}`);
    return response.data;
  },

  // Marka güncelle
  async updateBrand(id, brandData) {
    const response = await api.put(`/marka/${id}`, brandData);
    return response.data;
  },

  // Marka sil
  async deleteBrand(id) {
    const response = await api.delete(`/marka/${id}`);
    return response.data;
  },
};

export default markaService;
