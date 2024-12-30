import api from "@/services/api";

const state = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    state.isAuthenticated = !!user;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },
};

const actions = {
  async register({ commit }, userData) {
    try {
      console.log("Register isteği gönderiliyor:", userData);
      const response = await api.post("/auth/register", userData);
      console.log("Register yanıtı:", response.data);
      return response.data;
    } catch (error) {
      console.error("Register hatası:", error.response?.data || error);
      throw error;
    }
  },

  async login({ commit }, credentials) {
    try {
      console.log("Login isteği gönderiliyor:", credentials);
      const response = await api.post("/auth/login", credentials);
      console.log("Login yanıtı:", response.data);

      if (response.data.user) {
        commit("SET_USER", response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error("Login hatası:", error.response?.data || error);
      throw error;
    }
  },

  logout({ commit }) {
    commit("SET_USER", null);
    localStorage.removeItem("token");
  },

  updateUserProfile({ commit }, userData) {
    commit("SET_USER", userData);
  },

  checkAuth({ commit }) {
    const user = localStorage.getItem("user");
    if (user) {
      commit("SET_USER", JSON.parse(user));
    }
  },
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  currentUser: (state) => state.user,
  id: (state) => (state.user ? state.user.id : null),
  eposta: (state) => (state.user ? state.user.eposta : ""),
  adi: (state) => (state.user ? state.user.adi : ""),
  soyadi: (state) => (state.user ? state.user.soyadi : ""),
  telefon: (state) => (state.user ? state.user.telefon : ""),
  adres: (state) => (state.user ? state.user.adres : ""),
  cinsiyet: (state) => (state.user ? state.user.cinsiyet : ""),
  dogumTarihi: (state) => (state.user ? state.user.dogumTarihi : null),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
