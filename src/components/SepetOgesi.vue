<template>
  <div class="sepet-ogesi">
    <img :src="item.image" :alt="item.name">
    <div class="item-details">
      <h3>{{ item.name }}</h3>
      <p class="price">${{ item.price }}</p>
    </div>
    <div class="quantity-controls">
      <button @click="updateQuantity(-1)">-</button>
      <span>{{ item.quantity }}</span>
      <button @click="updateQuantity(1)">+</button>
    </div>
    <div class="item-total">
      <p>${{ (item.price * item.quantity).toFixed(2) }}</p>
    </div>
    <button class="remove-btn" @click="removeItem">
      <span>&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SepetOgesi',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateQuantity(change) {
      const newQuantity = this.item.quantity + change
      if (newQuantity > 0) {
        this.$emit('update-quantity', this.item.id, newQuantity)
      }
    },
    removeItem() {
      this.$emit('remove-item', this.item.id)
    }
  }
}
</script>

<style scoped>
.sepet-ogesi {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.sepet-ogesi img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details h3 {
  margin: 0;
  font-size: 1.1rem;
}

.price {
  color: #666;
  margin: 0.5rem 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-total {
  font-weight: bold;
  color: #42b983;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.remove-btn:hover {
  background: none;
  color: #bd2130;
}
</style>
