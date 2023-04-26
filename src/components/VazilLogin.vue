<template>
  <v-container class="login-column" :style="`max-width: ${width}px; background-color: ${bgColor};`">
    
    <!-- 로그인 -->
    <v-sheet v-if="sheetType==='login'" width="100%" class="login-sheet pa-3">
      <h2>로그인</h2>
      
      <v-form class="my-4">
        <v-text-field 
          id="login-email-input"
          label="이메일"
          v-bind="loginAttrs"
          v-model="email"
          @keyup.enter="userLogin"
          autocomplete="email"
        />
        <v-text-field
          id="login-password-input"
          type="password"
          label="비밀번호"
          v-bind="loginAttrs"
          v-model="password"
          @keyup.enter="userLogin"
          autocomplete="password"
        />
        <v-row no-gutters v-if="$store.state.loginLockStatus?.captchaActive" justify="space-around" align="center" class="mt-4 mb-8">
          <v-col cols="5" style="background-color: white; padding: 5px; padding-top: 10px; border-radius: 5px;" justify="center" align="center">
            <img :src="captchaImgSrc" alt="" width="120" height="28">
          </v-col>
          <v-icon @click="generateCaptcha()" right>mdi-reload</v-icon>
          <v-col cols="4">
            <v-text-field
              id="login-captcha-input"
              type="text"
              placeholder="문자 입력"
              v-model="captchaInputValue"
              hide-details
              :maxlength="5"
              @keyup.enter="userLogin"
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>
        <v-row no-gutters v-if="errorMsg" class="text-red text-subtitle-2 pa-2">{{errorMsg}}</v-row>
      </v-form>
      
      <!-- action buttons -->
      <v-row no-gutters class="mt-4" style="text-align: center;">
        <v-col cols="12">
          <v-btn v-bind="actionBtnAttrs" @click="userLogin" :loading="loadingAuth" class="mb-6">로그인</v-btn>
          
          <div><span class="text-subtitle-2">SNS 간편 로그인/회원가입</span></div>
          <div class="mb-7 mt-1 sns-btns">
            <v-btn v-if="snsLoginList.includes('naver')" @click="naverOAuth2Login" :disabled="loadingAuth" variant="plain" icon>
              <img :src="require(`@/assets/image/naver_rac.png`)"/>
            </v-btn>
            <v-btn v-if="snsLoginList.includes('kakao')"  @click="kakaoOAuth2Login" :disabled="loadingAuth" variant="plain" icon>
              <img :src="require(`@/assets/image/kakao.png`)">
            </v-btn>
            <v-btn v-if="snsLoginList.includes('google')"  @click="googleOAuth2Login" :disabled="loadingAuth" variant="plain" icon>
              <img :src="require(`@/assets/image/google.png`)">
            </v-btn>
          </div>
                    
          <a @click="loadFindPWSheet">비밀번호 찾기</a> /
          <a @click="loadJoinSheet">회원가입</a>
        </v-col>
      </v-row>
    </v-sheet>
    
    <!-- 회원가입 -->
    <v-sheet v-if="sheetType==='join'" width="100%" class="join-sheet pa-3">
      <h2>회원가입</h2>
      <p class="mb-4">당신의 인공지능을 만들 수 있습니다.</p>

      <!-- 회원가입(1) > 약관 동의 -->
      <div v-if="joinIndex === 0" @submit.prevent class="agreement-container">
        <v-checkbox
          :model-value="fullAgreement"
          @click="clickFullAgreement"
          hide-details
          label="전체 동의"
          class="mt-4"
          density="compact"
        >
        </v-checkbox>
        
        <v-divider class="my-2"/>
      
        <v-row no-gutters v-for="(item, index) in agreementList" :key="index">
          <v-col v-if="!item.content" cols="12" class="ma-0 pa-0">
            <v-checkbox
              v-model="checkedAgreement"
              :true-value="item.key"
              hide-details
              multiple
              density="compact"
              :label="`${(item.required ? '(필수) ' : '') + item.title}`"
            />
          </v-col>
          
          <v-col v-else cols="12" class="ma-0 pa-0 d-flex flex-wrap justify-space-between align-center">
            <v-checkbox
              v-model="checkedAgreement"
              :true-value="item.key"
              hide-details
              multiple
              density="compact"
              :label="`${(item.required ? '(필수) ' : '') + item.title}`"
              @click="agreementExpandItem = item.key"
              class="d-inline-block"
              style="max-width: 85%;"
            />
            <v-icon @click="agreementExpandItem = agreementExpandItem == item.key ? '' : item.key">mdi-chevron-down</v-icon>
            <div class="expand-content" :class="agreementExpandItem == item.key ? 'active' : ''">
              {{item.content}}
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- 회원가입(2) > 정보 입력 -->
      <v-form class="join-form py-2" v-if="joinIndex === 1" @submit.prevent>
        <div v-if="joinInputList.includes('email')">
          <h4>이메일<v-icon v-if="emailValid" class="validation-icon">mdi-check-circle</v-icon></h4>
          <v-row no-gutters align="center">
            <v-col cols="12" sm="5">
              <v-text-field
                id="join-email-front"
                class="join-email-front"
                placeholder="이메일"
                v-bind="joinAttrs"
                v-model="joinEmailFront"
                :rules="$rules.emailFirst"
                :maxlength="50"
                @keyup.enter="joinLogin"
                dirty
              />
            </v-col>
            <v-col cols="2" sm="1" class="d-flex justify-center">
              <span class="px-2 mb-5">@</span>
            </v-col>
            <v-col cols="10" sm="6">
              <v-select
                id="join-email-last"
                v-if="joinEmailBackSelect !== '직접 입력'"
                v-model="joinEmailBackSelect"
                :items="['선택해주세요.', 'naver.com', 'gmail.com', 'daum.net', 'nate.com', 'hanmail.net', '직접 입력']"
                @update:modelValue="e => e === '직접 입력' ? joinEmailBack = '' : joinEmailBack = e"
                placeholder="이메일 주소 선택"
                v-bind="joinAttrs"
              />
              <v-text-field
                v-else
                id="join-email-last"
                class="email-last"
                placeholder="이메일"
                v-bind="joinAttrs"
                v-model="joinEmailBack"
                :rules="$rules.emailLast"
                :maxlength="50"
                @click:appendInner="joinEmailBackSelect = '선택해주세요.', joinEmailBack = ''"
                append-inner-icon="mdi-close"
              />
            </v-col>
          </v-row>
        </div>
            
        <div v-if="joinInputList.includes('password')">
          <h4>비밀번호<v-icon v-if="pwValid" class="validation-icon">mdi-check-circle</v-icon></h4>
          <span class="text-grey" style="font-size: 0.9rem;">영문, 숫자를 포함하여 6~20자 이내로 입력해주세요.</span>
          <v-text-field
            id="join-password"
            type="password"
            placeholder="비밀번호"
            v-bind="joinAttrs"
            v-model="joinPassword"
            :rules="$rules.passwordEasy"
            :maxlength="20"
            @keyup.enter="joinLogin"
            autocomplete="password"
          />
          
          <h4>비밀번호 확인<v-icon v-if="pw2Valid" class="validation-icon">mdi-check-circle</v-icon></h4>
          <v-text-field
            id="join-password-confirm"
            type="password"
            placeholder="비밀번호 확인"
            v-bind="joinAttrs"
            v-model="joinPasswordconfirm"
            :maxlength="20"
            :rules="[value => value == joinPassword || '비밀번호가 일치하지 않습니다.']"
            @keyup.enter="joinLogin"
            autocomplete="password-confirm"
          />
        </div>
        
        <div v-if="joinInputList.includes('nickname')">
          <h4>닉네임<v-icon v-if="nicknameValid" class="validation-icon">mdi-check-circle</v-icon></h4>
          <v-text-field
            id="join-nickname"
            placeholder="닉네임"
            v-bind="joinAttrs"
            v-model="userName"
            :rules="$rules.nickname"
            :maxlength="50"
            @keyup.enter="joinLogin"
          />
        </div>
        
        <div v-if="joinInputList.includes('captcha')">
          <h4>자동 가입 방지 문자</h4>
          <v-row no-gutters class="justify-space-around align-center mt-4 mb-4">
            <v-col cols="6" sm="5" style="background-color: white; padding: 5px; padding-top: 10px; border-radius: 5px; min-width: 140px;" justify="center" align="center">
              <img :src="captchaImgSrc" alt="" width="120" height="28">
            </v-col>
            <v-col cols="12" sm="1" class="text-center my-2">
              <v-icon @click="generateCaptcha()" right>mdi-reload</v-icon>
            </v-col>
            <v-col cols="7" sm="4">
              <v-text-field
                class="join-captcha"
                type="text"
                placeholder="문자 입력"
                v-model="captchaInputValue"
                hide-details
                :maxlength="5"
                @keyup.enter="userLogin"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
        </div>
      </v-form>
      <p v-if="errorMsg" class="text-red text-subtitle-2 pa-2">{{errorMsg}}</p>
      <v-btn
        v-if="joinIndex === 0"
        v-bind="actionBtnAttrs"
        @click="joinIndex = 1"
        :loading="loadingAuth"
        :disabled="checkedAgreement.length < agreementList.length"
        class="my-4"
      >
        확인
      </v-btn>
      <v-btn
        v-else
        v-bind="actionBtnAttrs"
        @click="joinLogin"
        :loading="loadingAuth"
        class="mb-4"
      >
        가입하기
      </v-btn>
          
      <v-row no-gutters class="justify-center">
        <!-- <v-btn @click="$notify('hello')">TEST</v-btn> -->
        <div class="text-center">이미 계정이 있으신가요? <a @click="loadLoginSheet">로그인</a></div>
      </v-row>
    </v-sheet>

    <!-- 본인 확인(이메일 전송) 안내 -->
    <v-sheet v-if="sheetType==='email-confirm'" width="100%">
      <h2 v-if="validType === 'join'">이메일 인증</h2>
      <h2 v-if="validType === 'findPW'">비밀번호 초기화</h2>
      
      <v-row
        no-gutters
        class="pa-2 my-8 mx-10 justify-center"
        style="background-color: white; color: black; border-radius: 4px;"
      >
        {{validEmailAddress}}
      </v-row> 

      <v-row class="mx-1 my-4">
        <span v-if="validType === 'join'">
          해당 이메일로 인증 메일이 전송되었습니다.
          발송시간으로 부터 2시간 이내에 인증을 완료해주세요.
        </span>
        <span v-if="validType === 'findPW'">
          비밀번호 변경 링크가 해당 이메일 주소로 전송되었습니다.
          링크는 발송시간으로 부터 2시간까지 유효하오니 유효기간안에 링크를 통해 비밀번호 변경 절차를 진행하십시오.  
        </span>
      </v-row>
      
      <v-btn
        v-bind="actionBtnAttrs"
        :loading="loadingAuth"
        @click="retryEmailSend"
      >이메일 재전송
      </v-btn>
      <a @click="loadLoginSheet" class="mt-4 d-block text-center">로그인</a>
    </v-sheet>
    
    <!-- 비밀번호 찾기 -->
    <v-sheet v-if="sheetType === 'find-pw'" color="transparent" width="100%" class="pa-3">
      <h2>비밀번호 찾기</h2>
      <p>비밀번호를 찾고자 하는 이메일을 입력해 주세요.</p>
      <v-text-field 
        :rules="[$rule.email]"
        :maxlength="50"
        label="이메일"
        prepend-inner-icon="mdi-email-outline"
        v-model="email"
        @keyup.enter="findPW"       
        class="mt-10"
        hide-details
        single-line
        variant="outlined"
        density="comfortable"
      />
      <p v-if="errorMsg" class="text-red text-subtitle-2 pa-2">{{errorMsg}}</p>
      <v-btn
        v-bind="actionBtnAttrs"
        @click="findPW"
        :loading="loadingAuth"
        class="mb-2 mt-10"
      >
        비밀번호 찾기
      </v-btn>
      <a @click="loadLoginSheet" class="d-block text-center mt-4">로그인</a>
    </v-sheet>
  </v-container>
</template>
<script>

export default {
  name: 'vazilDialog',
  props: {
    width: {
      type: String,
      default: '420'
    },
    bgColor: {
      type: String,
      default: 'transparent'
    },
    mainColor: {
      type: String,
      default: 'primary'
    },
    snsLoginList: {
      type: Array,
      default: () => []
    },
    textFieldVariant: {
      type: String,
      default: 'outlined'
    },
    textFieldSingleLine: {
      type: Boolean,
      default: true
    },
    agreementList: {
      type: Array,
      default: () => [{
        key: 'fourteen',
        title: '만 14세 이상입니다.',
        content: null,
        required: true,
      }]
    },
    joinInputList: {
      type: Array,
      default: () => ['email', 'password', 'nickname']
    }
  },
  data: function(){
    return {
      sheetType: 'login',
      agreementExpandItem: '',
      loadingAuth: false,
      checkedAgreement: [],
      validEmailAddress:'se5nghee@naver.com',
      email:'',
      password:'',
      errorMsg: '',
      loginLockCount: 5,
      loginLockTime: 1000*60*10, // 10분
      captchaImgSrc: '',
      captchaText: '',
      captchaInputValue: '',
      loginAttrs: {
        rounded:false,
        autofocus:true,
        density: 'comfortable',
        maxLength: 50,
        variant: this.textFieldVariant,
        singleLine: this.textFieldSingleLine,
        hideDetails: this.textFieldSingleLine
      },
      joinAttrs: {
        rounded:false,
        autofocus:true,
        variant: 'outlined',
        density: 'compact',
        singleLine: true,
        lass: 'my-2',
        hideDetails: true,
      },
      actionBtnAttrs: {
        elevation: 0,
        color: this.mainColor,
        block: true,
      },
      joinEmailFront:'',
      joinEmailBackSelect:'선택해주세요.',
      joinEmailBack:'',
      joinPassword:'',
      joinPasswordconfirm:'',
      userName:'',
      joinIndex: 0,
      validType: 'join',
    }
  },
  watch:{
  },
  computed: {
    fullAgreement() {
      return this.checkedAgreement.length === this.agreementList.length
    },
    joinEmail() {
      return this.joinEmailFront + '@' + this.joinEmailBack
    },
    emailValid(){
      return this.$regular.email(this.joinEmailFront + '@' + this.joinEmailBack)
    },
    pwValid(){
      return this.$regular.passwordEasy(this.joinPassword)
    },
    pw2Valid(){
      return this.$regular.passwordEasy(this.joinPassword)
        && this.joinPasswordconfirm === this.joinPassword
    },
    nicknameValid(){
      return this.$regular.koEnNumOnly(this.userName)
    }
  },
  methods:{
    clickFullAgreement() {
      if(this.fullAgreement) {
        this.checkedAgreement = []
      } else {
        this.checkedAgreement = this.agreementList.map(item => item.key)
      }
    },
    retryEmailSend(){
      console.log('retryEmailSend')
    },
    
    // Google 로그인
    async googleOAuth2Login(){
      console.log('google login')
    },
    // Naver 로그인
    async naverOAuth2Login(){
      console.log('naver login')
    },
    
    kakaoOAuth2Login(){
      console.log('kakao login')
    },
    
    // 로그인
    async userLogin() {
      let userData={
        username:this.email,
        password:this.password
      }
      
      // 입력값 확인 
      if(this.email.length < 1){
        this.errorMsg = '이메일을 입력하세요.'
        document.getElementById('login-email-input').focus()
        return 
      } else if(this.password.length < 1) {
        this.errorMsg = '비밀번호를 입력하세요.'
        document.getElementById('login-password-input').focus()
        return
      }
      
      this.errorMsg = ''
      
      if(this.$store.state.loginLockStatus.captchaActive && !this.checkCaptcha()){
        return
      }

      this.loadingAuth = true


      if(userData.username !== 'se5nghee@naver.com' || userData.password !== 'aa'){
        this.updateLoginLockStatus()
      } else {
        this.$store.commit('setLoginLockStatus', {captchaActive: false, latestLoginTryDate: '', loginFailCount: 0})
      }

      this.loadingAuth = false
    },
    
    // 자동 입력 방지 문구 이미지 생성
    generateCaptcha(){

      // 캔버스 생성
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = 200
      canvas.height = 50


      // 캔버스에 문자 그리기
      let uniquechar = "";
      const randomchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 5; i++) {
        uniquechar += randomchar.charAt(Math.random() * randomchar.length)
      }

      this.captchaText = uniquechar

      ctx.font = 'italic 48px bold cursive'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.fillText(uniquechar, 100, 25)


      // 점선 원 4개 (이미지 노이즈 처리)
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
      ctx.lineWidth = 3;

      [50,100,150,200].forEach((x)=>{
        ctx.moveTo(x, 50)
        for(let r=7; r<=23; r=r+5){
          for(let i=0; i<2; i=i+0.2){
            ctx.strokeStyle = 'white'
            ctx.beginPath();
            ctx.arc(x-25, 25, r, Math.PI * i, Math.PI * (i+0.1), false);
            ctx.stroke();

            ctx.strokeStyle = 'transparent'
            ctx.beginPath();
            ctx.arc(x-25, 25, r, Math.PI * (i+0.1), Math.PI * (i+0.2), false);
            ctx.stroke();
          }
        }
      })


      // 중앙선
      ctx.fillRect(10,24,180,2)


      // 랜덤 직선 3개 (이미지 노이즈 처리)
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2;
      
      ctx.beginPath()
      ctx.moveTo(Math.random()*200, Math.random()*40);

      for(let i=0; i<3; ++i){
        ctx.lineTo(Math.random()*200, Math.random()*40);
        ctx.stroke()
      }


      // 캔버스에서 이미지 추출
      const imageUrl = canvas.toDataURL('image/png', 1.0)
      this.captchaImgSrc = imageUrl
    },
    
    // 자동 입력 방지 문자 일치 여부 확인
    checkCaptcha(){      
      if (this.captchaText === this.captchaInputValue) {
        return true
      } else {
        alert("자동 입력 방지 문자를 다시 입력해주세요.")
        this.generateCaptcha()
        this.captchaInputValue = ''
        document.getElementById('login-captcha-input').focus()

        return false
      }
    },
    
    // 로그인 제한 상태 확인
    checkLoginLockStatus(){
      let {captchaActive, latestLoginTryDate, loginFailCount} = this.$store.state.loginLockStatus
      
      if(captchaActive){
        if(Date.now() - latestLoginTryDate >= this.loginLockTime){
          captchaActive = false
          loginFailCount = 0
          latestLoginTryDate = ''
          this.$store.commit('setLoginLockStatus', {captchaActive, latestLoginTryDate, loginFailCount})
        }
      }
    },
    
    // 로그인 제한 상태 업데이트
    updateLoginLockStatus(){
      let {captchaActive, latestLoginTryDate, loginFailCount} = this.$store.state.loginLockStatus
      
      if(captchaActive === true) return
      
      // 로그인 실패 횟수를 초과했을 경우 자동 입력 방지 문자 활성화
      if(loginFailCount >= this.loginLockCount-1){
        captchaActive = true
        this.generateCaptcha()
      } else {
        loginFailCount++
      }
      
      latestLoginTryDate = Date.now()
      
      this.$store.commit('setLoginLockStatus', {captchaActive, latestLoginTryDate, loginFailCount})
    },
    
    // 회원가입
    async joinLogin(){      
      
      // 입력값 확인
      if(!this.emailValid){
        this.errorMsg = '이메일을 확인하세요.'
        document.getElementById('join-email-front').focus()
        return 
      } else if(!this.pwValid) {
        this.errorMsg = '비밀번호를 확인하세요.'
        document.getElementById('join-password').focus()
        return
      } else if(!this.pw2Valid) {
        this.errorMsg = '비밀번호를 확인하세요.'
        document.getElementById('join-password-confirm').focus()
        return
      } else if(!this.nicknameValid) {
        this.errorMsg = '닉네임을 확인하세요.'
        document.getElementById('join-nickname').focus()
        return
      }
      
      if(!this.checkCaptcha()){
        return
      }
      
      this.$emit('join', this.email)
    },
    // 비밀번호 찾기
    async findPW(){
      if(this.email.length < 1 || !this.$regular.email(this.email)){
        this.errorMsg = '이메일을 올바르게 입력하세요.'
        return 
      }
      
      this.errorMsg = ''
      this.$emit('findPW', this.email)
      this.validType = 'findPW'
    },

    // 회원가입 sheet 활성화
    loadJoinSheet(){
      this.joinEmailFront ='',
      this.joinEmailBack ='',
      this.joinPassword='',    
      this.joinPasswordconfirm = '',
      this.userName=''
      this.captchaInputValue = ''
      this.errorMsg = ''
      this.joinIndex = 0
      this.sheetType = 'join'
    },

    // 로그인 sheet 활성화
    loadLoginSheet(){
      this.email = '';
      this.password = '';
      this.captchaInputValue = ''
      this.errorMsg = ''
      this.sheetType = 'login'
    },

    // 이메일 전송 완료 sheet 활성화
    loadEmailConfirmSheet(email){
      this.validEmailAddress = email
      this.email = '';
      this.password = '';
      this.errorMsg = ''
      this.sheetType = 'email-confirm'
    },
    
    // 비밀번호 찾기 sheet 활성화
    loadFindPWSheet(){
      this.email = '';
      this.errorMsg = ''
      this.sheetType = 'find-pw'
    },
  },
  mounted(){
    this.checkLoginLockStatus()
    this.generateCaptcha()
  },
}
</script>

<style lang="scss">
.login-column{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  // min-width: 320px;
  height: 100%;
  z-index: 1;
  // border: 1px solid #7e7e7e;
  // border-radius: 5px;
  // background-color: beige;
  
  a {
    display: inline-block;
    color: #1E88E5;
    cursor: pointer;
    // margin:6px 0;
  }


  &::after{
    content:'';
    position: absolute;
    z-index: -1;
    left:0;
    top:0;
    width:100%;
    height: 100%;
    // background:url('~/assets/image/bg32.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    filter: opacity(30%);
  }

  @media screen and (max-width: 960px) {
    align-items: flex-start;
  }
  
  @media screen and (max-width: 360px) {
    min-width: 90vw;
  }

  .v-sheet{
    box-shadow: none !important;
    background-color: transparent !important;
    
    .v-card-title{
      font-size: 23px;
      font-weight: bold;
    }
    .v-card-subtitle{
      font-size: 14px;
    }
    
    .v-text-field {
      input {
        // background-color: lightyellow;
      }
      
      input:-webkit-autofill {
        -webkit-text-fill-color: inherit;
        transition: background-color 5000s ease-in-out 0s;
      }
      
      input:autofill {
        -webkit-text-fill-color: inherit;
        transition: background-color 5000s ease-in-out 0s;
      }
    }
    
    &.login-sheet {
      .v-form { // 로그인 v-text-field border 커스텀
        > .v-text-field:nth-child(1) .v-field { // 이메일
          .v-field__outline {
              transition: box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1);
              border-radius: 0;
              
            .v-field__outline__start {
              border-bottom: none;
              border-radius: 4px 0 0 0px;
            }
            
            .v-field__outline__end {
              border-bottom: none;
              border-radius: 0 4px 0px 0;
            }
          }
          
          &.v-field--focused, &.v-field--focused:hover {
            z-index: 9;
            
            .v-field__outline {
              box-shadow: none;
              
              .v-field__outline__start {
                box-shadow: 0px 2px 0 0 currentColor;
              }
              
              .v-field__outline__end {
                box-shadow: 0px 2px 0 0 currentColor;
              }
            }
          }
          
          &:hover {
            .v-field__outline {
              box-shadow: 0px 0.5px 0 0;
              transition: box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
          }
        }
        
        > .v-text-field:nth-child(2) { // 비밀번호
          .v-field__outline {
            .v-field__outline__start {
              border-radius: 0px 0 0 4px;
            }
            
            .v-field__outline__end {
              border-radius: 0 0px 4px 0;
            }
          }
        }
      }
      
      .sns-btns { // sns button 커스텀
        .v-btn {
          opacity: 1;
          margin: 0 5px;
          
          img {
            width: 36px;
            height: 36px;
          } 
        }
      }
    }
    
    &.join-sheet {
      .join-form {
        .v-text-field {
          margin-bottom: 24px;
          
          @media screen and (max-width: 600px) {
            &.join-email-front {
              margin-bottom: 4px;
              // background-color: red !important;
            }
          }

          
          &.join-captcha {
            margin-bottom: 0;
          }
          
          .email-last {
            .v-field__append-inner {
              position: absolute;
              top: 4px;
              right: 0;
              font-size: 0.9rem;
            }
          }
        }
        h4 {
          padding-bottom: 4px;
        }
        
        .validation-icon {
          color: rgba(var(--v-theme-success), 1);
          padding-left: 8px;
          font-size: 1rem;
        }
      }
    }
  }

  .v-btn{
    text-transform: capitalize !important;
    // color: #fff;
    
    *{
      font-size: 16px;
    }
  }
  
  .agreement-container {
    margin-bottom: 10px;
    
    label {
      cursor: pointer;
      opacity: 1;
    }

    .v-col {
      padding: 10px;
    }
    
    .expand-content {
      height: 0;
      overflow: hidden;
      font-size: 0.85rem;
      padding: 0 15px 0 25px;
      transition: all 0.2s ease-in-out;
      
      &.active {
        height: 200px;
        overflow: auto;
        padding-top: 10px;
        padding-bottom: 10px;
        transition: all 0.2s ease-in-out;
      }
    }
  }
}
</style>