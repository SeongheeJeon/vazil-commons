<template>
  <v-dialog
    v-model="dialog"
    content-class="vz-dialog"
    :persistent="persistent"
    :scrollable="scrollable"
    :fullscreen="isFullDialog"
    :min-height="minHeight"
    :width="isFullDialog ? '' : width"
    :height="isFullDialog ? '' : height"
  >
    <!-- LOAD BUTTON -->
    <template #activator="{props}">
      <slot v-if="$slots.loadBtn" name="loadBtn" />
      <v-btn
        v-else
        v-bind="props"
        :variant="loadBtnVariant"
        :color="loadBtnColor"
      >
        <v-icon v-if="loadBtnIcon">{{loadBtnIcon}}</v-icon>
        <span v-else>{{$t(loadBtnText)}}</span>
      </v-btn>
    </template>
    
    <!-- DIALOG -->
    <template #default>
      <v-card
        class="vz-dialog-container"
        elevation="0"
        :style="`background-color: ${bgColor};`"
      >
        <!-- TITLE -->
        <v-card-title class="vz-dialog-title">
          <slot v-if="$slots.title" name="title" />
          <span v-else>{{title}}</span>
          <v-icon class="close-btn" @click="clickNo" >mdi-close</v-icon>
        </v-card-title>

        <!-- CONTENT -->
        <v-card-text
          class="vz-dialog-content"
        >
          <slot v-if="$slots.content" name="content" />
          <v-row v-else no-gutters>{{content}}</v-row>
        </v-card-text>
        
        <!-- ACTION BUTTONS -->
        <v-card-actions class="vz-dialog-action-btns" >
          <v-spacer />
          <slot v-if="$slots.actionBtn" name="actionBtn" />
          <div v-else>
            <v-btn
              v-if="noBtnText"
              @click="clickNo"
              elevation="0"
              :disabled="disabledNo"
            >
              <span>{{noBtnText}}</span>
            </v-btn>
            <v-btn
              v-if="yesBtnText"
              @click="clickYes"
              elevation="0"
              :disabled="disabledYes"
              :loading="loading"
              color="primary"
            >
              <span>{{yesBtnText}}</span>
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>

  export default {
    name: 'vazilDialog',
    props: {
      // dialog options
      persistent:{
        type:Boolean,
        default:false
      },
      scrollable:{
        type:Boolean,
        default:true
      },
      fullscreen:{
        type:Boolean,
        default:false
      },
      fullOnlyMobile:{
        type:Boolean,
        default:false
      },
      width:{
        type: [String, Number],
        default: ''
      },
      height:{
        type: [String, Number],
        default: ''
      },
      minHeight:{
        type: [String, Number],
        default: 200
      },

      
      // loadBtn
      loadBtnIcon:{
        type:String,
        default:''
      },
      loadBtnText:{
        type:String,
        default:'버튼'
      },
      loadBtnVariant:{
        type:String,
        default:'flat'
      },
      loadBtnColor:{
        type:String,
        default:'primary'
      },
      
      // etc
      title:{
        type: String,
        default: 'TITLE'
      },
      content:{
        type: String,
        default: '내용'
      },
      bgColor:{
        type:String
      },
      yesBtnText:{
        type:String,
        default:"확인"
      },
      noBtnText:{
        type:String,
        default:"취소"
      },
      loading: {
        type:Boolean,
        default:false
      },
      disabledYes: {
        type:Boolean,
        default:false
      },
      disabledNo: {
        type:Boolean,
        default:false
      },
      autoClose: {
        type:Boolean,
        default:false
      }
    },
    data: () => ({
      dialog: false,
      isFullDialog: false,
    }),
    watch:{
      dialog() {
        this.$emit('change')
      },
    },
    computed: {
    },
    methods:{
      clickYes(){
        if(this.autoClose) this.dialog = false
        this.$emit('click-yes')
      },
      clickNo(){
        this.dialog = false
        this.$emit('click-no')
      },
    },
    mounted(){
      this.isFullDialog =  this.fullscreen || (this.fullOnlyMobile && window.innerWidth <= 425)
    }
  }
</script>

<style lang="scss">
.vz-dialog {  
  .theme--light &{
    box-shadow: 0px 10px 24px #171b2220 !important;

    .vz-dialog-container{
      border:1px solid #f5f9fb !important;
    }
  }

  .theme--dark &{
    box-shadow: 0px 10px 24px #171b2220 !important;

    .vz-dialog-container{
      border:1px solid #32343880 !important;
    }
  }
  
  .vz-dialog-container{
    overflow-x:hidden;
    padding:12px;
    
    .vz-dialog-title{
      position: relative;
      
      .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-50%,30%);
        transition: all 0.2s ease-in-out;
        opacity: 0.7;

        &:hover{
          opacity: 1.0;
          
          .theme--dark{
            background-color:#1b1c20 !important;
          }
          .theme--light{
            background-color:#ccc !important;
          }
          font-weight: bold !important;
        }
      }
    }
    
    .vz-dialog-content{
      padding: 12px 4px 12px 12px !important;
    }
  }
}
  
</style>