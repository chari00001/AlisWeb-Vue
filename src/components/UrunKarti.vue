<template>
  <div class="urun-kart" @click="navigateToDetail">
    <div class="urun-image">
      <img :src="urun.urunResmi ? urun.urunResmi : `https://picsum.photos/1000/1000?random=${Math.floor(Math.random() * 40) + 1}`" :alt="urun.urunAdi">
      <div class="urun-overlay">
        <button 
          class="add-to-cart-btn" 
          @click.stop="addToCart"
        >
          <i class="fas fa-shopping-cart"></i>
          {{ urun.durum == '1' ? 'Sepete Ekle' : 'Stokta Yok' }}
        </button>
      </div>
    </div>
    
    <div class="urun-info">
      <h3 class="urun-name">{{ urun.urunAdi }}</h3>
      <p class="urun-category">{{ kategoriAdi }}</p>
      <div class="urun-details">
        <span class="urun-price">{{ formatPrice(urun.urunFiyat) }} TL</span>
        <span class="urun-stock" :class="{ 'out-of-stock': urun.durum !== '1' }">
          {{ urun.durum === '1' ? 'Stokta var' : 'Stokta yok' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

const props = defineProps({
  urun: {
    type: Object,
    required: true
  },
  markaAdi: {
    type: String,
    default: 'Bilinmiyor'
  },
  kategoriAdi: {
    type: String,
    default: 'Bilinmiyor'
  }
})

const router = useRouter()
const store = useStore()
const toast = useToast()

const navigateToDetail = () => {
  router.push(`/urun/${props.urun.id}`)
}

const addToCart = async () => {
  try {
    await store.dispatch('sepet/addItemToCart', {
      urun: {
        id: props.urun.id,
        urunAdi: props.urun.urunAdi,
        urunFiyat: props.urun.urunFiyat,
        urunGorseli: props.urun.urunGorseli
      },
      miktar: 1
    });
    toast.success('Ürün sepete eklendi');
  } catch (error) {
    toast.error('Ürün sepete eklenirken bir hata oluştu');
    console.error('Sepete ekleme hatası:', error);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}
</script>

<style scoped>
.urun-kart {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
}

.urun-kart:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.urun-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.urun-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.urun-kart:hover .urun-image img {
  transform: scale(1.05);
}

.urun-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.urun-kart:hover .urun-overlay {
  opacity: 1;
}

.add-to-cart-btn {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #3182ce;
  transform: scale(1.05);
}

.add-to-cart-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.urun-info {
  padding: 1.2rem;
}

.urun-name {
  font-size: 1.1rem;
  color: #2d3748;
  margin: 0;
  margin-bottom: 0.3rem;
  line-height: 1.4;
}

.urun-category {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  margin-bottom: 0.8rem;
}

.urun-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.urun-price {
  font-weight: 600;
  color: #4299e1;
  font-size: 1.1rem;
}

.urun-stock {
  font-size: 0.9rem;
  color: #48bb78;
}

.urun-stock.out-of-stock {
  color: #f56565;
}

@media (max-width: 768px) {
  .urun-info {
    padding: 1rem;
  }

  .urun-name {
    font-size: 1rem;
  }

  .add-to-cart-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>