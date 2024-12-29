<template>
  <div class="musteri-listesi">
    <div v-if="loading" class="loading">
      Yükleniyor...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="musteriler-container">
      <div v-if="!musteriler.length" class="no-data">
        Henüz müşteri bulunmamaktadır.
      </div>
      <div v-else class="musteriler-grid">
        <div v-for="musteri in musteriler" :key="musteri.id" class="musteri-card">
          <div class="musteri-header">
            <h3>{{ musteri.adi }} {{ musteri.soyadi }}</h3>
            <span class="cinsiyet" :class="musteri.cinsiyet">
              {{ musteri.cinsiyet === 'erkek' ? '♂' : '♀' }}
            </span>
          </div>
          <div class="musteri-detay">
            <p class="iletisim">
              <i class="fas fa-envelope"></i> {{ musteri.eposta }}
            </p>
            <p class="iletisim">
              <i class="fas fa-phone"></i> {{ musteri.telefon }}
            </p>
            <p class="adres">
              <i class="fas fa-map-marker-alt"></i> {{ musteri.adres }}
            </p>
            <p class="dogum-tarihi">
              <i class="fas fa-birthday-cake"></i> 
              {{ formatTarih(musteri.dogumTarihi, true) }}
            </p>
            <p class="tarih">Kayıt: {{ formatTarih(musteri.olusturmaZamani) }}</p>
            <p class="tarih">Son Güncelleme: {{ formatTarih(musteri.guncellemeZamani) }}</p>
          </div>
          <div class="actions">
            <button @click="musteriDuzenle(musteri)">Düzenle</button>
            <button @click="musteriSil(musteri.id)" class="delete">Sil</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Müşteri Ekleme/Düzenleme Formu -->
    <div class="musteri-form" v-if="showForm">
      <h3>{{ editMode ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle' }}</h3>
      <form @submit.prevent="musteriKaydet">
        <div class="form-row">
          <div class="form-group">
            <label>Ad: <span class="required">*</span></label>
            <input 
              v-model="formData.adi" 
              required
              placeholder="Adı giriniz"
            >
          </div>

          <div class="form-group">
            <label>Soyad: <span class="required">*</span></label>
            <input 
              v-model="formData.soyadi" 
              required
              placeholder="Soyadı giriniz"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Cinsiyet: <span class="required">*</span></label>
            <select v-model="formData.cinsiyet" required>
              <option value="">Seçiniz</option>
              <option value="erkek">Erkek</option>
              <option value="kadin">Kadın</option>
            </select>
          </div>

          <div class="form-group">
            <label>Doğum Tarihi: <span class="required">*</span></label>
            <input 
              type="date" 
              v-model="formData.dogumTarihi"
              required
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>E-posta: <span class="required">*</span></label>
            <input 
              type="email"
              v-model="formData.eposta" 
              required
              placeholder="E-posta adresini giriniz"
            >
          </div>

          <div class="form-group">
            <label>Telefon: <span class="required">*</span></label>
            <input 
              type="tel"
              v-model="formData.telefon" 
              required
              placeholder="Telefon numarasını giriniz"
            >
          </div>
        </div>

        <div class="form-group">
          <label>Adres: <span class="required">*</span></label>
          <textarea 
            v-model="formData.adres" 
            required
            placeholder="Adres bilgilerini giriniz"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row" v-if="!editMode">
          <div class="form-group">
            <label>Şifre: <span class="required">*</span></label>
            <input 
              type="password"
              v-model="formData.sifre" 
              :required="!editMode"
              placeholder="Şifre giriniz"
            >
          </div>

          <div class="form-group">
            <label>Şifre Tekrar: <span class="required">*</span></label>
            <input 
              type="password"
              v-model="sifreTekrar" 
              :required="!editMode"
              placeholder="Şifreyi tekrar giriniz"
            >
          </div>
        </div>

        <div class="form-actions">
          <button type="submit">{{ editMode ? 'Güncelle' : 'Kaydet' }}</button>
          <button type="button" @click="formIptal">İptal</button>
        </div>
      </form>
    </div>

    <button @click="yeniMusteriEkle" class="add-button" v-if="!showForm">
      Yeni Müşteri Ekle
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'MusteriListesi',
  setup() {
    const store = useStore()
    const showForm = ref(false)
    const editMode = ref(false)
    const sifreTekrar = ref('')
    const formData = ref({
      id: null,
      olusturmaZamani: null,
      guncellemeZamani: null,
      adi: '',
      soyadi: '',
      cinsiyet: '',
      telefon: '',
      adres: '',
      dogumTarihi: '',
      eposta: '',
      sifre: ''
    })

    // Computed Properties
    const musteriler = computed(() => store.state.musteri.musteriler || [])
    const loading = computed(() => store.state.musteri.loading)
    const error = computed(() => store.state.musteri.error)

    // Methods
    const formatTarih = (tarih, sadeceTarih = false) => {
      if (!tarih) return '-'
      const date = new Date(tarih)
      if (sadeceTarih) {
        return date.toLocaleDateString('tr-TR')
      }
      return date.toLocaleString('tr-TR')
    }

    const yeniMusteriEkle = () => {
      editMode.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        adi: '',
        soyadi: '',
        cinsiyet: '',
        telefon: '',
        adres: '',
        dogumTarihi: '',
        eposta: '',
        sifre: ''
      }
      sifreTekrar.value = ''
      showForm.value = true
    }

    const musteriDuzenle = (musteri) => {
      editMode.value = true
      const { sifre, ...musteriData } = musteri
      formData.value = { 
        ...musteriData,
        dogumTarihi: new Date(musteri.dogumTarihi).toISOString().split('T')[0]
      }
      showForm.value = true
    }

    const formIptal = () => {
      showForm.value = false
      formData.value = {
        id: null,
        olusturmaZamani: null,
        guncellemeZamani: null,
        adi: '',
        soyadi: '',
        cinsiyet: '',
        telefon: '',
        adres: '',
        dogumTarihi: '',
        eposta: '',
        sifre: ''
      }
      sifreTekrar.value = ''
    }

    const musteriKaydet = async () => {
      try {
        if (!editMode.value && formData.value.sifre !== sifreTekrar.value) {
          alert('Şifreler eşleşmiyor!')
          return
        }

        const now = new Date().toISOString()
        if (editMode.value) {
          const musteriData = {
            ...formData.value,
            guncellemeZamani: now
          }
          await store.dispatch('musteri/updateMusteri', {
            id: formData.value.id,
            musteriData
          })
        } else {
          const musteriData = {
            ...formData.value,
            olusturmaZamani: now,
            guncellemeZamani: now
          }
          await store.dispatch('musteri/createMusteri', musteriData)
        }
        showForm.value = false
      } catch (error) {
        console.error('Müşteri kaydedilirken hata:', error)
      }
    }

    const musteriSil = async (id) => {
      if (confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
        try {
          await store.dispatch('musteri/deleteMusteri', id)
        } catch (error) {
          console.error('Müşteri silinirken hata:', error)
        }
      }
    }

    // Lifecycle Hooks
    onMounted(async () => {
      await store.dispatch('musteri/fetchMusteriler')
    })

    return {
      musteriler,
      loading,
      error,
      showForm,
      editMode,
      formData,
      sifreTekrar,
      formatTarih,
      yeniMusteriEkle,
      musteriDuzenle,
      musteriSil,
      musteriKaydet,
      formIptal
    }
  }
}
</script>

<style scoped>
.musteri-listesi {
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

.musteriler-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.musteri-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: white;
}

.musteri-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.musteri-header h3 {
  margin: 0;
  color: #333;
}

.cinsiyet {
  font-size: 1.2em;
  padding: 2px 8px;
  border-radius: 4px;
}

.cinsiyet.erkek {
  background: #e3f2fd;
  color: #1565c0;
}

.cinsiyet.kadin {
  background: #fce4ec;
  color: #c2185b;
}

.musteri-detay p {
  margin: 8px 0;
  color: #666;
  font-size: 0.9em;
}

.musteri-detay i {
  width: 20px;
  margin-right: 8px;
  color: #1976d2;
}

.iletisim, .adres {
  display: flex;
  align-items: center;
}

.tarih {
  color: #666;
  font-size: 0.85em;
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

.musteri-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
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
.form-group select,
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