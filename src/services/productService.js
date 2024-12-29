import api from "./api";

export const productService = {
  // Ürün Listeleme İşlemleri
  async getAllProducts() {
    const response = await api.get("/products");
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async searchProducts(query) {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  },

  async getProductsByCategory(categoryId) {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  // Ürün Yönetimi İşlemleri (Admin)
  async createProduct(productData) {
    const response = await api.post("/products", productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Ürün Değerlendirme İşlemleri
  async addProductReview(productId, reviewData) {
    const response = await api.post(
      `/products/${productId}/reviews`,
      reviewData
    );
    return response.data;
  },

  async getProductReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },
};

export default productService;
