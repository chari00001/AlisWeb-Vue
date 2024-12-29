<template>
  <div class="marka-listesi">
    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="markalar-container">
      <div v-if="!markalar.length" class="no-data">
        Henüz marka bulunmamaktadır.
      </div>
      <div v-else class="markalar-grid">
        <div v-for="marka in markalar" :key="marka.id" class="marka-card">
          <h3>{{ marka.markaAdi }}</h3>
          <p class="aciklama">{{ marka.markaAciklama }}</p>
          <p class="tarih">Oluşturma: {{ formatTarih(marka.olusturmaZamani) }}</p>
          <p class="tarih">Güncelleme: {{ formatTarih(marka.guncellemeZamani) }}</p>
          <div class="actions">
            <button @click="markaDuzenle(marka)">Düzenle</button>
            <button @click="markaSil(marka.id)" class="delete">Sil</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Marka Ekleme/Düzenleme Formu -->
    <div class="marka-form" v-if="showForm">
      <h3>{{ editMode ? 'Marka Düzenle' : 'Yeni Marka Ekle' }}</h3>
      <form @submit.prevent="markaKaydet">
        <div class="form-group">
          <label>Marka Adı: <span class="required">*</span></label>
          <input 
            v-model="formData.markaAdi" 
            required
            placeholder="Marka adını giriniz"
          >
        </div>

        <div class="form-group">
          <label>Marka Açıklaması: <span class="required">*</span></label>
          <textarea 
            v-model="formData.markaAciklama" 
            required
            placeholder="Marka açıklamasını giriniz"
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit">{{ editMode ? 'Güncelle' : 'Ekle' }}</button>
          <button type="button" @click="formIptal">İptal</button>
        </div>
      </form>
    </div>

    <button @click="yeniMarkaEkle" class="add-button" v-if="!showForm">
      Yeni Marka Ekle
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'MarkaListesi',
  setup() {
    const store = useStore()
    const showForm = ref(false)
    const editMode = ref(false)
    const formData = ref({
      id: null,
      olusturmaZamani: null,
      guncellemeZamani: null,
      markaAdi: '',
      markaAciklama: ''
    })

    // Computed Properties
    const markalar = computed(() => store.state.marka.markalar || [])
    const loading = computed(() => store.state.marka.loading)
    const error = computed(() => store.state.marka.error)

    // Methods
    const formatTarih = (tarih) => {
      if (!tarih) return '-'
      return new Date(tarih).toLocaleString('tr-TR')
    }

    const yeniMarkaEkle = () => {
      editMode.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        markaAdi: '',
        markaAciklama: ''
      }
      showForm.value = true
    }

    const markaDuzenle = (marka) => {
      editMode.value = true
      formData.value = { ...marka }
      showForm.value = true
    }

    const formIptal = () => {
      showForm.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        markaAdi: '',
        markaAciklama: ''
      }
    }

    const markaKaydet = async () => {
      try {
        const now = new Date().toISOString()
        if (editMode.value) {
          const markaData = {
            ...formData.value,
            guncellemeZamani: now
          }
          await store.dispatch('marka/updateMarka', {
            id: formData.value.id,
            markaData
          })
        } else {
          const markaData = {
            ...formData.value,
            olusturmaZamani: now,
            guncellemeZamani: now
          }
          await store.dispatch('marka/createMarka', markaData)
        }
        showForm.value = false
      } catch (error) {
        console.error('Marka kaydedilirken hata:', error)
      }
    }

    const markaSil = async (id) => {
      if (confirm('Bu markayı silmek istediğinizden emin misiniz?')) {
        try {
          await store.dispatch('marka/deleteMarka', id)
        } catch (error) {
          console.error('Marka silinirken hata:', error)
        }
      }
    }

    // Lifecycle Hooks
    onMounted(async () => {
      await store.dispatch('marka/fetchMarkalar')
    })

    return {
      markalar,
      loading,
      error,
      showForm,
      editMode,
      formData,
      formatTarih,
      yeniMarkaEkle,
      markaDuzenle,
      markaSil,
      markaKaydet,
      formIptal
    }
  }
}
</script>

<style scoped>
.marka-listesi {
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

.markalar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.marka-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: white;
}

.marka-card h3 {
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

.marka-form {
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