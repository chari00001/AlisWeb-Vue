<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Kayıt Ol</h2>
        <p>Yeni bir hesap oluşturun</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Ad Soyad</label>
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              required
              placeholder="Adınız ve soyadınız"
            >
          </div>
        </div>

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

        <div class="form-group">
          <label for="confirmPassword">Şifre Tekrar</label>
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required
              placeholder="Şifrenizi tekrar girin"
            >
          </div>
        </div>

        <div class="form-options">
          <label class="terms">
            <input type="checkbox" v-model="acceptTerms" required>
            <span>
              <router-link to="/terms" class="terms-link">Kullanım Koşulları</router-link>'nı kabul ediyorum
            </span>
          </label>
        </div>

        <button type="submit" class="auth-button" :disabled="loading || !isFormValid">
          <span v-if="!loading">Kayıt Ol</span>
          <i v-else class="fas fa-circle-notch fa-spin"></i>
        </button>
      </form>

      <div class="auth-footer">
        <p>Zaten hesabınız var mı?</p>
        <router-link to="/login" class="login-link">
          Giriş Yapın
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const store = useStore()
const router = useRouter()
const toast = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const isFormValid = computed(() => {
  return name.value.length > 0 &&
         email.value.length > 0 &&
         password.value.length >= 6 &&
         password.value === confirmPassword.value &&
         acceptTerms.value
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    toast.error('Lütfen tüm alanları doğru şekilde doldurun')
    return
  }

  try {
    loading.value = true
    await store.dispatch('auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    toast.success('Kayıt işlemi başarılı!')
    router.push('/login')
  } catch (error) {
    toast.error(error.message || 'Kayıt olurken bir hata oluştu')
  } finally {
    loading.value = false
  }
}
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

.terms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.terms-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.login-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #3aa876;
}

/* Password strength indicator styles */
.password-strength {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.password-strength.weak { color: #dc3545; }
.password-strength.medium { color: #ffc107; }
.password-strength.strong { color: #28a745; }

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .terms {
    color: #ccc;
  }
}
</style> 