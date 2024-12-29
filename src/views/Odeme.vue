<template>
  <div class="odeme-container">
    <div class="odeme-card">
      <h1>Ödeme Bilgileri</h1>

      <div class="siparis-ozeti">
        <h2>Sipariş Özeti</h2>
        
        <!-- Ürün Listesi -->
        <div class="urunler-listesi">
          <div v-for="item in sepetUrunleri" :key="item.urun.id" class="urun-item">
            <div class="urun-gorsel">
              <img :src="item.urun.urunGorseli || `https://picsum.photos/seed/${item.urun.id}/300/300`" :alt="item.urun.urunAdi">
            </div>
            <div class="urun-detay">
              <h3>{{ item.urun.urunAdi }}</h3>
              <p class="urun-miktar">{{ item.miktar }} adet</p>
              <p class="urun-fiyat">{{ formatPrice(item.urun.urunFiyat * item.miktar) }} TL</p>
            </div>
          </div>
        </div>

        <!-- Fiyat Özeti -->
        <div class="ozet-satir">
          <span>Sepet Tutarı:</span>
          <span>{{ formatPrice(sepetToplamTutar) }} TL</span>
        </div>
        <div class="ozet-satir">
          <span>KDV (18%):</span>
          <span>{{ formatPrice(kdv) }} TL</span>
        </div>
        <div class="ozet-satir toplam">
          <span>Toplam Tutar:</span>
          <span>{{ formatPrice(toplamTutar) }} TL</span>
        </div>
      </div>

      <form @submit.prevent="odemeyiTamamla" class="odeme-form">
        <div class="form-group">
          <label>Kart Üzerindeki İsim</label>
          <input 
            v-model="kartBilgileri.isim" 
            type="text" 
            required 
            placeholder="Kart üzerindeki isim"
          >
        </div>

        <div class="form-group">
          <label>Kart Numarası</label>
          <input 
            v-model="kartBilgileri.numara" 
            type="text" 
            required 
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            @input="formatKartNumarasi"
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Son Kullanma Tarihi</label>
            <input 
              v-model="kartBilgileri.sonKullanma" 
              type="text" 
              required 
              placeholder="AA/YY"
              maxlength="5"
              @input="formatSonKullanma"
            >
          </div>

          <div class="form-group">
            <label>CVV</label>
            <input 
              v-model="kartBilgileri.cvv" 
              type="text" 
              required 
              placeholder="123"
              maxlength="3"
            >
          </div>
        </div>

        <button type="submit" class="odeme-button" :disabled="loading">
          <span v-if="!loading">Ödemeyi Tamamla</span>
          <i v-else class="fas fa-circle-notch fa-spin"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const store = useStore()
const toast = useToast()

const loading = ref(false)

// Sepet verilerini store'dan al
const sepetUrunleri = computed(() => store.getters['sepet/sepetUrunleri'])
const sepetToplamTutar = computed(() => store.getters['sepet/sepetToplamTutar'])
const kdv = computed(() => sepetToplamTutar.value * 0.18)
const toplamTutar = computed(() => sepetToplamTutar.value * 1.18)

const kartBilgileri = ref({
  isim: '',
  numara: '',
  sonKullanma: '',
  cvv: ''
})

const formatKartNumarasi = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})/g, '$1 ').trim()
  kartBilgileri.value.numara = value
}

const formatSonKullanma = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  kartBilgileri.value.sonKullanma = value
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}

const odemeyiTamamla = async () => {
  try {
    loading.value = true;

    // Kart bilgilerini kontrol et
    if (!kartBilgileri.value.isim || !kartBilgileri.value.numara || 
        !kartBilgileri.value.sonKullanma || !kartBilgileri.value.cvv) {
      throw new Error('Lütfen tüm kart bilgilerini doldurun');
    }

    // Sepet boş kontrolü
    if (!sepetUrunleri.value.length) {
      throw new Error('Sepetiniz boş');
    }

    // Sipariş verilerini hazırla
    const siparisData = {
      musteriId: store.state.auth.user.id,
      urunler: sepetUrunleri.value.map(item => ({
        urunId: item.urun.id,
        urunAdi: item.urun.urunAdi,
        urunFiyat: item.urun.urunFiyat,
        urunGorseli: item.urun.urunGorseli || `https://picsum.photos/seed/${item.urun.id}/300/300`,
        miktar: item.miktar,
        toplamFiyat: item.urun.urunFiyat * item.miktar
      })),
      toplamTutar: toplamTutar.value,
      kdv: kdv.value,
      araToplam: sepetToplamTutar.value,
      durum: 'Onaylandı',
      olusturmaZamani: new Date().toISOString(),
      guncellemeZamani: new Date().toISOString(),
      odemeBilgileri: {
        kartIsim: kartBilgileri.value.isim,
        kartNumarasi: kartBilgileri.value.numara.replace(/\D/g, '').slice(-4)
      }
    };

    // Sipariş oluştur
    const sonuc = await store.dispatch('sepet/siparisOlustur', siparisData);
    
    if (sonuc) {
      toast.success('Siparişiniz başarıyla oluşturuldu');
      router.push('/profil');
    } else {
      throw new Error('Sipariş oluşturulamadı');
    }
  } catch (error) {
    toast.error(error.message || 'Ödeme işlemi sırasında bir hata oluştu');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.odeme-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.odeme-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.siparis-ozeti {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.siparis-ozeti h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.ozet-satir {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
}

.ozet-satir.toplam {
  border-top: 2px solid #dee2e6;
  margin-top: 1rem;
  padding-top: 1rem;
  font-weight: bold;
  color: #2c3e50;
}

.odeme-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  padding: 0.8rem;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.odeme-button {
  background: #42b983;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.odeme-button:hover:not(:disabled) {
  background: #3aa876;
  transform: translateY(-2px);
}

.odeme-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .odeme-container {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

.urunler-listesi {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 1rem;
}

.urun-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e1e1e1;
}

.urun-item:last-child {
  border-bottom: none;
}

.urun-gorsel {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.urun-gorsel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.urun-detay {
  flex: 1;
}

.urun-detay h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.3rem;
}

.urun-miktar {
  color: #666;
  margin: 0;
  margin-bottom: 0.3rem;
}

.urun-fiyat {
  color: #42b983;
  font-weight: 500;
  margin: 0;
}
</style>
