<template>
  <div class="auth-wrapper">
    <div class="auth-container" :class="{ 'right-panel-active': isRegisterMode }">
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister">
          <h1 class="register">Create Account</h1>
          <span>Use your email for registration</span>

          <InputField
            v-model="registerData.username"
            placeholder="Username"
            :error="registerErrors.username"
            @blur="validateRegisterUsername"
          />
          <InputField
            v-model="registerData.email"
            type="email"
            placeholder="Email"
            :error="registerErrors.email"
            @blur="validateRegisterEmail"
          />
          <InputField
            v-model="registerData.password"
            type="password"
            placeholder="Password"
            :error="registerErrors.password"
            @blur="validateRegisterPassword"
          />

          <BaseButton type="submit" variant="primary" :disabled="!isRegisterValid">
            Sign Up
          </BaseButton>
        </form>
      </div>

      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>Sign in</h1>
          <span>Use your account</span>

          <InputField
            v-model="loginData.email"
            type="email"
            placeholder="Email"
            :error="loginErrors.email"
            @blur="validateLoginEmail"
          />
          <InputField
            v-model="loginData.password"
            type="password"
            placeholder="Password"
            :error="loginErrors.password"
            @blur="validateLoginPassword"
          />

          <BaseButton type="submit" variant="primary" :disabled="!isLoginValid">
            Sign In
          </BaseButton>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <BaseButton variant="secondary" @click="toggleMode">Sign In</BaseButton>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Hello!</h1>
            <p>Enter your personal details and start journey with us</p>
            <BaseButton variant="secondary" @click="toggleMode">Sign Up</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '../components/common/BaseButton.vue'
import InputField from '../components/common/InputField.vue'

export default {
  name: 'AuthView',
  components: { BaseButton, InputField },
  data() {
    return {
      isRegisterMode: true,
      registerData: { username: '', email: '', password: '' },
      registerErrors: { username: '', email: '', password: '' },
      loginData: { email: '', password: '' },
      loginErrors: { email: '', password: '' },
    }
  },
  computed: {
    isRegisterValid() {
      return (
        this.registerData.username.length >= 3 &&
        this.registerData.email &&
        this.isValidEmail(this.registerData.email) &&
        this.registerData.password.length >= 6 &&
        !Object.values(this.registerErrors).some((e) => e !== '')
      )
    },
    isLoginValid() {
      return (
        this.loginData.email &&
        this.isValidEmail(this.loginData.email) &&
        this.loginData.password &&
        this.loginData.password.length >= 6 &&
        !Object.values(this.loginErrors).some((e) => e !== '')
      )
    },
  },
  methods: {
    toggleMode() {
      this.isRegisterMode = !this.isRegisterMode
      this.clearErrors()
    },
    clearErrors() {
      this.registerErrors = { username: '', email: '', password: '' }
      this.loginErrors = { email: '', password: '' }
    },
    validateRegisterUsername() {
      if (!this.registerData.username) this.registerErrors.username = 'Username is required'
      else if (this.registerData.username.length < 3)
        this.registerErrors.username = 'Minimum 3 characters'
      else this.registerErrors.username = ''
    },
    validateRegisterEmail() {
      if (!this.registerData.email) this.registerErrors.email = 'Email is required'
      else if (!this.isValidEmail(this.registerData.email))
        this.registerErrors.email = 'Invalid email format'
      else if (this.hasCyrillic(this.registerData.email))
        this.registerErrors.email = 'Email cannot contain Cyrillic characters'
      else this.registerErrors.email = ''
    },
    validateRegisterPassword() {
      if (!this.registerData.password) this.registerErrors.password = 'Password is required'
      else if (this.registerData.password.length < 6)
        this.registerErrors.password = 'Minimum 6 characters'
      else this.registerErrors.password = ''
    },
    validateLoginEmail() {
      if (!this.loginData.email) this.loginErrors.email = 'Email is required'
      else if (!this.isValidEmail(this.loginData.email))
        this.loginErrors.email = 'Invalid email format'
      else if (this.hasCyrillic(this.loginData.email))
        this.loginErrors.email = 'Email cannot contain Cyrillic characters'
      else this.loginErrors.email = ''
    },
    validateLoginPassword() {
      if (!this.loginData.password) this.loginErrors.password = 'Password is required'
      else if (this.loginData.password.length < 6)
        this.loginErrors.password = 'Minimum 6 characters'
      else this.loginErrors.password = ''
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    hasCyrillic(text) {
      return /[а-яА-ЯёЁіІїЇєЄґҐ]/.test(text)
    },
    handleRegister() {
      this.validateRegisterUsername()
      this.validateRegisterEmail()
      this.validateRegisterPassword()
      if (this.isRegisterValid) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userData', JSON.stringify(this.registerData))
        this.$router.push('/home')
      }
    },
    handleLogin() {
      this.validateLoginEmail()
      this.validateLoginPassword()
      if (this.isLoginValid) {
        localStorage.setItem('isAuthenticated', 'true')
        this.$router.push('/home')
      }
    },
  },
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1d3085;
  background: linear-gradient(90deg, rgba(29, 48, 133, 1) 0%, rgba(130, 130, 191, 1) 100%);
  padding: 20px;
}
.auth-container {
  background-color: var(--color-white);
  border-radius: 10px;
  box-shadow:
    0 14px 28px var(--shadow-dark),
    0 10px 10px var(--shadow-light);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}
.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}
.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}
.auth-container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}
.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}
.auth-container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}
@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
form {
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}
h1 {
  font-weight: bold;
  margin: 0 0 15px;
  font-size: 24px;
  /* padding-bottom: 10px; */
}
span {
  font-size: 12px;
  color: var(--color-text-light);
}
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}
.auth-container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}
.overlay {
  background: linear-gradient(90deg, rgba(13, 26, 69, 1) 0%, rgba(104, 104, 153, 1) 100%);
  color: var(--color-white);
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}
.auth-container.right-panel-active .overlay {
  transform: translateX(50%);
}
.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transition: transform 0.6s ease-in-out;
}
.overlay-left {
  transform: translateX(-20%);
}
.auth-container.right-panel-active .overlay-left {
  transform: translateX(0);
}
.overlay-right {
  right: 0;
  transform: translateX(0);
}
.auth-container.right-panel-active .overlay-right {
  transform: translateX(20%);
}
.overlay-panel h1 {
  color: var(--color-white);
  margin-bottom: 10px;
}
.overlay-panel p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}
@media screen and (max-width: 768px) {
  .auth-wrapper {
    padding: 20px;
  }
  .auth-container {
    width: 100%;
    max-width: 400px;
    min-height: 600px;
    border-radius: 30px;
  }
  .form-container {
    width: 100%;
    height: 50%;
    border-radius: 0 0 30px 30px;
  }
  .sign-in-container {
    width: 100%;
    height: 50%;
    bottom: 0;
    top: auto;
    left: 0;
    z-index: 2;
    border-radius: 0 0 30px 30px;
  }
  .sign-up-container {
    width: 100%;
    height: 50%;
    bottom: 0;
    top: auto;
    left: 0;
    opacity: 0;
    z-index: 1;
    border-radius: 0 0 30px 30px;
  }
  .auth-container.right-panel-active .sign-in-container {
    transform: translateY(100%);
  }
  .auth-container.right-panel-active .sign-up-container {
    transform: translateY(0);
    opacity: 1;
    z-index: 5;
  }
  .overlay-container {
    width: 100%;
    height: 50%;
    left: 0;
    top: 0;
    border-radius: 30px 30px 0 0;
  }
  .auth-container.right-panel-active .overlay-container {
    transform: translateY(0);
  }
  .overlay {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 30px 30px 0 0;
  }
  .auth-container.right-panel-active .overlay {
    transform: translateX(0);
  }
  .overlay-panel {
    width: 100%;
    height: 100%;
    padding: 25px 20px;
    position: static;
    transform: none !important;
  }
  .overlay-left {
    display: none;
  }
  .auth-container.right-panel-active .overlay-left {
    display: flex;
  }
  .overlay-right {
    display: flex;
  }
  .auth-container.right-panel-active .overlay-right {
    display: none;
  }
  form {
    padding: 10px 30px;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: 0 0 30px 30px;
  }
  h1 {
    font-size: 20px;
    margin-bottom: 8px;
  }
  .overlay-panel h1 {
    font-size: 22px;
    margin-bottom: 5px;
  }
  .overlay-panel p {
    font-size: 12px;
    margin: 8px 0 15px;
  }
  span {
    font-size: 11px;
  }
  .register {
    margin-top: 20px;
  }
}
@media screen and (max-width: 480px) {
  .auth-wrapper {
    padding: 15px;
  }
  .auth-container {
    max-width: 100%;
    border-radius: 25px;
    min-height: 580px;
  }

  form {
    padding: 15px 25px;
    padding-top: 15px;
    padding-bottom: 15px;
    border-radius: 0 0 25px 25px;
  }
  .overlay {
    border-radius: 25px 25px 0 0;
  }
  .overlay-container {
    border-radius: 25px 25px 0 0;
  }
  .form-container {
    border-radius: 0 0 25px 25px;
  }
  .sign-in-container {
    border-radius: 0 0 25px 25px;
  }
  .sign-up-container {
    border-radius: 0 0 25px 25px;
  }
  .overlay-panel {
    padding: 20px 15px;
  }
}
</style>
