import api from "./api";

export const authService = {
  async login(credentials) {
    const response = await api.post("/login", {
      eposta: credentials.email,
      sifre: credentials.password,
    });

    if (response.data.username) {
      // Kullanıcı bilgilerini localStorage'a kaydedin
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.username,
          email: credentials.email,
        })
      );
    }
    return response.data; // Kullanıcı bilgilerini döndürün
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async getUserProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  logout() {
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
