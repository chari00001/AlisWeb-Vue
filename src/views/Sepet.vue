<template>
  <div class="cart-container">
    <h1>Sepetim</h1>
    <div>
      <div v-if="!sepetUrunleri.length" class="empty-cart">
        <p>Sepetiniz boş</p>
        <router-link to="/urunler" class="continue-shopping">
          Alışverişe Devam Et
        </router-link>
      </div>
      
      <div v-else class="cart-items">
        <div v-for="item in sepetUrunleri" :key="item.urun.id" class="cart-item">
          <div class="item-details">
            <h3>{{ item.urun.urunAdi }}</h3>
            <p class="price">{{ formatPrice(item.urun.urunFiyat) }} TL</p>
          </div>
          
          <div class="quantity-controls">
            <button @click="updateMiktar(item.urun.id, item.miktar - 1)" :disabled="item.miktar <= 1">
              -
            </button>
            <span>{{ item.miktar }}</span>
            <button @click="updateMiktar(item.urun.id, item.miktar + 1)">
              +
            </button>
          </div>
          
          <div class="item-total">
            <p>Toplam: {{ formatPrice(item.urun.urunFiyat * item.miktar) }} TL</p>
            <button @click="removeItem(item.urun.id)" class="remove-button">
              Kaldır
            </button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-row">
            <span>Ara Toplam:</span>
            <span>{{ formatPrice(sepetToplamTutar) }} TL</span>
          </div>
          <div class="summary-row">
            <span>KDV (18%):</span>
            <span>{{ formatPrice(sepetToplamTutar * 0.18) }} TL</span>
          </div>
          <div class="summary-row total">
            <span>Genel Toplam:</span>
            <span>{{ formatPrice(sepetToplamTutar * 1.18) }} TL</span>
          </div>
          
          <div class="cart-actions">
            <button @click="clearCart" class="clear-cart">
              Sepeti Temizle
            </button>
            <button @click="siparisOlustur" class="checkout">
              Siparişi Tamamla
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const store = useStore()
const router = useRouter()
const toast = useToast()

const sepetUrunleri = computed(() => store.getters['sepet/sepetUrunleri'])
const sepetToplamTutar = computed(() => store.getters['sepet/sepetToplamTutar'])
const isAuthenticated = computed(() => store.state.auth.isAuthenticated)

const updateMiktar = async (urunId, miktar) => {
  if (miktar < 1) return;
  await store.dispatch('sepet/updateItemQuantity', { urunId, miktar });
}

const removeItem = async (urunId) => {
  await store.dispatch('sepet/removeItemFromCart', urunId);
  toast.success('Ürün sepetten çıkarıldı');
}

const siparisOlustur = async () => {
  try {
    if (!isAuthenticated.value) {
      toast.warning('Sipariş vermek için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

    if (!sepetUrunleri.value.length) {
      toast.warning('Sepetiniz boş');
      return;
    }

    // Ödeme sayfasına yönlendir
    router.push('/odeme');
  } catch (error) {
    toast.error(error.message || 'Bir hata oluştu');
  }
}

const clearCart = () => {
  if (confirm('Sepeti temizlemek istediğinize emin misiniz?')) {
    store.dispatch('sepet/clearCart');
    toast.success('Sepet temizlendi');
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price);
}

// Sayfa yüklendiğinde sepeti localStorage'dan yükle
onMounted(() => {
  store.dispatch('sepet/loadSepet');
})
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.error, .empty-cart {
  text-align: center;
  padding: 20px;
}

.error {
  color: #dc3545;
}

.empty-cart {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 40px;
}

.continue-shopping {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.cart-items {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.item-details {
  flex: 2;
}

.item-details h3 {
  margin: 0;
  color: #333;
}

.price {
  color: #666;
  margin: 5px 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 20px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-total {
  text-align: right;
  flex: 1;
}

.remove-button {
  padding: 5px 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
}

.cart-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 0 0 8px 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.total {
  font-weight: bold;
  font-size: 1.2em;
  border-top: 2px solid #ddd;
  padding-top: 10px;
  margin-top: 10px;
}

.cart-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.cart-actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.clear-cart {
  background: #dc3545;
  color: white;
}

.checkout {
  background: #28a745;
  color: white;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
  }
  
  .quantity-controls {
    margin: 15px 0;
  }
  
  .item-total {
    text-align: center;
  }
}
</style> 