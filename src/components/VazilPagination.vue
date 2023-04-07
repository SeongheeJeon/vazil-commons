<template>
  <div>
    <!-- omitted mode -->
    <v-pagination
      v-if="type == 'omitted'"
      v-bind="vuetifyOptions"
      v-model="page"
    />
    
    <!-- default mode -->
    <v-pagination
      v-else-if="type == 'default'"
      v-bind="vuetifyOptions"
      v-model="page"
      :start="pageGroup[0]"
      :length="pageGroup.length"
    >
      <template #first>
        <v-btn
          icon
          v-bind="vuetifyOptions"
          :disabled="page === 1"
          @click="goFirst"
        >
          <v-icon>mdi-page-first</v-icon>
        </v-btn>
      </template>
      
      <template #prev>
        <!-- fast prev -->
         <v-btn
          v-if="showFastPage"
          icon
          v-bind="vuetifyOptions"
          :disabled="pageGroup[0]==1"
          @click="goPrevGroup"
          class="mr-2"
        >
          <v-icon>mdi-chevron-double-left</v-icon>
        </v-btn>
        
        <!-- prev -->
         <v-btn
          icon
          v-bind="vuetifyOptions"
          :disabled="page === 1"
          @click="goPrev"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>
      
      <template #next>
        <!-- next -->
        <v-btn
          icon
          v-bind="vuetifyOptions"
          :disabled="page == length"
          @click="goNext"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        
        <!-- fast next -->
        <v-btn
          v-if="showFastPage"
          icon
          v-bind="vuetifyOptions"
          :disabled="pageGroup[pageGroup.length - 1] == length"
          @click="goNextGroup"
          class="ml-2"
        >
          <v-icon>mdi-chevron-double-right</v-icon>
        </v-btn>
      </template>
      
      <template #last>
        <v-btn
          icon
          v-bind="vuetifyOptions"
          :disabled="page == length"
          @click="goLast"
        >
          <v-icon>mdi-page-last</v-icon>
        </v-btn>
      </template>
    </v-pagination>
  </div>
</template>
<script>

  export default {
    name: 'vazilDialog',
    props: {
      type: {
        type: String,
        default: 'default'
      },
      showFastPage: {
        type: Boolean,
        default: undefined
      },
      activeColor: {
        type: String,
        default: undefined
      },
      ariaLabel: {
        type: String,
        default: undefined
      },
      border: {
        type: [String, Number, Boolean],
        default: undefined
      },
      color: {
        type: String,
        default: undefined
      },
      currentPageAriaLabel: {
        type: String,
        default: undefined
      },
      density: {
        type: String,
        default: undefined
      },
      disabled: {
        type: Boolean,
        default: undefined
      },
      elevation: {
        type: [String, Number],
        default: undefined
      },
      ellipsis: {
        type: String,
        default: undefined
      },
      firstAriaLabel: {
        type: String,
        default: undefined
      },
      firstIcon: {
        type: [String, Function],
        default: undefined
      },
      lastAriaLabel: {
        type: String,
        default: undefined
      },
      lastIcon: {
        type: [String, Function],
        default: undefined
      },
      length: {
        type: [String, Number],
        default: undefined
      },
      modelValue: {
        type: Number,
        default: undefined
      },
      nextAriaLabel: {
        type: String,
        default: undefined
      },
      nextIcon: {
        type: [String, Function],
        default: undefined
      },
      pageAriaLabel: {
        type: String,
        default: undefined
      },
      prevIcon: {
        type: [String, Function],
        default: undefined
      },
      previousAriaLabel: {
        type: String,
        default: undefined
      },
      rounded: {
        type: [String, Number, Boolean],
        default: undefined
      },
      showFirstLastPage: {
        type: Boolean,
        default: undefined
      },
      size: {
        type: [String, Number],
        default: undefined
      },
      start: {
        type: [String, Number],
        default: undefined
      },
      tag: {
        type: String,
        default: undefined
      },
      theme: {
        type: String,
        default: undefined
      },
      totalVisible: {
        type: [String, Number],
        default: undefined
      },
      variant: {
        type: String,
        default: 'text'
      },
    },
    data: () => ({
      page: 1,
      pageGroup: [],
      vuetifyOptionList: [
        'activeColor',
        'ariaLabel',
        'border',
        'color',
        'currentPageAriaLabel',
        'density',
        'disabled',
        'elevation',
        'ellipsis',
        'firstAriaLabel',
        'firstIcon',
        'lastAriaLabel',
        'lastIcon',
        'length',
        'modelValue',
        'nextAriaLabel',
        'nextIcon',
        'pageAriaLabel',
        'prevIcon',
        'previousAriaLabel',
        'rounded',
        'showFirstLastPage',
        'size',
        'start',
        'tag',
        'theme',
        'totalVisible',
        'variant'
      ],
      vuetifyOptions: {},
    }),
    watch:{
      page(val){
        this.$emit('set-page', val)
      }
    },
    methods:{
      goFirst(){
        this.page = 1
        
        this.pageGroup = []
        for(let i=0; i<this.totalVisible; i++){
          if(1+i > this.length) break
          this.pageGroup.push(1+i)
        }
      },
      goLast(){
        this.page = parseInt(this.length)
        
        let start = (Math.ceil(this.length / this.totalVisible) - 1) * this.totalVisible + 1
        
        this.pageGroup = []
        for(let i=0; i<this.totalVisible; i++){
          if(start + i > this.length) break
          this.pageGroup[i] = start + i
        }
      },
      goPrev(){
        this.page --
        
        if(this.page < this.pageGroup[0]){
          this.goPrevGroup()
          this.page = this.pageGroup[this.pageGroup.length-1]
        }
      },
      goNext(){
        this.page ++
        
        if(this.page > this.pageGroup[this.pageGroup.length-1]){
          this.goNextGroup()
          this.page = this.pageGroup[0]
        }
      },
      goPrevGroup(){
        let start = this.pageGroup[0] - this.totalVisible

        for(let i=0; i<this.totalVisible; i++){
          this.pageGroup[i] = start + i
        }
        
        this.page = this.pageGroup[0]
      },
      goNextGroup(){
        for(let i=0; i<this.pageGroup.length; i++){
          if(this.pageGroup[i] + parseInt(this.totalVisible) <= this.length){
            this.pageGroup[i] = this.pageGroup[i] + parseInt(this.totalVisible)
          } else {
            this.pageGroup[i] = null
          }
        }
        
        this.pageGroup = this.pageGroup.filter(v => v)
        this.page = this.pageGroup[0]
      },
    },
    mounted(){
      const validValue = Object.keys(this.$props).filter(key => this.$props[key] != undefined)
      
      validValue.forEach(key => {
        if(this.vuetifyOptionList.some(k => k === key)){
          this.vuetifyOptions[key] = this.$props[key]
        }
      })
      
      if(this.type == 'default'){
        this.goFirst()
      }
    },
  }
</script>

<style lang="scss">
</style>