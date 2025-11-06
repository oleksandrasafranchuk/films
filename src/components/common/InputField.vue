<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @blur="$emit('blur')"
      @focus="handleFocus"
      :class="['input-field', { 'input-error': error, 'input-focus': isFocused }]"
    />
    <transition name="error-fade">
      <span v-if="error" class="error-message">
        {{ error }}
      </span>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },
  data() {
    return { isFocused: false }
  },
  emits: ['update:modelValue', 'blur'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
    },
    handleFocus() {
      this.isFocused = true
    },
  },
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-label {
  color: var(--color-text);
  font-weight: 500;
  font-size: 14px;
}
.required {
  color: var(--color-error);
}
.input-field {
  background-color: var(--color-light);
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 5px;
  font-size: 14px;
}
.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.input-field::placeholder {
  color: var(--color-text-light);
}
.input-error {
  border-color: var(--color-error) !important;
}
.input-error:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}
.error-message {
  color: var(--color-error);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.error-message::before {
  content: '⚠';
}
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
@media screen and (max-width: 768px) {
  .input-field {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
