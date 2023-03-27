<template>
  <v-app class="my-layout-container">
    
    <!-- header -->
    <v-app-bar flat :height="headerHeight" :class="xs ? 'mobile' : ''">
      <!-- logo -->
      <v-img
        v-if="xs || lgAndUp"
        :src="require('@/assets/' + (theme.global.name.value === 'dark' ? darkThemeLogo : lightThemeLogo))"
        :width="logoWidth"
        :maxWidth="logoWidth"
      />

      <!-- nav active btn -->
      <template v-slot:prepend v-if="mdAndDown">
        <v-app-bar-nav-icon class="mr-4" @click="navDrawer = !navDrawer"></v-app-bar-nav-icon>
      </template>
      
      <template v-slot:append v-if="xs">
        <v-btn @click="headerMenuOn = !headerMenuOn" icon="mdi-dots-vertical" class="header-menu-btn"></v-btn>
      </template>
      
      <!-- header items -->
      <div
        v-show="headerMenuOn"
        class="header-menus"
        v-click-outside="{handler: onClickOutsideHeaderMenu, include: getHeaderMenuBtn}"
      >
        <slot
          name="headerItems"
          v-bind="{btnOptions: headerItemOptions}"
        />

        <!-- 테마(light/dark) -->
        <HeaderItem
          v-if="headerActiveList.indexOf('theme') > -1"
          icon="mdi-theme-light-dark"
          @onClick="theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'"
        />
        
        <!-- 언어 -->
        <HeaderItem
          v-if="headerActiveList.indexOf('locale') > -1"
          icon="mdi-web"
        >
          <template #expandContent>
            <v-list class="locale-content">
              <v-list-item
                v-for="(item, index) in localeList" :key="index"
                @click="changeLocale"
              >
                <span>{{item.text}}</span>
              </v-list-item>
            </v-list>
          </template>
        </HeaderItem>

        <!-- 알림 -->
        <HeaderItem
          v-if="headerActiveList.indexOf('notice') > -1"
        >
          <template #activeBtn>
            <v-badge
              :model-value="unreadNotice.length > 0"
              :content="unreadNotice.length"
              max="99"
              color="primary"
            >
              <v-icon :color="headerActiveItem === 'notice' ? 'primary':''">
                mdi-bell{{headerActiveItem !== 'notice' ? '-outline' : ''}}
              </v-icon>
            </v-badge>
          </template>
          
          <template #expandContent>
            <div class="notice-content">
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
                      <template v-slot:append v-if="!xs">
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
          </template>
        </HeaderItem>
        
        <!-- 사용자 프로필 -->
        <HeaderItem
          v-if="headerActiveList.indexOf('profile') > -1"
          icon="mdi-account"
        >
          <template #expandContent>
            <v-row no-gutters class="ma-2 pa-4 profile-content" align="center" style="cursor:pointer;">
              <v-col cols="3">
                <img v-if="userAvatar !== ''" :src="require('@/assets/' + userAvatar)" height="28" class="mr-2"/>
              </v-col>
              <v-col cols="9">
                <p class="ma-0">{{userName}}</p>
                <p class="ma-0">{{userEmail}}</p>
              </v-col>
            </v-row>
          </template>
        </HeaderItem>
      </div>
    </v-app-bar>
    
    <!-- nav -->
    <v-navigation-drawer
      app
      :rail="rail"
      rail-width="50"
      v-model="navDrawer"
    >
      <v-row class="nav-container" no-gutters>
        <!-- nav list -->
        <v-col :style="`justify-content: ${navItemPosition}`">
          <v-btn
            v-for="(item, index) in navList"
            :key="index"
            variant="plain"
            :ripple="false"
            class="nav-item"
            :class="selectedNav === item.key ? 'selected' : ''"
            :to="item.to"
            @click="selectNavItem(item)"
          >
            <v-icon>{{item.icon}}</v-icon>
            <span>{{item.title}}</span>
          </v-btn>
          
          <v-btn
            v-show="$slots[`navExpand_${selectedNav}`]"
            variant="plain"
            :ripple="false"
            class="nav-item"
            @click="changeRail"
          >
            <v-icon>mdi-chevron-double-{{rail ? 'right' : 'left'}}</v-icon>
          </v-btn>
        </v-col>
        
        <!-- nav expand area -->
        <v-col class="pa-2" v-if="$slots[`navExpand_${selectedNav}`]">
          <slot :name="`navExpand_${selectedNav}`" />
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-main class="my-layout-main">
      <v-container style="max-width: 100%;">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, defineProps, useSlots} from 'vue'
import {useTheme, useDisplay} from "vuetify"
import HeaderItem from './VazilLayout/HeaderItem.vue'

const theme = useTheme()
const slots = useSlots()
const {xs, mdAndDown, lgAndUp} = useDisplay()

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
  navItemPosition: {
    type:String,
    default: 'start'
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


// header
const headerMenuOn = ref(!xs.value)
const headerItemOptions = ref({
  icon: true,
  ripple: false,
  size: 24,
  class: "mx-2"
})
const headerActiveItem = ref(null)
const noticeLoading = ref(false)
const unreadNotice = ref([
  {
    type: 'INFO',
    message: 'Joy 님에 의해 00 프로젝트로 초대되었습니다.',
    createdAt: '2023-03-01'
  },
  {
    type: 'INFO',
    message: 'Joy 님에 의해 00 프로젝트로 초대되었습니다.',
    createdAt: '2023-03-01'
  },
  {
    type: 'INFO',
    message: 'Joy 님에 의해 00 프로젝트로 초대되었습니다.',
    createdAt: '2023-03-01'
  },
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

const onClickOutsideHeaderMenu = () => {
  if(xs.value) headerMenuOn.value = false
}
const getHeaderMenuBtn = () => {
  return [document.querySelector('.header-menu-btn')]
}
const changeLocale = () => {
  console.log('change locale : not yet implemented')
}



// navigation
const navDrawer = ref(true)
const rail = ref(true)
const selectedNav = ref('home')

const selectNavItem = (item) => {
  selectedNav.value = item.key
  
  if(slots[`navExpand_${selectedNav.value}`]){
    rail.value = false
  } else {
    rail.value = true
  }
}

const changeRail = () => {
  rail.value = !rail.value
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
    
    &:deep(.v-toolbar__prepend), &:deep(.v-toolbar__append) {
      margin: 0;
      position: absolute;

      button {
        width: 24px;
        height: 24px;
      }
    }
    
    &:deep(.v-toolbar__prepend) {
      left: 0;
    }
    
    &:deep(.v-toolbar__append) {
      right: 0;
    }

    .header-menus {
      display: flex;
      position: absolute;
      right: 0;
      
      .locale-content {
        min-width: 140px;
        width: 140px !important;

        &:deep(.v-list-item) {
          text-align: center;
        }
      }
      
      .notice-content {
        width: 380px !important;
        max-width: 100%;
        max-height: 400px;
        
        .v-list {
          max-height: 260px;
          overflow: auto;
          
          .v-list-item {
            padding: 10px;  
            
            &:hover {
              background-color: rgba(var(--v-theme-primary), 0.3);
            }
          }
          
          &:deep(.v-icon) {
            opacity: 1;
          }
          
          &:deep(.v-list-item-subtitle){
            opacity: 1;
            line-height: 1.2rem;
          }
        }
      }
        
      .profile-content {
        width: 300px;
        max-width: 100%;

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

    &.mobile {
      &:deep(.v-toolbar__content) {
        justify-content: center;
      }

      .header-menus {
        background-color: rgba(var(--v-theme-surface), 1);
        border-radius: 10px;
        right: -6px;
        flex-direction: column;
        top: 50px;
        
        &:deep(> button), &:deep(> div) {
          margin: 8px 0;
        }
      }
    }
  }


  // navigation
  &:deep(.v-navigation-drawer) {
    padding-top: 8px;
    
    .nav-container {
      height: 100%;
      flex-wrap: nowrap;
      
      .v-col {
        height: 100%;
        overflow: hidden;
      }
      
      .v-col:first-child {
        min-width: 50px;
        max-width: 50px;
        padding: 0;
        border-right: 1px solid rgba(128, 128, 128, 0.3);
        display: flex;
        flex-direction: column;
        
        .nav-item {
          padding: 0;
          min-width: 50px;
          height: 50px;
          opacity: 1;
          border-radius: 0;
          
          .v-icon {
            padding-bottom: 12px;
            font-size: 20px;
          }
          
          .v-btn__content span {
            position: absolute;
            bottom: 6px;
            font-size: 0.75rem;
            color: grey;
          }
          
          &:hover, &:hover span {
            color: rgba(var(--v-theme-primary), 1);
          }
          
          &.selected {
            background-color: rgba(var(--v-theme-primary), 0.3);
          }
          
          &:last-child {
            position: absolute;
            bottom: 0px;
            left: 0px;
          }
        }
      }
      
      .v-col:nth-child(2) {
        min-width: 205px;
        max-width: 205px;
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
