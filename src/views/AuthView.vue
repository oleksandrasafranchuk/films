<template>
  <div class="auth-wrapper">
    <div class="auth-container" :class="{ 'right-panel-active': isRegisterMode }">
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister">
          <h1>Create Account</h1>
          <span>Use your email for registration</span>

          <input
            v-model="registerData.username"
            type="text"
            placeholder="Username"
            @blur="validateRegisterUsername"
          />
          <span v-if="registerErrors.username" class="error">{{ registerErrors.username }}</span>

          <input
            v-model="registerData.email"
            type="email"
            placeholder="Email"
            @blur="validateRegisterEmail"
          />
          <span v-if="registerErrors.email" class="error">{{ registerErrors.email }}</span>

          <input
            v-model="registerData.password"
            type="password"
            placeholder="Password"
            @blur="validateRegisterPassword"
          />
          <span v-if="registerErrors.password" class="error">{{ registerErrors.password }}</span>

          <button type="submit" :disabled="!isRegisterValid">Sign Up</button>
        </form>
      </div>

      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>Sign in</h1>
          <span>Use your account</span>

          <input
            v-model="loginData.email"
            type="email"
            placeholder="Email"
            @blur="validateLoginEmail"
          />
          <span v-if="loginErrors.email" class="error">{{ loginErrors.email }}</span>

          <input
            v-model="loginData.password"
            type="password"
            placeholder="Password"
            @blur="validateLoginPassword"
          />
          <span v-if="loginErrors.password" class="error">{{ loginErrors.password }}</span>

          <button type="submit" :disabled="!isLoginValid">Sign In</button>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button class="ghost" @click="toggleMode">Sign In</button>
          </div>

          <div class="overlay-panel overlay-right">
            <h1>Hello!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button class="ghost" @click="toggleMode">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthView',
  data() {
    return {
      isRegisterMode: true,

      registerData: {
        username: '',
        email: '',
        password: '',
      },

      registerErrors: {
        username: '',
        email: '',
        password: '',
      },

      loginData: {
        email: '',
        password: '',
      },

      loginErrors: {
        email: '',
        password: '',
      },
    }
  },

  computed: {
    isRegisterValid() {
      return (
        this.registerData.username.length >= 3 &&
        this.registerData.email &&
        this.isValidEmail(this.registerData.email) &&
        this.registerData.password.length >= 6 &&
        !Object.values(this.registerErrors).some((error) => error !== '')
      )
    },

    isLoginValid() {
      return (
        this.loginData.email &&
        this.isValidEmail(this.loginData.email) &&
        this.loginData.password &&
        this.loginData.password.length >= 6 &&
        !Object.values(this.loginErrors).some((error) => error !== '')
      )
    },
  },

  methods: {
    toggleMode() {
      this.isRegisterMode = !this.isRegisterMode
      this.clearErrors()
    },

    clearErrors() {
      this.registerErrors = {
        username: '',
        email: '',
        password: '',
      }
      this.loginErrors = {
        email: '',
        password: '',
      }
    },

    validateRegisterUsername() {
      if (!this.registerData.username) {
        this.registerErrors.username = 'Username is required'
      } else if (this.registerData.username.length < 3) {
        this.registerErrors.username = 'Minimum 3 characters'
      } else {
        this.registerErrors.username = ''
      }
    },

    validateRegisterEmail() {
      if (!this.registerData.email) {
        this.registerErrors.email = 'Email is required'
      } else if (!this.isValidEmail(this.registerData.email)) {
        this.registerErrors.email = 'Invalid email format'
      } else if (this.hasCyrillic(this.registerData.email)) {
        this.registerErrors.email = 'Email cannot contain Cyrillic characters'
      } else {
        this.registerErrors.email = ''
      }
    },

    validateRegisterPassword() {
      if (!this.registerData.password) {
        this.registerErrors.password = 'Password is required'
      } else if (this.registerData.password.length < 6) {
        this.registerErrors.password = 'Minimum 6 characters'
      } else {
        this.registerErrors.password = ''
      }
    },

    validateLoginEmail() {
      if (!this.loginData.email) {
        this.loginErrors.email = 'Email is required'
      } else if (!this.isValidEmail(this.loginData.email)) {
        this.loginErrors.email = 'Invalid email format'
      } else if (this.hasCyrillic(this.loginData.email)) {
        this.loginErrors.email = 'Email cannot contain Cyrillic characters'
      } else {
        this.loginErrors.email = ''
      }
    },

    validateLoginPassword() {
      if (!this.loginData.password) {
        this.loginErrors.password = 'Password is required'
      } else if (this.loginData.password.length < 6) {
        this.loginErrors.password = 'Minimum 6 characters'
      } else {
        this.loginErrors.password = ''
      }
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

<style>
:root {
  --color-primary: #222c58;
  --color-white: #ffffff;
  --color-light: #eee;
  --color-light-hover: #e0e0e0;
  --color-text: #333;
  --color-text-light: #666;
  --color-error: #e74c3c;
  --shadow-dark: rgba(0, 0, 0, 0.25);
  --shadow-light: rgba(0, 0, 0, 0.22);
}

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
  padding-bottom: 10px;
}

span {
  font-size: 12px;
  color: var(--color-text-light);
}

.error {
  color: var(--color-error);
  font-size: 11px;
  margin-top: -8px;
  display: block;
}

input {
  background-color: var(--color-light);
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 5px;
  font-size: 14px;
}

input:focus {
  outline: none;
  background-color: var(--color-light-hover);
}

button {
  border-radius: 20px;
  border: 1px solid var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
  margin-top: 15px;
}

button:active {
  transform: scale(0.95);
}

button:disabled {
  opacity: 1;
  cursor: not-allowed;
}

button.ghost {
  background-color: transparent;
  border-color: var(--color-white);
}

button.ghost:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

button.ghost:disabled {
  opacity: 1;
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
  background: #0d1a45;
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

  input {
    padding: 10px 15px;
    margin: 5px 0;
    font-size: 14px;
  }

  button {
    padding: 11px 35px;
    font-size: 11px;
    margin-top: 8px;
  }

  span {
    font-size: 11px;
  }

  .error {
    font-size: 10px;
    margin-top: -5px;
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
