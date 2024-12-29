import api from "./api";

export const kategoriService = {
  // Tüm kategorileri getir
  async getAllCategories() {
    const response = await api.get("/kategori");
    return response.data;
  },

  // Yeni kategori ekle
  async createCategory(categoryData) {
    const response = await api.post("/kategori", categoryData);
    return response.data;
  },

  // Kategori detayını getir
  async getCategoryById(id) {
    const response = await api.get(`/kategori/${id}`);
    return response.data;
  },

  // Kategori güncelle
  async updateCategory(id, categoryData) {
    const response = await api.put(`/kategori/${id}`, categoryData);
    return response.data;
  },

  // Kategori sil
  async deleteCategory(id) {
    const response = await api.delete(`/kategori/${id}`);
    return response.data;
  },
};

export default kategoriService;
