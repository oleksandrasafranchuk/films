<template>
  <h3>Filter by Year:</h3>

  <div class="year-filter">
    <label class="year-label">
      <span class="year-range">{{ minYear }} - {{ maxYear }}</span>
    </label>

    <div class="slider-wrapper">
      <div class="slider-container">
        <input
          type="range"
          :min="absoluteMinYear"
          :max="absoluteMaxYear"
          v-model.number="minYear"
          @input="updateMinYear"
          class="slider min-slider"
        />
        <input
          type="range"
          :min="absoluteMinYear"
          :max="absoluteMaxYear"
          v-model.number="maxYear"
          @input="updateMaxYear"
          class="slider max-slider"
        />
      </div>

      <div class="slider-track">
        <div
          class="slider-fill"
          :style="{
            left: getPercentage(minYear) + '%',
            right: 100 - getPercentage(maxYear) + '%',
          }"
        ></div>
      </div>

      <div class="slider-ticks">
        <div
          v-for="year in yearTicks"
          :key="`tick-${year}`"
          class="tick"
          :style="{ left: getTickPosition(year) + '%' }"
        ></div>
      </div>

      <div class="year-labels">
        <span
          v-for="year in yearTicks"
          :key="year"
          class="year-tick-label"
          :style="{ left: getTickPosition(year) + '%' }"
        >
          {{ year }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YearFilter',
  data() {
    return {
      minYear: 1900,
      maxYear: new Date().getFullYear(),
      absoluteMinYear: 1900,
      absoluteMaxYear: new Date().getFullYear(),
      yearTicks: [],
    }
  },
  emits: ['filter'],
  created() {
    this.calculateYearTicks()
  },
  methods: {
    calculateYearTicks() {
      const range = this.absoluteMaxYear - this.absoluteMinYear
      const interval = Math.max(1, Math.ceil(range / 7))
      this.yearTicks = []

      for (let i = this.absoluteMinYear; i <= this.absoluteMaxYear; i += interval) {
        this.yearTicks.push(i)
      }

      if (!this.yearTicks.includes(this.absoluteMaxYear)) {
        this.yearTicks.push(this.absoluteMaxYear)
      }
    },

    updateMinYear(event) {
      const value = parseInt(event.target.value)
      if (value <= this.maxYear) {
        this.minYear = value
        this.emitFilter()
      }
    },

    updateMaxYear(event) {
      const value = parseInt(event.target.value)
      if (value >= this.minYear) {
        this.maxYear = value
        this.emitFilter()
      }
    },

    emitFilter() {
      this.$emit('filter', { minYear: this.minYear, maxYear: this.maxYear })
    },

    getPercentage(value) {
      const range = this.absoluteMaxYear - this.absoluteMinYear
      if (range === 0) return 0
      return ((value - this.absoluteMinYear) / range) * 100
    },

    getTickPosition(year) {
      return this.getPercentage(year)
    },

    setYearRange(minYear, maxYear) {
      this.absoluteMinYear = minYear
      this.absoluteMaxYear = maxYear
      this.minYear = minYear
      this.maxYear = maxYear
      this.calculateYearTicks()
    },
  },
}
</script>

<style scoped>
.year-filter {
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--color-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.year-label {
  display: block;
  margin-bottom: 20px;
  font-weight: 600;
  color: var(--color-text);
  font-size: 16px;
}

.year-range {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 18px;
  margin-left: 8px;
}

.slider-wrapper {
  position: relative;
  padding: 0;
  width: 100%;
}

.slider-container {
  position: relative;
  height: 30px;
  margin-bottom: 35px;
  display: flex;
  align-items: center;
}

.slider {
  position: absolute;
  width: 100%;
  height: 6px;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  background: none;
  border: none;
  outline: none;
  z-index: 3;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 6px var(--shadow-dark);
  border: 3px solid var(--color-white);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: var(--color-dark);
  box-shadow: 0 3px 10px var(--shadow-dark);
}

.slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 6px var(--shadow-dark);
  border: 3px solid var(--color-white);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  background: var(--color-dark);
  box-shadow: 0 3px 10px var(--shadow-dark);
}

.slider.min-slider {
  z-index: 5;
}

.slider.max-slider {
  z-index: 5;
}

.slider-track {
  width: 100%;
  height: 6px;
  background: var(--color-light);
  border-radius: 3px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin-bottom: 0;
  z-index: 1;
  left: 0;
}

.slider-fill {
  position: absolute;
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: all 0.1s ease;
  z-index: 2;
}

.slider-ticks {
  position: absolute;
  width: 100%;
  height: 12px;
  top: calc(50% + 12px);
  left: 0;
  z-index: 1;
}

.tick {
  position: absolute;
  width: 2px;
  height: 8px;
  background: var(--color-text-light);
  top: 0;
  transform: translateX(-50%);
}

.tick:first-child,
.tick:last-child {
  height: 12px;
  background: var(--color-primary);
  width: 2px;
}

.year-labels {
  position: absolute;
  width: 100%;
  height: 25px;
  top: calc(50% + 32px);
  left: 0;
  display: flex;
  align-items: flex-end;
}

.year-tick-label {
  position: absolute;
  font-size: 12px;
  color: var(--color-text-light);
  font-weight: 500;
  transform: translateX(-50%);
  top: 0;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .year-filter {
    padding: 16px;
    margin-bottom: 25px;
  }

  .year-label {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .year-range {
    font-size: 16px;
  }

  .slider-container {
    height: 28px;
    margin-bottom: 40px;
  }

  .slider {
    height: 5px;
  }

  .slider::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
  }

  .slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
  }

  .slider-track {
    height: 5px;
  }

  .slider-ticks {
    top: calc(50% + 6px);
  }

  .year-tick-label {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .year-filter {
    padding: 12px;
  }

  .year-label {
    font-size: 13px;
  }

  .year-range {
    font-size: 14px;
  }

  .slider-container {
    height: 26px;
    margin-bottom: 45px;
  }

  .year-tick-label {
    font-size: 10px;
  }
}
</style>
