<template>
  <div
    class="header-item-wrap"
    :class="xs ? 'mobile' : ''"
    v-click-outside="{handler: onClickOutsideHeaderItem}"
  >
    <v-btn
      v-bind="activeBtnOption"
      @click="$slots.expandContent ? clickHeaderItem() : $emit('onClick')"
      class="active-btn"
    >
      <div v-if="$slots.activeBtn">
        <slot name="activeBtn" />
      </div>
      
      <v-icon v-else :color="active ? 'primary':''">
        {{icon}}
      </v-icon>
    </v-btn>
  
    <v-slide-y-transition origin="top right 0">
      <v-card
        v-if="active"
        class="expand-container"
      >
        <slot name="expandContent" />
      </v-card>
    </v-slide-y-transition>
  </div>
</template>

<script setup>
import {ref, defineProps} from 'vue'
import {useDisplay} from "vuetify"

const {xs} = useDisplay()

defineProps({
  icon: {
    type: String,
  },
  badge: {
    type: Boolean,
    default: false,
  },
})

const activeBtnOption = ref({
  icon: true,
  ripple: false,
  size: 24,
  class: "mx-2"
})

const active = ref(false)

const clickHeaderItem = () => {
  active.value = !active.value
}

const onClickOutsideHeaderItem = () => {
  active.value = false
}

</script>

<style lang="scss" scoped>
.header-item-wrap {
  position: relative;

  .expand-container {
    position: absolute;
    right: 25%;
    transform: translateX(12px);
    border-radius: 10px !important;
    margin: 0;
    padding: 0;
    margin-top: 16px;
  }
  
  &.mobile .expand-container{
    top: -16px;
    right: 48px;
    transform: none;
    max-width: calc(100vw - 100px);
  }
}
</style>