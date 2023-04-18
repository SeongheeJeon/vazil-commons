<template>
  <div>
    <!-- <span class="mr-4">{{$t('홈 화면')}}</span> -->
    <!-- <VazilDialog
      ref="testDialog"
      v-bind="testDialogProps"
      @click-yes="clickYes"
      @click-no="clickNo"
    >
      <template #loadBtn>
        <v-btn @click="$refs.testDialog.dialog = true">
          <v-icon>mdi-earth</v-icon>
        </v-btn>
      </template>
      
      <template #title>
        <v-row no-gutters>
          TITLE!!!
        </v-row>
      </template>
      
      <template #content>
        <v-row no-gutters>
          이것은 내용입니다. 이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.
          이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다.
          이것은 내용입니다. 이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.이것은 내용입니다.
          이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다. 이것은 내용입니다.
        </v-row>
      </template>
      
      <template #actionBtn>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-btn>버튼</v-btn>
          <v-btn>안녕</v-btn>
        </v-row>
      </template>
    </VazilDialog> -->
    
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
    
    <VazilLogin v-bind="vazilLoginProps" />
  </div>
</template>

<script>
import privacy from '../assets/privacy.js';
import policy from '../assets/policy.js';

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
      privacy: privacy,
      policy: policy,
      vazilLoginProps: {
        bgColor: "beige",
        mainColor: "red",
        class: "mt-4",
        width: "500",
        snsLoginList: ['naver', 'kakao', 'google'],
        agreementList: [
          {
            key: 'fourteen',
            title: '만 14세 이상입니다.',
            content: null,
            required: true,
          },{
            key: 'privacy',
            title: '개인정보 수집 및 이용 동의',
            content: privacy,
            required: true,
          },{
            key: 'policy',
            title: '이용약관 동의',
            content: policy,
            required: true,
          }
        ],
        signUpInputList: ['email', 'password', 'nickname', 'captcha'],
      }
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
