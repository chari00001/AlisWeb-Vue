<template>
  <div class="urunler-container">
    <h1>Ürünlerimiz</h1>
    <UrunListesi />
  </div>
</template>

<script>
import UrunListesi from '@/components/UrunListesi.vue'

export default {
  name: 'UrunListesiView',
  components: {
    UrunListesi
  }
}
</script>

<style scoped>
.urunler-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}
</style> 