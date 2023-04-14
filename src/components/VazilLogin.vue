<template>
  <v-container class="login-column" :style="`max-width: ${width}px;`">
    
    <!-- 로그인 -->
    <v-sheet v-if="loginActive" width="100%" class="pa-3 login-sheet">
      <h2>로그인</h2>
      
      <v-form class="my-4">
        <v-text-field 
          id="loginInput1"
          label="이메일"
          v-bind="textFieldOptions"
          v-model="email"
          :maxlength="50"
          @input="()=>{rulesOn=false}"
          @keyup.enter="userLogin"
          :variant="textFieldVariant"
          :single-line="textFieldSingleLine"
          :hide-details="textFieldSingleLine"
          autocomplete="email"
          density="comfortable"
        />
        <v-text-field
          id="loginInput2"
          type="password"
          label="비밀번호"
          v-bind="textFieldOptions"
          v-model="password"
          :maxlength="20"
          @input="()=>{rulesOn=false}"
          @keyup.enter="userLogin"
          :variant="textFieldVariant"
          :single-line="textFieldSingleLine"
          autocomplete="password"
          density="comfortable"
        />
        <v-row no-gutters v-if="$store.state.loginLockStatus?.captchaActive" justify="space-around" align="center" class="mt-4 mb-8">
          <v-col cols="5" style="background-color: white; padding: 5px; padding-top: 10px; border-radius: 5px;" justify="center" align="center">
            <img :src="captchaImgSrc" alt="" width="120" height="28">
          </v-col>
          <v-icon @click="generateCaptcha()" right>mdi-reload</v-icon>
          <v-col cols="4">
            <v-text-field
              id="loginInput3"
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
      </v-form>
      
      <!-- action buttons -->
      <v-row no-gutters class="mt-4" style="text-align: center;">
        <v-col cols="12">
          <v-btn dark elevation="0" color="primary" @click="userLogin" block large :loading="loadingAuth" class="mb-6">로그인</v-btn>
          <div><span class="text-subtitle-2">SNS 간편 로그인/회원가입</span></div>
          <div class="mb-7 sns-btns">
            <v-btn @click="naverOAuth2Login" :disabled="loadingAuth" variant="plain" icon>
              <img :src="require(`@/assets/image/naver.png`)"/>
            </v-btn>
          </div>
          
          <!-- <v-btn dark elevation="0" style="background-color:#03C75A !important;" @click="naverOAuth2Login" block large :disabled="loadingAuth" class="mb-4">
            <span>네이버 로그인</span>
          </v-btn> -->
          
          <!-- Google 로그인 -->
          <!-- <v-btn fab color="#fff" small transition="none" @click="googleOAuth2Login">
            <v-avatar size="20px">
              <img :src="require(`@/assets/image/main/google_icon.png`)">
            </v-avatar>
          </v-btn> -->
          <a @click="findPWActiveAction">비밀번호 찾기</a> |
          <a @click="joinActiveAction">회원가입</a>
        </v-col>
      </v-row>
    </v-sheet>
    
    <!-- 회원가입 -->
    <v-sheet v-if="JoinActive" width="100%" class="signup-sheet pa-3">
      <h2>회원가입</h2>
      <p class="mb-4">당신의 인공지능을 만들 수 있습니다.</p>

      <!-- 회원가입 > 약관 동의 -->
      <div v-if="joinIndex === 0" @submit.prevent class="agreement-container">
        <v-checkbox
          v-model="fullAgreement"
          @click="clickFullAgreement"
          hide-details
          label="전체 동의"
          class="mt-4"
          density="compact"
        >
        </v-checkbox>
        
        <v-divider class="my-2"/>
      
        <v-row no-gutters>
          <v-col cols="12" class="ma-0 pa-0">
            <v-checkbox
              v-model="check_fourteen"
              hide-details
              density="compact"
              label="(필수) 만 14세 이상입니다."
            />
          </v-col>
        </v-row>
        
        <v-row no-gutters>
          <v-col cols="12" class="ma-0 pa-0 d-flex flex-wrap justify-space-between align-center">
            <v-checkbox
              v-model="check_privacy"
              hide-details
              density="compact"
              label="(필수) 개인정보 수집 및 이용 동의"
              @click="agreementExpandItem = 'privacy'"
              class="d-inline-block"
              style="max-width: 85%;"
            />
            <v-icon @click="agreementExpandItem = agreementExpandItem == 'privacy' ? '' : 'privacy'">mdi-chevron-down</v-icon>
            <div class="expand-content" :class="agreementExpandItem == 'privacy' ? 'active' : ''">
              {{privacy}}
            </div>
          </v-col>
        </v-row>
        
        <v-row no-gutters>
          <v-col cols="12" class="ma-0 pa-0 d-flex flex-wrap justify-space-between align-center">
            <v-checkbox
              v-model="check_policy"
              hide-details
              density="compact"
              label="(필수) 이용약관 동의"
              @click="agreementExpandItem = 'policy'"
              class="d-inline-block"
              style="max-width: 85%;"
            />
            <v-icon @click="agreementExpandItem = agreementExpandItem == 'policy' ? '' : 'policy'">mdi-chevron-down</v-icon>
          </v-col>
          <v-col cols="12">
            <div class="expand-content" :class="agreementExpandItem == 'policy' ? 'active' : ''">
              {{policy}}
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- 회원가입 > 정보 입력 -->
      <v-form class="signup-form py-2" v-if="joinIndex === 1" @submit.prevent :model-value="signupFormValid">
        <h4>이메일</h4>
        <v-row no-gutters align="center">
          <v-col sm="5" >
            <v-text-field
              id="signup-email-front"
              placeholder="이메일"
              v-bind="signupAttrs"
              v-model="signupEmailFront"
              :rules="$rules.emailFirst"
              :maxlength="50"
              @input="()=>{rulesOn=false}"
              @keyup.enter="signupLogin"
              dirty
            />
          </v-col>
          <span class="px-2 mb-5">@</span>
          <v-col sm="6">
            <v-select
              id="signup-email-last"
              v-if="signupEmailBackSelect !== '직접 입력'"
              v-model="signupEmailBackSelect"
              :items="['선택해주세요.', 'naver.com', 'gmail.com', 'daum.net', 'nate.com', 'hanmail.net', '직접 입력']"
              @update:modelValue="e => e === '직접 입력' ? signupEmailBack = '' : signupEmailBack = e"
              placeholder="이메일 주소 선택"
              v-bind="signupAttrs"
            />
            <v-text-field
              v-else
              id="signup-email-last"
              class="email-last"
              placeholder="이메일"
              v-bind="signupAttrs"
              v-model="signupEmailBack"
              :rules="$rules.emailLast"
              :maxlength="50"
              @input="()=>{rulesOn=false}"
              @click:appendInner="signupEmailBackSelect = '선택해주세요.', signupEmailBack = ''"
              append-inner-icon="mdi-close"
            />
          </v-col>
        </v-row>
            
        <h4>비밀번호</h4>
        <span class="text-grey" style="font-size: 0.9rem;">영문, 숫자를 포함하여 6~20자 이내로 입력해주세요.</span>
        <v-text-field
          id="signup-password"
          type="password"
          placeholder="비밀번호"
          :append-icon="$regular.passwordEasy(signupPassword) ? 'mdi-check' :''"
          v-bind="signupAttrs"
          v-model="signupPassword"
          :rules="$rules.passwordEasy"
          :maxlength="20"
          @input="()=>{rulesOn=false}"
          @keyup.enter="signupLogin"
          autocomplete="password"
        />
        
        <h4>비밀번호 확인</h4>
        <v-text-field
          id="signup-password-confirm"
          type="password"
          placeholder="비밀번호 확인"
          :append-icon="$regular.passwordEasy(signupPassword) && signupPasswordconfirm === signupPassword ? 'mdi-check' :''"
          v-bind="signupAttrs"
          v-model="signupPasswordconfirm"
          :maxlength="20"
          :rules="[value => value == signupPassword || '비밀번호가 일치하지 않습니다.']"
          @input="()=>{rulesOn=false}"
          @keyup.enter="signupLogin"
          autocomplete="password-confirm"
        />
        
        <h4>닉네임</h4>
        <v-text-field
          id="signup-nickname"
          placeholder="닉네임"
          :append-icon="$regular.koEnOnly(userName) ? 'mdi-check' : ''"
          v-bind="signupAttrs"
          v-model="userName"
          :rules="$rules.nickname"
          :maxlength="50"
          @input="()=>{rulesOn=false}"
          @keyup.enter="signupLogin"
        />
        
        <h4>자동 가입 방지 문자</h4>
        <v-row no-gutters class="justify-center align-center my-2">
          <img :src="captchaImgSrc" alt="" width="120" height="28">
          <v-icon @click="generateCaptcha()" right>mdi-reload</v-icon>
        </v-row>
        <v-text-field
          id="signup-captcha"
          type="text"
          placeholder="위의 문자를 그대로 입력해주세요."
          v-model="captchaInputValue"
          v-bind="signupAttrs"
          :maxlength="5"
          @keyup.enter="signupLogin"
        />
        <v-btn
          v-if="joinIndex === 0"
          elevation="0"
          color="primary"
          @click="joinIndex = 1"
          block
          large
          :loading="loadingAuth"
          :disabled="!check_privacy || !check_fourteen || !check_policy"
          class="mb-4"
        >
          확인
        </v-btn>
        <v-btn
          v-else
          elevation="0"
          block
          color="primary"
          @click="signupLogin"
          large
          :loading="loadingAuth"
          class="mb-4"
        >
          가입하기
        </v-btn>
      </v-form>
          
      <v-row no-gutters class="justify-center">
        <!-- <v-btn @click="$notify('hello')">TEST</v-btn> -->
        <div class="text-center">이미 계정이 있으신가요? <a @click="loginActiveAction">로그인</a></div>
      </v-row>
    </v-sheet>

    <!-- 이메일 인증 & 비밀번호 찾기-->
      <!-- <v-card color="#f5f5f5" flat v-if="validActive" max-width="420" width="100%">
        <v-card-title>
          <span v-if="validType === 'signup'">이메일 인증</span>
          <span v-if="validType === 'findPW'">비밀번호 초기화</span>
        </v-card-title>
        <v-card-text  @submit.prevent>
          <v-sheet class="my-4 pa-4" style="font-size:1rem; background-color:#777 !important;" dark rounded>
            {{validEmailAddress}}
          </v-sheet> 

          <div class="mx-1 my-4" v-if="validType === 'signup'">
            이메일 인증을 위한 확인 메일이 해당 이메일 주소로 전송되었습니다.
            발송시간으로 부터 2시간 이내에 인증을 완료해주세요.
          </div>
          <div class="mx-1 my-4" v-if="validType === 'findPW'">
            비밀번호 변경 링크가 해당 이메일 주소로 전송되었습니다.
            링크는 발송시간으로 부터 2시간까지 유효하오니 유효기간안에 링크를 통해 비밀번호 변경 절차를 진행하십시오.
          </div>
        </v-card-text>

        <v-card-actions>
          <v-row no-gutters v-if="validType === 'signup'">
            <v-col cols="12" align="center">
              <v-btn :elevation="0" block color="primary" large   :loading="loadingAuth" @click="retryEmailSend(validEmailAddress)">이메일 재전송</v-btn>
            </v-col>
            <a @click="loginActiveAction">로그인 홈</a>
          </v-row>
        </v-card-actions>
      </v-card> -->
    
    <!-- 비밀번호 찾기 -->
    <v-sheet v-if="findPWActive" color="transparent" width="100%" class="pa-3">
      <h2>비밀번호 찾기</h2>
      <p>비밀번호를 찾고자 하는 이메일을 입력해 주세요.</p>
      <v-text-field 
        :rules="[$rule.email]"
        :maxlength="50"
        label="이메일"
        prepend-inner-icon="mdi-email-outline"
        v-model="email"
        @keyup.enter="findPW"       
        class="my-10"
        hide-details
        single-line
        variant="outlined"
      />         
      <v-btn
        :rounded="false"
        elevation="0"
        block
        color="primary"
        @click="findPW"
        :loading="loadingAuth"
        class="mb-2"
      >
        비밀번호 찾기
      </v-btn>
      <a @click="loginActiveAction" class="d-block text-center mt-4">로그인 홈</a>
    </v-sheet>
    
    <notifications
      position="center"
    />

  </v-container>
</template>
<script>
import privacy from '../assets/privacy.js';
import policy from '../assets/policy.js';
export default {
  name: 'vazilDialog',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    color: {
      type: String,
      default: 'primary'
    },
    width: {
      type: String,
      default: '420'
    },
    textFieldVariant: {
      type: String,
      default: 'outlined'
    },
    textFieldSingleLine: {
      type: Boolean,
      default: true
    },
  },
  data: function(){
    return {
      signupFormValid: false,
      emailFirstError: false,
      privacy: privacy,
      policy: policy,
      agreementExpandItem: '',
      loadingAuth: false,
      check_all:false,
      check_fourteen:false,
      check_privacy:false,
      check_policy:false,
      validEmailAddress:'',
      email:'',
      password:'',
      loginLockCount: 5,
      loginLockTime: 1000*60*10, // 10분
      captchaImgSrc: '',
      captchaText: '',
      captchaInputValue: '',
      textFieldOptions: {
        color: this.color,
      },
      loginAttrs: {
        rounded:false,
        autofocus:true,
      },
      signupAttrs: {
        rounded:false,
        autofocus:true,
        variant: 'outlined',
        density: 'compact',
        singleLine: true,
        lass: 'my-2',
        hideDetails: true,
      },
      rulesOn: false,
      // rules: {
      //   emailRequired: value => !!value || '이메일을 입력해주세요.',
      //   passwordRequired: value => !!value || '비밀번호를 입력해주세요.',
      //   email: value => {
      //     return this.$regular.emailPattern(value) || '올바른 이메일을 입력해주세요.'
      //   },
      //   password: value => {
      //     return this.$regular.passwordEasy(value) || '영문·숫자·특수문자(!@$%^&*)를 조합하여 9~20자 이내로 입력해주세요.'
      //   },
        
      //   passwordOk:value=>{
      //     return value === this.signupPassword || '비밀번호가 일치하지 않습니다.'
      //   },
      //   name:value=>{
      //     return this.$regular.koEnOnly(value) || '한글, 영문만 입력해주세요.'
      //   },
      //   number:value => {
      //     return this.$regular.number(value) || '숫자 입력해주세요.'
      //   }
      // },
      loginActive:true,
      signupEmailFront:'',
      signupEmailBackSelect:'선택해주세요.',
      signupEmailBack:'',
      signupPassword:'',
      signupPasswordconfirm:'',
      userName:'',
      JoinActive:false,
      joinIndex: 1,
      validActive:false,
      findPWActive: false,
      validType: '',
    }
  },
  watch:{
    emailFirstError(val){
      console.log('emailFirstError : ', val)
    },
    signupFormValid(val){
      console.log('signupFormValid : ', val)
    }
    // signupEmailBack(val) {
    //   console.log('back value : ', val)
    // },
    // signupEmailBackSelect(val) {
    //   console.log('select value : ', val)
    // }
  },
  computed: {
    fullAgreement() {
      return this.check_fourteen && this.check_privacy && this.check_policy
    },
    signupEmail() {
      return this.signupEmailFront + '@' + this.signupEmailBack
    }
  },
  methods:{
    test(e){
      console.log('select changed : ', e)
      
      // e === '직접 입력' ? signupEmailBack = '' : signupEmailBack = e
    },
    clickFullAgreement() {
      if(this.fullAgreement) {
        this.check_fourteen = false
        this.check_privacy = false
        this.check_policy = false
      } else {
        this.check_fourteen = true
        this.check_privacy = true
        this.check_policy = true
      }
    },
    retryEmailSend(email) {
      this.loadingAuth = true
      this.$axios.post('/auth/validate/email/' + email)
      .then(()=>{
        this.$snotify.success('인증 메일을 성공적으로 전송하였습니다.')
      })
      .catch(()=>{
        this.$snotify.error('인증 메일 전송에 실패하였습니다.')
      })
      .finally(()=>{
        this.loadingAuth = false
      })
    },
    // Google 로그인 구현
    googleOAuth2Login(){
      this.$auth.loginWith('google')
      .then((res) => {
        console.log('google' + res);
      })
      .catch(err=>{
        console.log(err)
      })
    },
    // Naver 로그인 구현
    async naverOAuth2Login(){
      console.log('naver login')
      // const naverLogin = new naver.LoginWithNaverId({
      //   clientId: '41uHpiQYu16IEowvEEQy',
      //   callbackUrl: `${window.location.origin}`,
      //   isPopup: true,
      //   callbackHandle: true
      // });
      // naverLogin.init();
      

      // await naverLogin.getLoginStatus((status)=>{
      //   if(status){
      //       const token = naverLogin.accessToken.accessToken
      //       const url = '/auth/naver-login'
      //       this.$axios.post(url, {
      //         token : token
      //       })
      //       .then((res) => {
      //         this.$store.state.auth.user = res.data
      //         let existence = false
      //         if(this.$store.state.auth.user.body.organizations.length > 0){
      //           existence = true            
      //         }
      //         if(existence === true){
      //           this.$auth.$storage.setUniversal('_token.local', res.data.body.accessToken)
      //           this.$auth.$storage.setUniversal('_refresh_token.local', res.data.body.refreshToken)

      //           if(this.$auth.user.body.email !== naverLogin.user.email){
      //             this.$store.commit('setOrganizationId', this.$auth.$state.user.body.organizations[0].orgId)
      //             this.$axios.defaults.headers.common['orgId'] = this.$auth.$state.user.body.organizations[0].orgId
      //           }else{
      //             if(this.$store.state.keepOrganizationId !== null){
      //               this.$store.commit('setOrganizationId', this.$store.state.keepOrganizationId)
      //               this.$axios.defaults.headers.common['orgId'] = this.$store.state.keepOrganizationId
      //             }else{
      //               this.$store.commit('setOrganizationId', this.$auth.$state.user.body.organizations[0].orgId)
      //               this.$axios.defaults.headers.common['orgId'] = this.$auth.$state.user.body.organizations[0].orgId
      //             }
      //           }
      //         }
      //         this.$store.state.auth.loggedIn = true
      //         this.$store.state.loginDialog = false
      //       })
      //       .catch((err) => {
      //         console.log(err)
      //       })
      //   }else{
      //       naverLogin.reprompt();
      //       return 
      //     }
      //   })
    },
    
    //로그인 구현
    async userLogin() {
      let userData={
        username:this.email,
        password:this.password
      }
      
      this.rulesOn = true;
      
      
      // 입력값이 올바르지 않을경우 
      if(this.email.length < 1){
        document.getElementById('loginInput1').focus()
        return 
      }else if(!this.$regular.emailPattern(this.email)){
        console.log('이메일 형식 오류')
        document.getElementById('loginInput1').focus()
        return
      } else if(this.password.length < 1) {
        document.getElementById('loginInput2').focus()
        return
      }      
      
      if(this.$store.state.loginLockStatus.captchaActive && !this.checkCaptcha()){
        return
      }

      this.loadingAuth = true
      // else if(this.$regular.passwordEasy(this.password)){
      //   return
      // }

      if(userData.username !== 'se5nghee@naver.com' || userData.password !== 'aa'){
        this.updateLoginLockStatus()
      } else {
        this.$store.commit('setLoginLockStatus', {captchaActive: false, latestLoginTryDate: '', loginFailCount: 0})
      }

      // try {
      //   await this.$auth.loginWith('local', { data: userData })
      //   .then((res) => {
      //     //this.$cookiz.set('auth._refresh_token.local', res.data.refreshToken)
      //       this.$auth.$storage.setUniversal('_refresh_token.local', res.data.refreshToken)
      //       this.$store.commit('setLoginLockStatus', {captchaActive: false, latestLoginTryDate: '', loginFailCount: 0})
            
      //       let existence = false
      //       if(this.$auth.$state.user.body.organizations.length > 0){
      //         existence = true            
      //       }

      //       if(existence === true){
      //         if(this.$auth.user.body.email !== this.email){
      //           this.$store.commit('setOrganizationId', this.$auth.$state.user.body.organizations[0].orgId)
      //           this.$axios.defaults.headers.common['orgId'] = this.$auth.$state.user.body.organizations[0].orgId
      //         }else{
      //           if(this.$store.state.keepOrganizationId !== null){
      //             this.$store.commit('setOrganizationId', this.$store.state.keepOrganizationId)
      //             this.$axios.defaults.headers.common['orgId'] = this.$store.state.keepOrganizationId
      //           }else{
      //             this.$store.commit('setOrganizationId', this.$auth.$state.user.body.organizations[0].orgId)
      //             this.$axios.defaults.headers.common['orgId'] = this.$auth.$state.user.body.organizations[0].orgId
      //           }
      //         }
      //       }
      //     this.$store.state.loginDialog = false
      //   }).catch((e) => {
          
      //     let errorCode = e.response.data.body !== null && e.response.data.body ? e.response.data.body.code : ''
      //     //이메일 미인증
      //     if(errorCode && errorCode === 'A005') {
      //       this.validType='signup'
      //       this.validActiveAction(this.email)
      //     } else {
      //       this.updateLoginLockStatus()
      //       alert("아이디와 비밀번호를 확인하세요.")
      //       document.getElementById('loginInput1').focus()
      //     }
      //   })
      // } catch (err){
      //   console.log(err)
      //   this.loadingAuth = false
      // }
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
        alert("자동 입력 방지 문자를 잘못 입력했습니다.")
        this.generateCaptcha()
        this.captchaInputValue = ''
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
    
    //회원가입 구현
    async signupLogin(){      
      
      this.rulesOn = true;
      
      // 입력값 확인
      if(this.userName.length < 1){
        this.$snotify.error('이름을 입력하세요.')
        document.getElementById('signupInput1').focus()
        return 
      }else if(!this.$regular.koEnOnly(this.userName)){
        this.$snotify.error('한글, 영문만 입력해주세요.')
        document.getElementById('signupInput1').focus()
        return
      }
      else if(this.signupEmail.length < 1 || !this.$regular.emailPattern(this.signupEmail)){
        this.$snotify.error('이메일을 올바르게 입력하세요.')
        document.getElementById('signupInput2').focus()
        return 
      }else if(!this.$regular.passwordEasy(this.signupPassword)){
        this.$snotify.error('영문·숫자를 포함하여 6~20자 이내로 입력해주세요.')
        document.getElementById('signupInput3').focus()
        return 
      }else if(this.signupPassword.length < 1 || this.signupPasswordconfirm.length ===0){
        this.$snotify.error('비밀번호를 입력하세요.')
        document.getElementById('signupInput3').focus()
        return 
      }else if(this.signupPassword !== this.signupPasswordconfirm){
        this.$snotify.error('비밀번호가 일치하지 않습니다.')
        this.signupPasswordconfirm = '';
        document.getElementById('signupInput3').focus()
        return 
      }

      // if(!this.checkCaptcha()){
      //   return
      // }

      this.loadingAuth = true

      // let emailDuplicated = await this.checkEmailDuplicated()
      // if(!emailDuplicated) {
      //   this.loadingAuth = false
      //   return
      // }


      // let signUpData = {
      //   email : this.signupEmail,
      //   password:this.signupPassword,
      //   username:this.userName
      // }

      // await this.$axios.post('auth/signup', signUpData)
      // .then(()=>{
      //   this.$snotify.success('회원가입 완료')
      //   this.validType = 'signup'
      //   this.validActiveAction(this.signupEmail)
        
      // }) 
      // .catch((err)=>{
      //   console.log(err)
      // })
      this.loadingAuth = false

    },
    //이메일 중복 확인
    async checkEmailDuplicated(){
      if(!this.$regular.emailPattern(this.signupEmail)){
        this.$snotify.error('이메일을 올바르게 입력하세요')
        return false
      }

      if(this.signupEmail === '' ){
        this.$snotify.error('이메일을 입력하세요')
        return false
      }
      let result = false
      await this.$axios.get('auth/user/email-validation/'+ this.signupEmail)
      .then((res) => {
        result = res.data.body === 'OK'
      })
      .catch((err)=>{
        console.log(err)
      })

      if(result){
        return true;
      }else{
        this.$snotify.error('이미 사용중인 이메일입니다.')
        this.signupEmail = '';
        return false;
      }
    },
    // 비밀번호 찾기 구현
    async findPW(){
      
      this.rulesOn = true;
      
      if(this.email.length < 1 || !this.$regular.emailPattern(this.email)){
        this.$snotify.error('이메일을 올바르게 입력하세요.')
        return 
      }
      const email = {
        to:this.email,
        subject: '[VRIDGE] 비밀번호를 재설정 해주세요.',
        // contents: this.generateResetPwdTemplate()
      }

      this.loadingAuth = true
      await this.$axios.post('auth/mail', email)
      .then(() => {
        this.validType = 'findPW'
        this.validActiveAction(this.email)
      })
      .catch(e=>{
        let errorCode = e.response.data !== null && e.response.data ? e.response.data.error : ''
        //이메일 미인증
        if(errorCode && errorCode === 'A007') {
          alert('존재하지 않는 이메일 주소입니다.')
        } else {
          alert(this.$t('setting_error_has_occurred_server'))
        }
      })
      this.loadingAuth = false
    },

    generateResetPwdTemplate() {
      // const bcrypt = require('bcrypt-nodejs')
      // let salt = bcrypt.genSaltSync(10);
      // let secretKey = bcrypt.hashSync('vazil', salt)
      
      // let key = secretKey + ',' + this.email + ',' + new Date().toISOString()
      // key = window.btoa(key)
      // const resetUrl = window.location.protocol + "//" + window.location.host + '/login/reset/' + key
      // return "<p>비밀번호 초기화를 위해 아래 버튼을 눌러 변경 절차를 완료해 주세요.</p>"
      //       + "<br/>"
      //       + "<p style='margin-bottom: 20px;'>감사합니다.</p>"
      //       + "<br/>"
      //       + "<br/>"
      //       + "<div style='width:100%; margin:0 auto; text-align: center'>"
      //       + "    <div style='font-size:16px; margin:0 auto; border-radius: 5px; padding: 10px 20px 10px 20px; background-color: #2e67af; display: inline-block;'>"
      //       + "        <a target='_blank' href='"+ resetUrl +"' style='cursor:pointer; color:white; text-decoration: none; font-weight: bold;'>"
      //       + "            비밀번호 변경하기"
      //       + "        </a>"
      //       + "    </div>"
      //       + "    <div style='color:#999; font-size:12px; margin-top:12px;'>※ 해당 링크는 2시간동안 유효합니다.</div>"
      //       + "</div>"
    },
    // 회원가입 팝업창 활성화
    joinActiveAction(){
      this.signupEmailFront ='',
      this.signupEmailBack ='',
      this.signupPassword='',    
      this.signupPasswordconfirm = '',
      this.userName=''
      this.rulesOn = false
      this.captchaInputValue = ''

      this.joinIndex = 0
      this.check_fourteen = false
      this.check_privacy = false
      this.check_policy = false
      
      setTimeout(() => {
        this.loginActive = false
      }, 100);
      setTimeout(() => {
        this.JoinActive = true
        this.validActive = false
      }, 200);

    },

    // 로그인 팝업창 활성화
    loginActiveAction(){
      this.email = '';
      this.password = '';
      this.rulesOn = false
      this.captchaInputValue = ''
      
      setTimeout(() => {
        this.JoinActive = false
        this.findPWActive = false
      }, 100);
      setTimeout(() => {
        this.loginActive = true
        this.validActive = false
      }, 200);
    },

    // 검증 팝업창 활성화
    validActiveAction(email){
      this.validEmailAddress = email
      this.email = '';
      this.password = '';
      setTimeout(() => {
        this.loginActive = false
        this.JoinActive = false
        this.findPWActive = false
      }, 100);
      setTimeout(() => {
        
        this.validActive = true
      }, 200);
    },
    
    // 비밀번호 찾기 팝업창 활성화
    findPWActiveAction(){
      this.email = '';
      setTimeout(() => {
        this.loginActive = false
      }, 100);
      setTimeout(() => {
        this.findPWActive = true
      }, 200);
    },

    openPage(url) {
      let route = this.$router.resolve({path: url});
      window.open(route.href, '_blank');
    },

  },
  created(){
    setTimeout(() => {
      // this.loginActive = true
      this.loginActive = false
      this.JoinActive = true
    
    }, 100);
  },
  mounted(){
    this.checkLoginLockStatus()
    this.generateCaptcha()
    // this.$notify({
    //   position: 'top center'
    // })
  },
}
</script>

<style lang="scss">
.login-container {
  // position: relative;
  // height:100%;
  // max-height: 100vh;
  // width:100%;
  // margin:0 auto !important;
  // padding:0 !important;
  // background-color: #fff;
}

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
  background-color: #fff;
  
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
        .v-text-field:nth-child(1) .v-field { // 이메일
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
        
        .v-text-field:nth-child(2) { // 비밀번호
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
          
          img {
            width: 36px;
            height: 36px;
          } 
        }
      }
    }
    
    &.signup-sheet {
      .signup-form {
        .v-text-field {
          margin-bottom: 24px;
          
          .v-input__append {
            color: green;
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
        
        .error-msg {
          color: rgba(var(--v-theme-error), 1);
          font-size: 0.9rem;
          padding-left: 16px;
          margin-bottom: 8px;
          display: inline-block;
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