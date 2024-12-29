<template>
  <div class="kategori-listesi">
    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="kategoriler-container">
      <div v-if="!kategoriler.length" class="no-data">
        Henüz kategori bulunmamaktadır.
      </div>
      <div v-else class="kategoriler-grid">
        <div v-for="kategori in kategoriler" :key="kategori.id" class="kategori-card">
          <h3>{{ kategori.kategoriAdi }}</h3>
          <p class="aciklama">{{ kategori.kategoriAciklama }}</p>
          <p class="tarih">Oluşturma: {{ formatTarih(kategori.olusturmaZamani) }}</p>
          <p class="tarih">Güncelleme: {{ formatTarih(kategori.guncellemeZamani) }}</p>
          <div class="actions">
            <button @click="kategoriDuzenle(kategori)">Düzenle</button>
            <button @click="kategoriSil(kategori.id)" class="delete">Sil</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Kategori Ekleme/Düzenleme Formu -->
    <div class="kategori-form" v-if="showForm">
      <h3>{{ editMode ? 'Kategori Düzenle' : 'Yeni Kategori Ekle' }}</h3>
      <form @submit.prevent="kategoriKaydet">
        <div class="form-group">
          <label>Kategori Adı: <span class="required">*</span></label>
          <input 
            v-model="formData.kategoriAdi" 
            required
            placeholder="Kategori adını giriniz"
          >
        </div>

        <div class="form-group">
          <label>Kategori Açıklaması: <span class="required">*</span></label>
          <textarea 
            v-model="formData.kategoriAciklama" 
            required
            placeholder="Kategori açıklamasını giriniz"
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit">{{ editMode ? 'Güncelle' : 'Ekle' }}</button>
          <button type="button" @click="formIptal">İptal</button>
        </div>
      </form>
    </div>

    <button @click="yeniKategoriEkle" class="add-button" v-if="!showForm">
      Yeni Kategori Ekle
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'KategoriListesi',
  setup() {
    const store = useStore()
    const showForm = ref(false)
    const editMode = ref(false)
    const formData = ref({
      id: null,
      olusturmaZamani: null,
      guncellemeZamani: null,
      kategoriAdi: '',
      kategoriAciklama: ''
    })

    // Computed Properties
    const kategoriler = computed(() => store.state.kategori.kategoriler || [])
    const loading = computed(() => store.state.kategori.loading)
    const error = computed(() => store.state.kategori.error)

    // Methods
    const formatTarih = (tarih) => {
      if (!tarih) return '-'
      return new Date(tarih).toLocaleString('tr-TR')
    }

    const yeniKategoriEkle = () => {
      editMode.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        kategoriAdi: '',
        kategoriAciklama: ''
      }
      showForm.value = true
    }

    const kategoriDuzenle = (kategori) => {
      editMode.value = true
      formData.value = { ...kategori }
      showForm.value = true
    }

    const formIptal = () => {
      showForm.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        kategoriAdi: '',
        kategoriAciklama: ''
      }
    }

    const kategoriKaydet = async () => {
      try {
        const now = new Date().toISOString()
        if (editMode.value) {
          const kategoriData = {
            ...formData.value,
            guncellemeZamani: now
          }
          await store.dispatch('kategori/updateKategori', {
            id: formData.value.id,
            kategoriData
          })
        } else {
          const kategoriData = {
            ...formData.value,
            olusturmaZamani: now,
            guncellemeZamani: now
          }
          await store.dispatch('kategori/createKategori', kategoriData)
        }
        showForm.value = false
      } catch (error) {
        console.error('Kategori kaydedilirken hata:', error)
      }
    }

    const kategoriSil = async (id) => {
      if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
        try {
          await store.dispatch('kategori/deleteKategori', id)
        } catch (error) {
          console.error('Kategori silinirken hata:', error)
        }
      }
    }

    // Lifecycle Hooks
    onMounted(async () => {
      await store.dispatch('kategori/fetchKategoriler')
    })

    return {
      kategoriler,
      loading,
      error,
      showForm,
      editMode,
      formData,
      formatTarih,
      yeniKategoriEkle,
      kategoriDuzenle,
      kategoriSil,
      kategoriKaydet,
      formIptal
    }
  }
}
</script>

<style scoped>
.kategori-listesi {
  padding: 20px;
}

.loading, .error, .no-data {
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

.kategoriler-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.kategori-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: white;
}

.kategori-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.aciklama {
  color: #666;
  margin: 10px 0;
  line-height: 1.4;
}

.tarih {
  color: #666;
  font-size: 0.9em;
  margin: 5px 0;
}

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

.kategori-form {
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
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
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