import api from "./api";

export const userService = {
  // Profil İşlemleri
  async updateProfile(userData) {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.put("/users/change-password", passwordData);
    return response.data;
  },

  // Adres İşlemleri
  async getUserAddresses() {
    const response = await api.get("/users/addresses");
    return response.data;
  },

  async addAddress(addressData) {
    const response = await api.post("/users/addresses", addressData);
    return response.data;
  },

  async updateAddress(addressId, addressData) {
    const response = await api.put(
      `/users/addresses/${addressId}`,
      addressData
    );
    return response.data;
  },

  async deleteAddress(addressId) {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response.data;
  },

  // Favori Ürünler
  async getFavorites() {
    const response = await api.get("/users/favorites");
    return response.data;
  },

  async addToFavorites(productId) {
    const response = await api.post(`/users/favorites/${productId}`);
    return response.data;
  },

  async removeFromFavorites(productId) {
    const response = await api.delete(`/users/favorites/${productId}`);
    return response.data;
  },
};

export default userService;
