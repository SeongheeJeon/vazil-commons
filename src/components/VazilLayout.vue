<template>
  <v-app class="my-layout-container"> 
    <!-- 헤더 -->
    <v-app-bar flat :height="headerHeight" >
      <v-img
        :src="require('@/assets/' + (theme.global.name.value === 'dark' ? darkThemeLogo : lightThemeLogo))"
        :width="logoWidth"
        :maxWidth="logoWidth"
      />
      <v-spacer></v-spacer>

      <slot name="headerItem" :btnOptions="headerItemOptions"/>

      <!-- 테마(light/dark) -->
      <v-btn
        v-if="headerActiveList.indexOf('theme') > -1"
        v-bind="headerItemOptions"
        @click="theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'"
      >
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <!-- 언어 -->
      <div
        v-if="headerActiveList.indexOf('locale') > -1"
        class="locale-wrap"
        v-click-outside="onClickOutsideLocale"
      >
        <v-btn
          v-bind="headerItemOptions"
          @click="localeActive = !localeActive"
        >
          <v-icon :color="localeActive ? 'primary':''">mdi-web</v-icon>
        </v-btn>

        <v-slide-y-transition origin="top right 0">
          <v-card
            v-if="localeActive"
            class="mx-0 pa-0 locale-content"
          >
            <v-list>
              <v-list-item
                v-for="(item, index) in localeList" :key="index"
                @click="changeLocale"
              >
                <span>{{item.text}}</span>
              </v-list-item>
            </v-list>
          </v-card>
        </v-slide-y-transition>
      </div>
      
      <!-- 알림 -->
      <div
        v-if="headerActiveList.indexOf('notice') > -1"
        class="notice-wrap"
        v-click-outside="onClickOutsideNotice"
      >
        <!-- activator -->
        <v-btn
          v-bind="headerItemOptions"
          @click="noticeActive = !noticeActive"
          stacked
        >
          <v-badge
            :model-value="unreadNotice.length > 0"
            :content="unreadNotice.length"
            max="99"
            color="primary"
          >
            <v-icon :color="noticeActive ? 'primary':''">
              mdi-bell{{!noticeActive ? '-outline' : ''}}
            </v-icon>
          </v-badge>
          
          <v-tooltip
            activator="parent"
            location="bottom"
            text="알림"
          />
        </v-btn>

        <!-- 알림 패널 -->
        <v-slide-y-transition origin="top right 0">
          <v-card
            v-if="noticeActive"
            class="mx-0 pa-0 notice-content"
            
          >
            <!-- 커스텀 패널 -->
            <div v-if="$slots.notificationPannel">
              <slot name="notificationPannel" />
            </div>

            <!-- 기본 패널 -->
            <div v-else>
              <v-card-title class="d-flex align-center">
                <span>알림</span> 
                <v-spacer></v-spacer>
                <v-btn
                  size="x-small"
                  plain
                  text
                  :disabled="unreadNotice.length === 0"
                  :ripple="false"
                >
                  모두 읽음
                </v-btn>
              </v-card-title>
              <v-divider/>
              <v-card-text>
                <v-row v-if="noticeLoading" no-gutters style="height:100%;" justify="center" align="center">
                  <v-progress-circular indeterminate/>
                </v-row>

                <v-row v-else no-gutters style="height:100% !important;">
                  <v-list v-if="unreadNotice && unreadNotice.length > 0" style="width: 100%;" lines="2">
                    <v-list-item
                      v-for="(item, i) in unreadNotice"
                      :key="i"
                      :ripple="false"
                      :inactive="true"
                      :prepend-icon="item.type === 'WARNING' ? 'mdi-message-alert-outline' : 'mdi-message-processing-outline'"
                      :subtitle="item.message"
                    >
                      <!-- <template v-slot:title>
                        <span>{{item.message}}</span>
                      </template> -->
                      
                      <template v-slot:append>
                        <span class="text-caption">{{$utils.getTimeFromNow(item.createdAt)}}</span>
                      </template>
                    </v-list-item>
                  </v-list>
                  <v-col v-else cols="12" no-gutters align="center" justify="center" class="d-flex justify-center align-center">
                    <div>
                      <v-icon style="opacity:0.7;" large class="mb-4">mdi-alert-circle-outline</v-icon>
                      <br/>
                      <div>새로운 알림이 없습니다.</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn block small text :ripple="false" style="text-transform: none" @click="goAlertPage()">전체 보기</v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-slide-y-transition>
      </div>
      
      <!-- 사용자 프로필 -->
      <div
        v-if="headerActiveList.indexOf('profile') > -1"
        class="profile-wrap"
        v-click-outside="onClickOutsideProfile"
      >
        <!-- activator -->
        <v-btn
          v-bind="headerItemOptions"
          @click="profileActive = !profileActive"
        >
          <v-icon :color="profileActive ? 'primary':''">mdi-account</v-icon>
        </v-btn>

        <!-- 사용자 프로필 패널 -->
        <v-slide-y-transition origin="top right 0">
          <v-card
            v-if="profileActive"
            class="mx-0 pa-0 profile-content"
          >
            <!-- 커스텀 패널 -->
            <div v-if="$slots.profilePannel">
              <slot name="profilePannel" />
            </div>

            <!-- 기본 패널 -->
            <div v-else>
              <v-row no-gutters class="ma-2 pa-4 user-info" align="center" style="cursor:pointer;">
                <v-col cols="3">
                  <img v-if="userAvatar !== ''" :src="require('@/assets/' + userAvatar)" height="28" class="mr-2"/>
                </v-col>
                <v-col cols="9">
                  <p class="ma-0">{{userName}}</p>
                  <p class="ma-0">{{userEmail}}</p>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-slide-y-transition>
      </div>
    </v-app-bar>
    
    <!-- nav -->
    <v-navigation-drawer
      app
      expand-on-hover
      rail
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in navList"
          :key="i"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
        />
        <v-list-item
          @click="exitDashboard"
          prepend-icon="mdi-logout"
          title="Exit"
        />
      </v-list>
    </v-navigation-drawer>

    
    <v-main class="my-layout-main">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, defineProps, onMounted} from 'vue'
import {useTheme} from "vuetify"
const theme = useTheme()

// data
const headerItemOptions = ref({
  icon: true,
  ripple: false,
  size: 24,
  class: "mx-2"
})
const noticeActive = ref(false)
const noticeLoading = ref(false)
const profileActive = ref(false)
const unreadNotice = ref([
  {
    type: 'INFO',
    message: 'Joy 님에 의해 00 프로젝트로 초대되었습니다.',
    createdAt: '2023-03-01'
  },
  {
    type: 'INFO',
    message: '학습이 완료되었습니다.',
    createdAt: '2023-03-03'
  },
])
const localeActive = ref(false)
const localeList = ref([
  {
    value: 'ko',
    text: '한국어',
  },
  {
    value: 'en',
    text: 'English',
  },
])


// props
defineProps({
  headerHeight:{
    type:[String, Number],
    default: 40,
  },
  logoWidth:{
    type:[String, Number],
    default: '120',
  },
  darkThemeLogo:{
    type:String,
    required: true
  },
  lightThemeLogo:{
    type:String,
    required: true
  },
  headerActiveList:{
    type:Array,
    default: () => (['theme', 'notice', 'profile']),
  },
  userAvatar:{
    type:String,
    default: ''
  },
  userName:{
    type:String,
    default: '이름'
  },
  userEmail:{
    type:String,
    default: '이메일'
  },
  navList:{
    type:Array,
    default: () => [{
      icon: 'mdi-home-outline',
      title: 'Welcome',
      to: '/',
    },{
      icon: 'mdi-cog-outline',
      title: 'Settings',
      to: '/settings',
    }],
  },
})


// mounted
onMounted(() => {
  // console.log('darkThemeLogo : ', props.darkThemeLogo)
})


// events
const onClickOutsideNotice = () => {
  noticeActive.value = false
}
const onClickOutsideProfile = () => {
  profileActive.value = false
}
const onClickOutsideLocale = () => {
  localeActive.value = false
}

const changeLocale = () => {
  console.log('change locale : not yet implemented')
}

const exitDashboard = () => {
  console.log('exit dashboard : not yet implemented')
}

</script>

<style lang="scss" scoped>
.my-layout-container{
  font-size: 14px !important;
  overflow: auto !important;

  // header
  .v-app-bar {
    overflow: visible;
    padding: 4px 16px;
    
    .locale-wrap {
      position: relative;

      .locale-content {
        min-width: 140px;
        width: 140px !important;
        position: absolute;
        right: 50%;
        transform: translateX(50%);
        border-radius: 10px !important;
        margin-top: 16px;

        .v-list-item {
          text-align: center;
        }
      }
    }
    
    .notice-wrap {
      position: relative;

      .notice-content {
        min-width: 380px;
        width: 380px !important;
        position: absolute;
        right: 0px;
        border-radius: 10px !important;
        margin-top: 16px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 20px 30px !important;

        .v-card__text {
          height: 320px;
          overflow-y: auto;
        }

        .v-list {
          height: 100%;
          
          &:deep(.v-icon) {
            opacity: 1;
          }
          
          &:deep(.v-list-item-subtitle){
            opacity: 1;
            line-height: 1.2rem;
          }
        }
      }
    }

    .profile-wrap {
      .profile-content {
        position: absolute;
        margin-top: 16px;
        right: 0px;
        border-radius: 10px !important;
        width: 300px;
        min-width: 300px !important;

        .user-info {
          div:first-child {
            text-align: center;
          }

          div:last-child {
            p:nth-child(1) {
              font-size: 1.1rem;
              font-weight: 600;
            }

            p:nth-child(2) {
              font-size: 0.9rem;
              opacity: 0.8 !important;
            }
          }
        }
      }
    }
  }


  // navigation
  .v-navigation-drawer {
    .v-list{
      height: 100%;
      
      &:deep(.v-list-item:last-child) {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
      
      &:deep(.v-list-item__prepend) .v-icon {
        opacity: 1 !important;
      }
    }
  }


  // 테마별 색상
  &.v-theme--light {
    .v-app-bar {
      border-bottom: 1px #e9e9e9 solid;
    }

    .my-layout-main {
      background-color: #e9e9e9;
    }
  }

  &.v-theme--dark {
    .v-app-bar {
      background-color: #272727;
      border-bottom: 1px #444444 solid;
    }
    
    .v-navigation-drawer {
      background-color: #272727;
    }
    .my-layout-main {
      background-color: #444444 !important;
    }
  }
}
</style>
