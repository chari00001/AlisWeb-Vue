<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="brand">
        <i class="fas fa-shopping-bag"></i>
        AliSWeb
      </router-link>

      <div class="search-container">
        <div class="search-box" :class="{ 'active': searchQuery }">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="Ürün ara..."
            v-model="searchQuery"
            @input="handleSearch"
            @focus="showResults = true"
          >
        </div>

        <!-- Arama Sonuçları -->
        <transition name="fade">
          <div v-if="showResults && searchResults.length > 0 && searchQuery" class="search-results">
            <div 
              v-for="urun in searchResults" 
              :key="urun.id" 
              class="search-result-item"
              @click="goToProduct(urun.id)"
            >
              <div class="result-image">
                <img :src="urun.urunGorseli || `https://picsum.photos/seed/${urun.id}/300/300`" :alt="urun.urunAdi">
              </div>
              <div class="result-info">
                <h4>{{ urun.urunAdi }}</h4>
                <p class="result-price">{{ formatPrice(urun.urunFiyat) }} TL</p>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="nav-links">
        <router-link to="/" class="nav-link">
          <i class="fas fa-home"></i>
          Anasayfa
        </router-link>
        
        <router-link to="/sepet" class="nav-link cart-link">
          <i class="fas fa-shopping-cart"></i>
          Sepet
          <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </router-link>

        <template v-if="!isAuthenticated">
          <router-link to="/login" class="nav-link">
            <i class="fas fa-sign-in-alt"></i>
            Giriş Yap
          </router-link>
          <router-link to="/register" class="nav-link">
            <i class="fas fa-user-plus"></i>
            Kaydol
          </router-link>
        </template>

        <template v-else>
          <router-link to="/profil" class="nav-link">
            <i class="fas fa-user"></i>
            Profil
          </router-link>
          <button @click="handleLogout" class="nav-link logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            Çıkış
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const searchQuery = ref('')
const showResults = ref(false)
const searchResults = ref([])

const cartItemCount = computed(() => store.getters['sepet/sepetUrunSayisi'])
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

const handleSearch = () => {
  if (searchQuery.value.length >= 2) {
    // Tüm ürünleri al
    const allProducts = store.state.urun.urunler;
    
    // Arama terimini küçük harfe çevir
    const searchTerm = searchQuery.value.toLowerCase();
    
    // Filtreleme yap
    searchResults.value = allProducts.filter(urun => 
      urun.urunAdi.toLowerCase().includes(searchTerm) ||
      urun.urunAciklama?.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // En fazla 5 sonuç göster
  } else {
    searchResults.value = [];
  }
}

const goToProduct = (urunId) => {
  router.push(`/urun/${urunId}`);
  searchQuery.value = '';
  searchResults.value = [];
  showResults.value = false;
}

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price);
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e2e8f0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.brand {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.brand i {
  color: #4299e1;
}

.search-container {
  flex: 1;
  max-width: 600px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background-color: #ffffff;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.search-icon {
  color: #a0aec0;
  margin-right: 0.5rem;
}

.search-box input {
  width: 100%;
  border: none;
  background: none;
  font-size: 0.95rem;
  color: #4a5568;
  outline: none;
}

.search-box input::placeholder {
  color: #a0aec0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: #4299e1;
  background-color: #ebf8ff;
}

.nav-link i {
  font-size: 1.1rem;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #4299e1;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  color: #4299e1;
  background-color: #ebf8ff;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem;
    gap: 1rem;
  }

  .nav-links {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .nav-link span {
    display: none;
  }

  .brand span {
    display: none;
  }

  .search-container {
    max-width: none;
  }

  .search-box {
    padding: 0.4rem 0.8rem;
  }

  .search-box input {
    font-size: 0.9rem;
  }
}

.search-box.active {
  background-color: #ffffff;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.search-results {
  position: absolute; /* Arama çubuğunun altında görünmesi için */
  top: 100%; /* Arama çubuğunun hemen altında */
  left: 20%;
  right: 0;
  background-color: white; /* Arka plan rengi */
  border: 1px solid #e2e8f0; /* Kenar rengi */
  border-radius: 8px; /* Köşe yuvarlama */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Gölge efekti */
  z-index: 1000; /* Diğer öğelerin üstünde görünmesi için */
  max-width: 600px;
  max-height: 300px; /* Maksimum yükseklik */
  overflow-y: auto; /* Taşan içerik için kaydırma çubuğu */
}

.search-result-item {
  display: flex; /* İçerik düzeni için */
  padding: 10px; /* İç boşluk */
  cursor: pointer; /* Üzerine gelindiğinde imleci değiştir */
  transition: background-color 0.3s; /* Geçiş efekti */
  gap: 1rem;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f7fafc; /* Üzerine gelindiğinde arka plan rengi */
}

.result-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-info {
  flex: 1;
}

.result-info h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.result-price {
  margin: 0;
  font-size: 0.9rem;
  color: #4299e1;
  font-weight: 500;
}

/* Animasyonlar */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .search-results {
    position: fixed;
    top: 70px;
    left: 1rem;
    right: 1rem;
    max-height: 60vh;
  }
}
</style>