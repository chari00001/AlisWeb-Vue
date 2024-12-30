<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Giriş Yap</h2>
        <p>Hesabınıza giriş yapın</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">E-posta</label>
          <div class="input-group">
            <i class="fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              placeholder="E-posta adresiniz"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="password">Şifre</label>
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              required
              placeholder="Şifreniz"
            >
            <i 
              class="fas" 
              :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span>Beni Hatırla</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            Şifremi Unuttum
          </router-link>
        </div>

        <button type="submit" class="auth-button" :disabled="loading">
          <span v-if="!loading">Giriş Yap</span>
          <i v-else class="fas fa-circle-notch fa-spin"></i>
        </button>
      </form>

      <div class="auth-footer">
        <p>Hesabınız yok mu?</p>
        <router-link to="/register" class="register-link">
          Hemen Kaydolun
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { mapState, mapActions } from 'vuex'

const store = useStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.error('Lütfen e-posta ve şifrenizi giriniz')
    return
  }

  try {
    loading.value = true
    const credentials = {
      eposta: email.value,
      sifre: password.value
    }

    console.log('Giriş bilgileri:', credentials)
    
    const response = await store.dispatch('auth/login', credentials)
    console.log('Giriş başarılı:', response)
    
    toast.success('Başarıyla giriş yaptınız!')
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value)
    }

    // Eğer yönlendirme varsa oraya git, yoksa ana sayfaya
    const redirectPath = router.currentRoute.value.query.redirect || '/'
    router.push(redirectPath)
  } catch (error) {
    console.error('Giriş hatası:', error)
    
    if (error.response?.status === 422) {
      const details = error.response.data.detail
      if (Array.isArray(details)) {
        details.forEach(detail => {
          const field = detail.loc[1]
          const msg = detail.msg
          toast.error(`${field}: ${msg}`)
        })
      } else {
        toast.error('Form verilerinde hata var')
      }
    } else if (error.response?.status === 404) {
      toast.error('Kullanıcı bulunamadı')
    } else if (error.response?.status === 403) {
      toast.error('Hatalı şifre')
    } else {
      toast.error('Giriş yapılırken bir hata oluştu')
    }
  } finally {
    loading.value = false
  }
}

// Load remembered email if exists
onMounted(() => {
  const rememberedEmail = localStorage.getItem('rememberedEmail')
  if (rememberedEmail) {
    email.value = rememberedEmail
    rememberMe.value = true
  }
})
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.auth-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.5s ease;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #666;
  font-size: 1.1rem;
}

.auth-form {
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

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.input-group i {
  position: absolute;
  left: 1rem;
  color: #666;
}

.input-group i:last-child {
  left: auto;
  right: 1rem;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.forgot-password {
  color: #42b983;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #3aa876;
}

.auth-button {
  background: #42b983;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-button:hover:not(:disabled) {
  background: #3aa876;
  transform: translateY(-2px);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.register-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #3aa876;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .auth-container {
    background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
  }

  .auth-card {
    background: #2c3e50;
  }

  .auth-header h2 {
    color: white;
  }

  .auth-header p {
    color: #ccc;
  }

  .form-group label {
    color: #fff;
  }

  .input-group input {
    background: #34495e;
    border-color: #455d7a;
    color: white;
  }

  .input-group input::placeholder {
    color: #ccc;
  }

  .input-group i {
    color: #ccc;
  }

  .remember-me {
    color: #ccc;
  }

  .auth-footer {
    border-top-color: #455d7a;
    color: #ccc;
  }
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .auth-header h2 {
    font-size: 1.8rem;
  }
}
</style> 