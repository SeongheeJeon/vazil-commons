# vazil-commons

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
    - [VazilLayout](#vazillayout)


## Installation

- vue3 기반의 프로젝트에서 vuetify(version 3) 활성화, vazil-commons 설치

``` bash
$vue add vuetify
$npm install vazil-commons
```

- main.js
  
``` js 
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VazilCommons from 'vazil-commons'

createApp(App)
  .use(vuetify)
  .use(VazilCommons)
  .mount('#app')
```


## Usage

### VazilLayout

- header와 navigation으로 구성된 기본 레이아웃
- 기본 헤더 항목 : 테마, 언어설정, 알림, 프로필
  - headerActiveList 객체를 props로 전달하여 항목 활성화
  - 커스텀 헤더 항목 추가 가능(HeaderItem 컴포넌트 활용)
- navigation 확장 패널
  - 템플릿으로 전달하며, 템플릿 이름은 navExpand_[navigation의 key]
- vue-router를 활용할 경우, <router-view />를 포함한 기본 템플릿(#default) 작성

  
``` html 
<template>
  <VazilLayout v-bind="props">
    <template #headerItems>
      <HeaderItem icon='mdi-plus'>
        <template #expandContent>
          <div>확장 패널</div>
        </template>
      </HeaderItem>
    </template>

    <template #navExpand_home>
      <div>Home 확장 패널</div>
    </template> 
  
    <template #navExpand_reservation>
      <div>Reservation 확장 패널</div>
    </template>

    <template #default>
      <router-view />
    </template> 
  </VazilLayout>
</template>

<script>
export default {
  name: 'App',
  data() { return {
    props: {
      headerActiveList: ['theme', 'locale', 'notice', 'profile'],
      navList: [
        {
          key: 'home',
          icon: 'mdi-home-outline',
          title: '홈',
          path: '/',
        },{
          key: 'reservation',
          icon: 'mdi-clock-outline',
          title: '예약',
          path: '/reservation',
        }
      ],
      loadedNav: '',
      userName: '홍길동',
      userEmail: 'gildong@gmail.com',
    }
  }},
  watch: {
    $route(to) {
      this.props.loadedNav = to.path
    }
  },
}
</script>


```

- Props

| Property                    | Type    | Default | Description                                                                                                                                                                                                                                                                           |
|:----------------------------|:--------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| clipped                   | Boolean | true   | v-app-bar와 v-navigation clipped 설정
| headerHeight              | String, Number | 50 | 헤더 height
| logoHeight                | String, Number | 60% | 헤더의 로고 height
| darkThemeLogo             | String | /logo/no-image.png | 헤더 로고(dark theme) src
| lightThemeLogo            | String | /logo/no-image.png | 헤더 로고(light theme) src
| headerActiveList          | Array  | ['theme', 'notification', 'profile'] | 헤더 아이템 활성화 리스트
| userAvatarSrc             | String | /logo/no-image.png | 사용자 아바타 src
| userName                  | String | 이름 | 사용자 이름
| userEmail                 | String | 이메일 | 사용자 이메일
| navList                   | Array  | [{key: '', icon: '', title: '', to: ''}] | navigation 항목 리스트


- Events


- Slots

| Name                              | Description                                                                                                                                                                                                                                                                           |
|:----------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| headerItem                        | add header custom menu 
| navExpand_${navList item's key}   | nav 확장 패널


