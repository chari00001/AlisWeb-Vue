<template>
  <div class="siparis-listesi">
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="siparisler-container">
      <div v-if="!siparisler.length" class="no-data">
        Henüz sipariş bulunmamaktadır.
      </div>
      <div v-else class="siparisler-grid">
        <div v-for="siparis in siparisler" :key="siparis.id" class="siparis-card">
          <h3>Sipariş #{{ siparis.id }}</h3>
          <div class="siparis-detay">
            <p class="urun">Ürün: {{ getUrunAdi(siparis.urunId) }}</p>
            <p class="musteri">Müşteri: {{ getMusteriAdi(siparis.musteriId) }}</p>
            <p class="adet">Adet: {{ siparis.urunAdet }}</p>
            <p class="fiyat">Birim Fiyat: {{ siparis.sabitFiyat }} TL</p>
            <p class="toplam">Toplam: {{ siparis.toplamFiyat }} TL</p>
            <p class="tarih">Sipariş Tarihi: {{ formatTarih(siparis.siparisTarihi) }}</p>
            <p class="durum" :class="siparis.durum">Durum: {{ siparis.durum }}</p>
            <p class="tarih">Oluşturma: {{ formatTarih(siparis.olusturmaZamani) }}</p>
            <p class="tarih">Güncelleme: {{ formatTarih(siparis.guncellemeZamani) }}</p>
          </div>
          <div class="actions">
            <button @click="siparisiDuzenle(siparis)">Düzenle</button>
            <button @click="siparisiSil(siparis.id)" class="delete">İptal Et</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sipariş Ekleme/Düzenleme Formu -->
    <div class="siparis-form" v-if="showForm">
      <h3>{{ editMode ? 'Sipariş Düzenle' : 'Yeni Sipariş Oluştur' }}</h3>
      <form @submit.prevent="siparisKaydet">
        <div class="form-group">
          <label>Ürün: <span class="required">*</span></label>
          <select v-model="formData.urunId" required @change="urunSecildi">
            <option value="">Seçiniz</option>
            <option v-for="urun in urunler" :key="urun.id" :value="urun.id">
              {{ urun.urunAdi }} - {{ urun.urunFiyat }} TL
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Adet: <span class="required">*</span></label>
          <input 
            type="number" 
            v-model.number="formData.urunAdet" 
            required 
            min="1" 
            @change="hesaplaToplamFiyat"
          >
        </div>

        <div class="form-group">
          <label>Birim Fiyat: <span class="required">*</span></label>
          <input 
            type="number" 
            v-model.number="formData.sabitFiyat" 
            required 
            min="0" 
            step="0.01"
            @change="hesaplaToplamFiyat"
          >
        </div>

        <div class="form-group">
          <label>Toplam Fiyat:</label>
          <input type="number" v-model.number="formData.toplamFiyat" readonly>
        </div>

        <div class="form-group">
          <label>Sipariş Tarihi: <span class="required">*</span></label>
          <input type="datetime-local" v-model="formData.siparisTarihi" required>
        </div>

        <div class="form-group">
          <label>Durum: <span class="required">*</span></label>
          <select v-model="formData.durum" required>
            <option value="beklemede">Beklemede</option>
            <option value="onaylandi">Onaylandı</option>
            <option value="hazirlaniyor">Hazırlanıyor</option>
            <option value="kargoya_verildi">Kargoya Verildi</option>
            <option value="tamamlandi">Tamamlandı</option>
            <option value="iptal_edildi">İptal Edildi</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit">{{ editMode ? 'Güncelle' : 'Oluştur' }}</button>
          <button type="button" @click="formIptal">İptal</button>
        </div>
      </form>
    </div>

    <button @click="yeniSiparisEkle" class="add-button" v-if="!showForm">
      Yeni Sipariş Oluştur
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SiparisListesi',
  setup() {
    const store = useStore()
    const showForm = ref(false)
    const editMode = ref(false)
    const formData = ref({
      id: null,
      olusturmaZamani: null,
      guncellemeZamani: null,
      urunAdet: 1,
      sabitFiyat: 0,
      toplamFiyat: 0,
      musteriId: '', // Giriş yapmış müşterinin ID'si
      urunId: '',
      siparisTarihi: new Date().toISOString().slice(0, 16),
      durum: 'beklemede'
    })

    // Computed Properties
    const siparisler = computed(() => store.state.siparis.siparisler || [])
    const urunler = computed(() => store.state.urun.urunler || [])
    const error = computed(() => 
      store.state.siparis.error || 
      store.state.urun.error
    )

    // Methods
    const formatTarih = (tarih) => {
      if (!tarih) return '-'
      return new Date(tarih).toLocaleString('tr-TR')
    }

    const getUrunAdi = (urunId) => {
      const urun = urunler.value.find(u => u.id === urunId)
      return urun ? urun.urunAdi : 'Bilinmiyor'
    }

    const getMusteriAdi = (musteriId) => {
      // Müşteri bilgisi store'dan alınacak
      return musteriId || 'Bilinmiyor'
    }

    const urunSecildi = () => {
      const secilenUrun = urunler.value.find(u => u.id === formData.value.urunId)
      if (secilenUrun) {
        formData.value.sabitFiyat = secilenUrun.urunFiyat
        hesaplaToplamFiyat()
      }
    }

    const hesaplaToplamFiyat = () => {
      formData.value.toplamFiyat = 
        formData.value.urunAdet * formData.value.sabitFiyat
    }

    const yeniSiparisEkle = () => {
      editMode.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        urunAdet: 1,
        sabitFiyat: 0,
        toplamFiyat: 0,
        musteriId: store.state.auth.user?.id, // Giriş yapmış müşterinin ID'si
        urunId: '',
        siparisTarihi: new Date().toISOString().slice(0, 16),
        durum: 'beklemede'
      }
      showForm.value = true
    }

    const siparisiDuzenle = (siparis) => {
      editMode.value = true
      formData.value = { 
        ...siparis,
        siparisTarihi: new Date(siparis.siparisTarihi)
          .toISOString()
          .slice(0, 16)
      }
      showForm.value = true
    }

    const formIptal = () => {
      showForm.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        urunAdet: 1,
        sabitFiyat: 0,
        toplamFiyat: 0,
        musteriId: store.state.auth.user?.id,
        urunId: '',
        siparisTarihi: new Date().toISOString().slice(0, 16),
        durum: 'beklemede'
      }
    }

    const siparisKaydet = async () => {
      try {
        const now = new Date().toISOString()
        if (editMode.value) {
          const siparisData = {
            ...formData.value,
            guncellemeZamani: now
          }
          await store.dispatch('siparis/updateSiparis', {
            id: formData.value.id,
            siparisData
          })
        } else {
          const siparisData = {
            ...formData.value,
            olusturmaZamani: now,
            guncellemeZamani: now
          }
          await store.dispatch('siparis/createSiparis', siparisData)
        }
        showForm.value = false
      } catch (error) {
        console.error('Sipariş kaydedilirken hata:', error)
      }
    }

    const siparisiSil = async (id) => {
      if (confirm('Bu siparişi iptal etmek istediğinizden emin misiniz?')) {
        try {
          await store.dispatch('siparis/deleteSiparis', id)
        } catch (error) {
          console.error('Sipariş iptal edilirken hata:', error)
        }
      }
    }

    // Lifecycle Hooks
    onMounted(async () => {
      await Promise.all([
        store.dispatch('siparis/fetchSiparisler'),
        store.dispatch('urun/fetchUrunler')
      ])
    })

    return {
      siparisler,
      urunler,
      error,
      showForm,
      editMode,
      formData,
      formatTarih,
      getUrunAdi,
      getMusteriAdi,
      urunSecildi,
      hesaplaToplamFiyat,
      yeniSiparisEkle,
      siparisiDuzenle,
      siparisiSil,
      siparisKaydet,
      formIptal
    }
  }
}
</script>

<style scoped>
.siparis-listesi {
  padding: 20px;
}

.error, .no-data {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}

.required {
  color: red;
  margin-left: 2px;
}

.siparisler-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.siparis-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: white;
}

.siparis-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.siparis-detay p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9em;
}

.fiyat, .toplam {
  font-weight: bold;
  color: #2c3e50;
}

.durum {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.durum.beklemede { background: #fff3e0; color: #e65100; }
.durum.onaylandi { background: #e3f2fd; color: #1565c0; }
.durum.hazirlaniyor { background: #e8f5e9; color: #2e7d32; }
.durum.kargoya_verildi { background: #f3e5f5; color: #6a1b9a; }
.durum.tamamlandi { background: #e8f5e9; color: #1b5e20; }
.durum.iptal_edildi { background: #ffebee; color: #c62828; }

.actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.actions button {
  flex: 1;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:first-child {
  background: #1976d2;
  color: white;
}

.actions button.delete {
  background: #d32f2f;
  color: white;
}

.siparis-form {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input[readonly] {
  background: #f5f5f5;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background: #4caf50;
  color: white;
}

.form-actions button[type="button"] {
  background: #f44336;
  color: white;
}

.add-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background: #45a049;
}
</style> 