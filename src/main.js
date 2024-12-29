import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Initialize the app
const app = createApp(App);

// Check authentication state
store.dispatch("auth/checkAuth");

app.use(store);
app.use(router);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true,
});

app.mount("#app");
