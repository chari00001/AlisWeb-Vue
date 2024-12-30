<template>
  <div class="urun-ekle-form-container">
    <div class="urun-ekle-form">
      <h2>Yeni Ürün Ekle</h2>
      <form @submit.prevent="createUrun">
        <div class="form-group">
          <label>Ürün Adı:</label>
          <input type="text" v-model="urunAdi" required>
        </div>
        <div class="form-group">
          <label>Fiyat:</label>
          <input type="number" v-model.number="urunFiyat" required min="0" step="0.01">
        </div>
        <div class="form-group">
          <label>Marka:</label>
          <select v-model="markaId" required>
            <option value="">Seçiniz</option>
            <option v-for="marka in markalar" :key="marka.id" :value="marka.id">
              {{ marka.markaAciklama }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Kategori:</label>
          <select v-model="kategoriId" required>
            <option value="">Seçiniz</option>
            <option v-for="kategori in kategoriler" :key="kategori.id" :value="kategori.id">
              {{ kategori.kategoriAciklama }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Durum:</label>
          <select v-model="durum" required>
            <option value="aktif">Aktif</option>
            <option value="pasif">Pasif</option>
          </select>
        </div>
        <button type="submit">Ekle</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const urunAdi = ref('')
    const urunFiyat = ref(0)
    const markaId = ref('')
    const kategoriId = ref('')
    const durum = ref('aktif')
    const markalar = ref([])
    const kategoriler = ref([])

    const fetchMarkalar = async () => {
      await store.dispatch('marka/fetchMarkalar')
      markalar.value = store.state.marka.markalar
    }

    const fetchKategoriler = async () => {
      await store.dispatch('kategori/fetchKategoriler')
      kategoriler.value = store.state.kategori.kategoriler
    }

    onMounted(() => {
      fetchMarkalar()
      fetchKategoriler()
    })

    const createUrun = async () => {
      const urunData = {
        urunAdi: urunAdi.value,
        urunFiyat: Number(urunFiyat.value),
        markaId: markaId.value,
        kategoriId: kategoriId.value,
        durum: durum.value === 'aktif' ? "1" : "0",
      }


      console.log(urunData);
      try {
        await store.dispatch('urun/createUrun', urunData)
        
        // Form alanlarını temizle
        urunAdi.value = ''
        urunFiyat.value = 0
        markaId.value = ''
        kategoriId.value = ''
        durum.value = 'aktif'
        
      } catch (error) {
        console.error('Ürün eklenirken hata oluştu:', error)
        alert('Ürün eklenirken bir hata oluştu. Lütfen tüm alanları kontrol edip tekrar deneyiniz.')
      }
    }

    return {
      urunAdi,
      urunFiyat,
      markaId,
      kategoriId,
      durum,
      markalar,
      kategoriler,
      createUrun,
    }
  }
}
</script>

<style scoped>
.urun-ekle-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.urun-ekle-form {
  transform: translateY(0);
}

.urun-ekle-form:hover {
  transform: translateY(-10px);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  transition: border-color 0.3s ease;
}

input:focus, select:focus {
  border-color: #007bff;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
