import api from "./api";

export const cartService = {
  // Sepet İşlemleri
  async getCart() {
    const response = await api.get("/cart");
    return response.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post("/cart/items", { productId, quantity });
    return response.data;
  },

  async updateCartItem(cartItemId, quantity) {
    const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
    return response.data;
  },

  async removeFromCart(cartItemId) {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete("/cart");
    return response.data;
  },

  // Kupon İşlemleri
  async applyCoupon(couponCode) {
    const response = await api.post("/cart/apply-coupon", { couponCode });
    return response.data;
  },

  async removeCoupon() {
    const response = await api.delete("/cart/remove-coupon");
    return response.data;
  },
};

export default cartService;
