<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="cover-photo">
        <img src="https://picsum.photos/1200/300" alt="Cover">
      </div>
      
      <div class="profile-info">
        <div class="avatar">
          <img :src="`https://api.dicebear.com/6.x/initials/svg?seed=${user?.email || 'Guest'}`" :alt="user?.name">
        </div>
        
        <div class="user-details">
          <h1>{{ user?.name || 'Misafir Kullanıcı' }}</h1>
          <p class="email">{{ user?.email || 'misafir@example.com' }}</p>
        </div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-card">
        <i class="fas fa-shopping-bag"></i>
        <div class="stat-info">
          <span class="stat-value">{{ orders?.length }}</span>
          <span class="stat-label">Toplam Sipariş</span>
        </div>
      </div>
      
      <div class="stat-card">
        <i class="fas fa-money-bill-wave"></i>
        <div class="stat-info">
          <span class="stat-value">{{ calculateTotalSpent }} TL</span>
          <span class="stat-label">Toplam Harcama</span>
        </div>
      </div>
    </div>

    <div class="orders-section">
      <h2>Siparişlerim</h2>
      
      <div v-if="orders?.length > 0" class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">Sipariş #{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.olusturmaZamani) }}</span>
          </div>
          
          <div class="order-items">
            <div v-for="item in order.urunler" :key="item.urunId" class="order-item">
              <div class="item-image">
                <img :src="`https://picsum.photos/seed/${item.urunId}/1000/1000`" :alt="item.urunAdi">
              </div>
              
              <div class="item-details">
                <h3>{{ item.urunAdi || 'Ürün' }}</h3>
                <p class="item-quantity">{{ item.urunAdet }} adet</p>
                <p class="item-price">{{ formatPrice(item.sabitFiyat * item.urunAdet) }} TL</p>
              </div>
            </div>
          </div>
          
          <div class="order-summary">
            <div class="summary-item">
              <span>Ara Toplam:</span>
              <span>{{ formatPrice(calculateSubtotal(order)) }} TL</span>
            </div>
            <div class="summary-item">
              <span>KDV (18%):</span>
              <span>{{ formatPrice(calculateVat(order)) }} TL</span>
            </div>
            <div class="summary-item total">
              <span>Toplam:</span>
              <span>{{ formatPrice(calculateTotal(order)) }} TL</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-orders">
        <div class="empty-icon">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <h3>Henüz Siparişiniz Yok</h3>
        <p>Alışverişe başlayarak sipariş geçmişinizi oluşturabilirsiniz.</p>
        <router-link to="/" class="shop-now-btn">
          <i class="fas fa-shopping-cart"></i>
          Alışverişe Başla
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const store = useStore()
const router = useRouter()
const toast = useToast()

const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)
const user = computed(() => store.state.auth.user)
const orders = computed(() => store.state.siparis.siparisler || [])

const calculateSubtotal = (order) => {
  if (!order || !order.urunler) return 0
  return order.urunler.reduce((total, item) => {
    return total + (item.sabitFiyat * item.urunAdet)
  }, 0)
}

const calculateVat = (order) => {
  return calculateSubtotal(order) * 0.18
}

const calculateTotal = (order) => {
  return calculateSubtotal(order) + calculateVat(order)
}

const calculateTotalSpent = computed(() => {
  return orders.value.reduce((total, order) => {
    return total + calculateTotal(order)
  }, 0)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}

const formatDate = (date) => {
  if (!date) return 'Belirtilmemiş'
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadSiparisler = async () => {
  try {
    await store.dispatch('loadSiparisler')
  } catch (error) {
    console.error('Siparişler yüklenirken hata:', error)
    toast.error('Siparişler yüklenemedi')
  }
}

onMounted(async () => {
  if (!store.state.auth.isAuthenticated) {
    router.push('/login')
    return
  }
  await loadSiparisler()
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.cover-photo {
  height: 200px;
  overflow: hidden;
}

.cover-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  margin-top: -60px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-right: 1.5rem;
  background: white;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-details h1 {
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0;
  margin-bottom: 0.3rem;
}

.email {
  color: #718096;
  margin: 0;
  margin-bottom: 0.5rem;
}

.member-since {
  color: #a0aec0;
  font-size: 0.9rem;
  margin: 0;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.stat-card i {
  font-size: 1.8rem;
  color: #4299e1;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

.orders-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.orders-section h2 {
  color: #2d3748;
  margin: 0;
  margin-bottom: 1.5rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.order-header {
  background: #f7fafc;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.order-id {
  font-weight: 600;
  color: #2d3748;
}

.order-date {
  color: #718096;
  font-size: 0.9rem;
}

.order-items {
  padding: 1.5rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.item-quantity {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  margin-bottom: 0.3rem;
}

.item-price {
  color: #4299e1;
  font-weight: 500;
  margin: 0;
}

.order-summary {
  background: #f7fafc;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.summary-item.total {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.empty-orders {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #4299e1;
  margin-bottom: 1rem;
}

.empty-orders h3 {
  color: #2d3748;
  margin: 0;
  margin-bottom: 0.5rem;
}

.empty-orders p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.shop-now-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #4299e1;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.shop-now-btn:hover {
  background: #3182ce;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .order-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .order-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .item-image {
    width: 120px;
    height: 120px;
  }
}
</style>
