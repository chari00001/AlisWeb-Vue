<template>
  <div class="urun-listesi">
    <!-- Filtreleme ve Sıralama Bölümü -->
    <div class="filtreler">
      <div class="filtre-grup">
        <select v-model="secilenKategori">
          <option value="">Tüm Kategoriler</option>
          <option v-for="kategori in kategoriler" :key="kategori.id" :value="kategori.id">
            {{ kategori.kategoriAciklama }}
          </option>
        </select>

        <select v-model="secilenMarka">
          <option value="">Tüm Markalar</option>
          <option v-for="marka in markalar" :key="marka.id" :value="marka.id">
            {{ marka.markaAciklama }}
          </option>
        </select>

        <select v-model="siralama">
          <option value="">Sıralama Seçiniz</option>
          <option value="isim-artan">İsim (A-Z)</option>
          <option value="isim-azalan">İsim (Z-A)</option>
          <option value="fiyat-artan">Fiyat (Düşükten Yükseğe)</option>
          <option value="fiyat-azalan">Fiyat (Yüksekten Düşüğe)</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>
    
    <div v-else class="urunler-container">
      <div v-if="!filtrelenmisUrunler.length" class="no-data">
        Ürün bulunamadı.
      </div>
      <div v-else class="urunler-grid">
        <UrunKarti
          v-for="urun in filtrelenmisUrunler"
          :key="urun.id"
          :urun="urun"
          :marka-adi="getMarkaAdi(urun.markaId)"
          :kategori-adi="getKategoriAdi(urun.kategoriId)"
          @duzenle="urunuDuzenle"
          @sil="urunuSil"
        />
      </div>
    </div>

    <!-- Ürün Ekleme/Düzenleme Formu -->
    <div class="urun-form" v-if="showForm">
      <h3>{{ editMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}</h3>
      <form @submit.prevent="urunKaydet">
        <div class="form-group">
          <label>Ürün Adı: <span class="required">*</span></label>
          <input v-model="formData.urunAdi" required>
        </div>
        
        <div class="form-group">
          <label>Fiyat: <span class="required">*</span></label>
          <input type="number" v-model.number="formData.urunFiyat" required min="0" step="0.01">
        </div>

        <div class="form-group">
          <label>Marka: <span class="required">*</span></label>
          <select v-model="formData.markaId" required>
            <option value="">Seçiniz</option>
            <option v-for="marka in markalar" :key="marka.id" :value="marka.id">
              {{ marka.markaAciklama }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Kategori: <span class="required">*</span></label>
          <select v-model="formData.kategoriId" required>
            <option value="">Seçiniz</option>
            <option v-for="kategori in kategoriler" :key="kategori.id" :value="kategori.id">
              {{ kategori.kategoriAciklama }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Durum: <span class="required">*</span></label>
          <select v-model="formData.durum" required>
            <option value="aktif">Aktif</option>
            <option value="pasif">Pasif</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit">{{ editMode ? 'Güncelle' : 'Ekle' }}</button>
          <button type="button" @click="formIptal">İptal</button>
        </div>
      </form>
    </div>

    <router-link to="/urun-ekle" class="add-button" v-if="!showForm">
      Yeni Ürün Ekle
    </router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import UrunKarti from './UrunKarti.vue'

export default {
  name: 'UrunListesi',
  components: {
    UrunKarti
  },
  setup() {
    const store = useStore()
    const showForm = ref(false)
    const editMode = ref(false)
    const secilenKategori = ref('')
    const secilenMarka = ref('')
    const siralama = ref('')
    const formData = ref({
      id: null,
      olusturmaZamani: null,
      guncellemeZamani: null,
      urunAdi: '',
      urunFiyat: 0,
      markaId: '',
      kategoriId: '',
      durum: 'aktif'
    })

    // Computed Properties
    const urunler = computed(() => store.getters['urun/getAllUrunler'])
    const markalar = computed(() => store.state.marka.markalar || [])
    const kategoriler = computed(() => store.state.kategori.kategoriler || [])
    const loading = computed(() => store.state.urun.loading)

    // Filtreleme ve Sıralama
    const filtrelenmisUrunler = computed(() => {
      let sonuc = [...urunler.value]

      // Kategori Filtresi
      if (secilenKategori.value) {
        sonuc = sonuc.filter(urun => urun.kategoriId === secilenKategori.value)
      }

      // Marka Filtresi
      if (secilenMarka.value) {
        sonuc = sonuc.filter(urun => urun.markaId === secilenMarka.value)
      }

      // Sıralama
      switch (siralama.value) {
        case 'isim-artan':
          sonuc.sort((a, b) => a.urunAdi.localeCompare(b.urunAdi))
          break
        case 'isim-azalan':
          sonuc.sort((a, b) => b.urunAdi.localeCompare(a.urunAdi))
          break
        case 'fiyat-artan':
          sonuc.sort((a, b) => a.urunFiyat - b.urunFiyat)
          break
        case 'fiyat-azalan':
          sonuc.sort((a, b) => b.urunFiyat - a.urunFiyat)
          break
      }

      return sonuc
    })

    // Methods
    const getMarkaAdi = (markaId) => {
      const marka = markalar.value.find(m => m.id === markaId)
      return marka ? marka.markaAciklama : 'Bilinmiyor'
    }

    const getKategoriAdi = (kategoriId) => {
      const kategori = kategoriler.value.find(k => k.id === kategoriId)
      return kategori ? kategori.kategoriAciklama : 'Bilinmiyor'
    }

    const yeniUrunEkle = () => {
      editMode.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        urunAdi: '',
        urunFiyat: 0,
        markaId: '',
        kategoriId: '',
        durum: 'aktif'
      }
      showForm.value = true
    }

    const urunuDuzenle = (urun) => {
      editMode.value = true
      formData.value = { ...urun }
      showForm.value = true
    }

    const formIptal = () => {
      showForm.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        urunAdi: '',
        urunFiyat: 0,
        markaId: '',
        kategoriId: '',
        durum: 'aktif'
      }
    }

    const urunKaydet = async () => {
      try {
        const now = new Date().toISOString()
        if (editMode.value) {
          const urunData = {
            ...formData.value,
            guncellemeZamani: now
          }
          await store.dispatch('urun/updateUrun', {
            id: formData.value.id,
            urunData
          })
        } else {
          const urunData = {
            ...formData.value,
            olusturmaZamani: now,
            guncellemeZamani: now
          }
          await store.dispatch('urun/createUrun', urunData)
        }
        showForm.value = false
      } catch (error) {
        console.error('Ürün kaydedilirken hata:', error)
      }
    }

    const urunuSil = async (id) => {
      if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        try {
          await store.dispatch('urun/deleteUrun', id)
        } catch (error) {
          console.error('Ürün silinirken hata:', error)
        }
      }
    }

    // Lifecycle Hooks
    onMounted(async () => {
      await Promise.all([
        store.dispatch('urun/fetchUrunler'),
        store.dispatch('marka/fetchMarkalar'),
        store.dispatch('kategori/fetchKategoriler')
      ])
    })

    return {
      urunler,
      markalar,
      kategoriler,
      loading,
      showForm,
      editMode,
      formData,
      secilenKategori,
      secilenMarka,
      siralama,
      filtrelenmisUrunler,
      getMarkaAdi,
      getKategoriAdi,
      yeniUrunEkle,
      urunuDuzenle,
      urunuSil,
      urunKaydet,
      formIptal
    }
  }
}
</script>

<style scoped>
.urun-listesi {
  padding: 20px;
}

.loading, .no-data {
  text-align: center;
  padding: 20px;
}

.required {
  color: red;
  margin-left: 2px;
}

.urunler-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.urun-form {
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

.filtreler {
  margin-bottom: 20px;
}

.filtre-grup {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.filtre-grup select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
  background-color: white;
}
</style>
