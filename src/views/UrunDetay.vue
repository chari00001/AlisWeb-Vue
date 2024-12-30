<template>
  <div class="urun-detay" v-if="urun">
    <div class="urun-image">
      <img :src="urun.urunResmi ? urun.urunResmi : `https://picsum.photos/1000/1000?random=${Math.floor(Math.random() * 40) + 1}`" :alt="urun.urunAdi"> 
    </div>
    
    <div class="urun-info">
      <h1>{{ urun.urunAdi }}</h1>
      <p class="aciklama">{{ urun.urunAciklama }}</p>
      
      <div class="meta-bilgiler">
        <p class="marka">Marka: {{ markaAdi }}</p>
        <p class="kategori">Kategori: {{ kategoriAdi }}</p>
        <p class="stok">Stok Durumu: 100 adet</p>
        <p class="durum" :class="urun.durum === '1' ? 'aktif' : 'pasif'">
          Durum: {{ urun.durum === '1' ? 'Satışta' : 'Satışta Değil' }}
        </p>
      </div>
      
      <div class="fiyat-bilgisi">
        <h2 class="fiyat">{{ formatPrice(urun.urunFiyat) }} TL</h2>
        
        <div class="satin-alma" v-if="urun.durum === '1'">
          <div class="adet-secimi">
            <button @click="azaltAdet" :disabled="adet <= 1">-</button>
            <span>{{ adet }}</span>
            <button @click="arttirAdet" :disabled="adet >= urun.stokMiktari">+</button>
          </div>
          
          <button class="sepete-ekle" @click="sepeteEkle" >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading">
    Yükleniyor...
  </div>
  <div v-else class="error">
    Ürün bulunamadı
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const store = useStore()
const route = useRoute()
const toast = useToast()
const adet = ref(1)

const urun = computed(() => store.getters['urun/getUrunById'](route.params.id))

console.log(urun.value);


const loading = computed(() => store.state.urun.loading)
const markaAdi = computed(() => {
  const marka = store.state.marka.markalar.find(m => m.id === urun.value?.markaId)
  return marka ? marka.markaAciklama : 'Bilinmiyor'
})
const kategoriAdi = computed(() => {
  const kategori = store.state.kategori.kategoriler.find(k => k.id === urun.value?.kategoriId)
  return kategori ? kategori.kategoriAciklama : 'Bilinmiyor'
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}

const azaltAdet = () => {
  if (adet.value > 1) {
    adet.value--
  }
}

const arttirAdet = () => {
  if (adet.value < urun.value.stokMiktari) {
    adet.value++
  }
}

const sepeteEkle = () => {
  if (urun.value.durum === '1') {
    store.dispatch('sepet/addItemToCart', {
      urun: {
        id: urun.value.id,
        urunAdi: urun.value.urunAdi,
        urunFiyat: urun.value.urunFiyat,
        urunResmi: urun.value.urunResmi || `https://picsum.photos/1000/1000?random=${Math.floor(Math.random() * 40) + 1}`
      },
      miktar: adet.value
    })
    toast.success('Ürün sepete eklendi')
  } else if (adet.value > urun.value.stokMiktari) {
    toast.error('Stok miktarından fazla ürün ekleyemezsiniz')
  } else {
    toast.error('Bu ürün satışta değil')
  }
}

onMounted(async () => {
  if (!store.state.urun.urunler.length) {
    await store.dispatch('urun/fetchUrunler')
  }
  if (!store.state.marka.markalar.length) {
    await store.dispatch('marka/fetchMarkalar')
  }
  if (!store.state.kategori.kategoriler.length) {
    await store.dispatch('kategori/fetchKategoriler')
  }
})
</script>

<style scoped>
.urun-detay {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.urun-image img {
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.urun-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.urun-info h1 {
  font-size: 2rem;
  color: #2d3748;
  margin: 0;
}

.aciklama {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
}

.meta-bilgiler {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.meta-bilgiler p {
  margin: 0;
  color: #4a5568;
}

.durum {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 500;
}

.durum.aktif {
  background: #c6f6d5;
  color: #2f855a;
}

.durum.pasif {
  background: #fed7d7;
  color: #c53030;
}

.fiyat-bilgisi {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fiyat {
  font-size: 2rem;
  color: #2b6cb0;
  margin: 0;
}

.satin-alma {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.adet-secimi {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #edf2f7;
  padding: 0.5rem;
  border-radius: 8px;
}

.adet-secimi button {
  background: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: #2b6cb0;
}

.adet-secimi button:disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

.adet-secimi span {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.sepete-ekle {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sepete-ekle:hover:not(:disabled) {
  background: #3182ce;
}

.sepete-ekle:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.stok-yok {
  color: #c53030;
  font-weight: 500;
  text-align: center;
  padding: 1rem;
  background: #fed7d7;
  border-radius: 8px;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #4a5568;
}

.error {
  color: #c53030;
}

@media (max-width: 768px) {
  .urun-detay {
    grid-template-columns: 1fr;
  }
}
</style>
