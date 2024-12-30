import { createRouter, createWebHistory } from "vue-router";
import Anasayfa from "../views/Anasayfa.vue";
import UrunDetay from "../views/UrunDetay.vue";
import Sepet from "../views/Sepet.vue";
import Giris from "../views/Giris.vue";
import Kaydol from "../views/Kaydol.vue";
import Odeme from "../views/Odeme.vue";
import Profil from "../views/Profil.vue";
import UrunListesi from "../views/UrunListesi.vue";
import UrunEkle from "../views/Urun-Ekle.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "Anasayfa",
    component: Anasayfa,
  },
  {
    path: "/urunler",
    name: "UrunListesi",
    component: UrunListesi,
  },
  {
    path: "/urun/:id",
    name: "UrunDetay",
    component: UrunDetay,
  },
  {
    path: "/sepet",
    name: "Sepet",
    component: Sepet,
  },
  {
    path: "/login",
    name: "Login",
    component: Giris,
  },
  {
    path: "/register",
    name: "Register",
    component: Kaydol,
  },
  {
    path: "/odeme",
    name: "Odeme",
    component: Odeme,
    meta: { requiresAuth: true },
  },
  {
    path: "/profil",
    name: "Profil",
    component: Profil,
    meta: { requiresAuth: true },
  },
  {
    path: "/urun-ekle",
    name: "UrunEkle",
    component: UrunEkle,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = store.state.auth.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next("/giris");
  } else {
    next();
  }
});

export default router;
