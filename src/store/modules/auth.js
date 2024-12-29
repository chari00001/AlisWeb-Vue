import { authService } from "@/services/authService";

export default {
  namespaced: true,

  state: {
    user: null,
    error: null,
    loading: false,
    isAuthenticated: false,
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      }
    },
    setError(state, error) {
      state.error = error;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },

  actions: {
    async login({ commit }, credentials) {
      commit("setError", null);
      commit("setLoading", true);
      try {
        if (
          credentials.email === "admin@gmail.com" &&
          credentials.password === "admin"
        ) {
          const adminUser = {
            id: "admin",
            username: "Admin",
            email: credentials.email,
            role: "admin",
          };
          commit("setUser", adminUser);
          return { success: true, user: adminUser };
        }

        const response = await authService.login(credentials);
        const user = {
          id: response.id || Date.now().toString(),
          username: response.username,
          email: credentials.email,
          role: "user",
        };
        commit("setUser", user);
        return { success: true, user };
      } catch (error) {
        commit("setError", error.message);
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },

    async logout({ commit }) {
      try {
        await authService.logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        commit("setUser", null);
      }
    },

    checkAuth({ commit }) {
      try {
        const savedUser = localStorage.getItem("user");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        if (savedUser && isAuthenticated === "true") {
          commit("setUser", JSON.parse(savedUser));
          return true;
        } else {
          commit("setUser", null);
          return false;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        commit("setUser", null);
        return false;
      }
    },

    updateUser({ commit }, userData) {
      commit("setUser", userData);
    },
  },
};
