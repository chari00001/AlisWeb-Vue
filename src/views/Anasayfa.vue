<template>
  <div class="anasayfa">
    <header class="hero">
      <div class="hero-parallax"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Hoş Geldiniz</h1>
        <p>En yeni ürünleri keşfedin</p>
        <button class="hero-button" @click="scrollToProducts">
          Ürünleri Keşfet
          <i class="fas fa-arrow-down"></i>
        </button>
      </div>
    </header>

    <main>
      <UrunListesi />
    </main>
  </div>
</template>

<script setup>
import UrunListesi from '@/components/UrunListesi.vue'
import { onMounted, onUnmounted } from 'vue'

const handleScroll = () => {
  const scrolled = window.pageYOffset
  const parallax = document.querySelector('.hero-parallax')
  if (parallax) {
    parallax.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`
  }
}

const scrollToProducts = () => {
  const productsSection = document.querySelector('main')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.anasayfa {
  min-height: 100vh;
}

.hero {
  position: relative;
  height: 80vh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-parallax {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://picsum.photos/1920/1080?random=store');
  background-size: cover;
  background-position: center;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(66, 185, 131, 0.9) 0%,
    rgba(45, 136, 93, 0.9) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 800px;
  padding: 0 2rem;
}

.hero h1 {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeInDown 1s ease;
}

.hero p {
  font-size: 1.8rem;
  margin: 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 1s ease 0.3s both;
  margin-bottom: 2rem;
}

.hero-button {
  background: white;
  color: #42b983;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  animation: fadeInUp 1s ease 0.6s both;
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hero-button i {
  animation: bounce 2s infinite;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .hero {
    height: 70vh;
    min-height: 500px;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero p {
    font-size: 1.3rem;
  }

  .hero-button {
    padding: 0.8rem 1.6rem;
    font-size: 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .hero-button {
    background: #2c3e50;
    color: white;
  }

  .hero-button:hover {
    background: #34495e;
  }
}
</style>