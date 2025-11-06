<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['base-button', variant, { disabled: disabled }]"
    @click="$emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value),
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'ghost'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
}
</script>

<style scoped>
.base-button {
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  margin-top: 5px;
}

.base-button.primary {
  border: 1px solid var(--color-primary);
  background-color: var(--color-dark);
  color: var(--color-white);
  margin-bottom: 10px;
}

.base-button.primary:hover:not(.disabled) {
  transform: translateY(-2px);
}

.base-button.secondary {
  border: 2px solid var(--color-primary);
  background-color: white;
  color: var(--color-primary);
}

.base-button.secondary:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.base-button.ghost {
  background-color: transparent;
  border: 2px solid currentColor;
  color: inherit;
}

.base-button.ghost:hover:not(.disabled) {
  background-color: var(--color-dark);
  opasity: 0.1;
}

.base-button:active:not(.disabled) {
  transform: scale(0.95);
}

.base-button.disabled {
  opacity: 1;
  cursor: not-allowed;
}

.base-button:focus {
  outline: none;
}
@media (max-width: 768px) {
  .base-button {
    font-size: 10px;
  }
}
</style>
