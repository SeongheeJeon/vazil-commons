<template>
  <div>
    <span class="mr-4">{{$t('홈 화면')}}</span>
    <VazilDialog
      ref="testDialog"
      v-bind="testDialogProps"
      @click-yes="clickYes"
      @click-no="clickNo"
    >
      <!-- <template #loadBtn>
        <v-btn @click="$refs.testDialog.dialog = true">
          <v-icon>mdi-earth</v-icon>
        </v-btn>
      </template> -->
      
      <!-- <template #title>
        <v-row no-gutters>
          TITLE!!!
        </v-row>
      </template> -->
      
      <template #content>
        <v-row no-gutters>
          이것은 내용입니다. 이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.
          이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다.
          이것은 내용입니다. 이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.
          이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다.
        </v-row>
      </template>
      
      <!-- <template #actionBtn>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-btn>버튼</v-btn>
          <v-btn>안녕</v-btn>
        </v-row>
      </template> -->
    </VazilDialog>
    
    <!-- <VazilPagination
      type="omitted"
      color="red"
      active-color="red"
      :model-value="page"
      length="22"
      totalVisible="7"
      showFirstLastPage
    />

    <VazilPagination
      type="default"
      color="red"
      active-color="red"
      :model-value="page"
      length="22"
      totalVisible="7"
      :showFastPage="true"
      :showFirstLastPage="true"
      size="small"
      @set-page="setPage"
    /> -->
    
    <!-- <div style="background-color: white; width: 440px;" class="mx-auto my-4"> -->
      <VazilLogin
        color="green"
        class="mt-4"
        width="400"
      >
        <!-- <template #loadBtn>
          <v-btn @click="$refs.testDialog.dialog = true">
            <v-icon>mdi-earth</v-icon>
          </v-btn>
        </template> -->
      </VazilLogin>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  
  data() {
    return {
      testDialogProps: {
        width: '300',
        height: '400',
        loadBtnIcon: 'mdi-close',
        fullOnlyMobile: true,
        // persistent: true,
        yesBtnText: '업로드',
        noBtnText: '닫기',
        content: '내용입다',
        // bgColor: 'lightblue',
        mobileFull: true,
      },
      page: 1,
    }
  },
  
  methods: {
    clickYes() {
      console.log('clickYes')
    },
    clickNo() {
      console.log('clickNo')
    },
    setPage(){
      console.log('setPage')
    }
  }
}
</script>
