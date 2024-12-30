import axios from "axios";

// API temel URL'sini yapılandırma
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// İstek öncesi interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // İstek detaylarını logla
    console.log("API İsteği:", {
      url: config.url,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("İstek Hatası:", error);
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => {
    // Başarılı yanıtı logla
    console.log("API Yanıtı:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // Sunucu yanıtı ile dönen hatalar
      console.error("API Hata Yanıtı:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      switch (error.response.status) {
        case 400:
          console.error("Geçersiz İstek:", error.response.data);
          break;
        case 401:
          console.error("Yetkisiz Erişim");
          localStorage.removeItem("token");
          break;
        case 404:
          console.error("Kaynak Bulunamadı");
          break;
        case 422:
          console.error("Doğrulama Hatası:", error.response.data);
          break;
        case 500:
          console.error("Sunucu Hatası");
          break;
        default:
          console.error(
            `HTTP Hata ${error.response.status}:`,
            error.response.data
          );
      }
    } else if (error.request) {
      console.error("Sunucu Yanıt Vermedi:", error.request);
    } else {
      console.error("İstek Hatası:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
