<template>
  <VazilLayout
    v-bind="vazilLayoutProps"
    ref="vazilLayout"
    @click-nav-item="clickNavItem"
  >
    <template #headerItems>
      <!-- header item use-case -->
      <HeaderItem  icon='mdi-plus'>
        <template #expandContent>
          <div class="test-content">
            Expand Area
          </div>
        </template>
      </HeaderItem>
    </template>
    
    <template #navExpand_home>
      <div>home nav expand</div>
    </template> 
    <!-- <template #navExpand_reservation>
      <div>reservation nav expand임</div>
    </template>  -->
    <template #navExpand_settings>
      <div>settings nav expand</div>
    </template> 
    
    <template #default>
      <router-view />
    </template> 
  </VazilLayout>
</template>

<script>
import VazilLayout from './components/VazilLayout.vue'
import HeaderItem from './components/VazilLayout/HeaderItem.vue'

export default {
  components: {
    VazilLayout,
    HeaderItem
  },
  data(){ return {
    testActive:true,
    vazilLayoutProps: {
      darkThemeLogo: "vridge_02.png",
      lightThemeLogo: "vridge_01.png",
      headerActiveList: ['theme', 'locale', 'notice', 'profile'],
      navItemPosition: 'center',
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
        },{
          key: 'settings',
          icon: 'mdi-cog-outline',
          title: '설정',
          path: '/settings',
        },
      ],
      loadedNav: '',
      // userAvatar: "logo.png",
      userName: '성희',
      userEmail: 'shj@vazilcompany.com',
    },
  }},
  methods: {
    clickNavItem(navItem) {
      this.$router.push(navItem.path)
    }
  },
  watch: {
    $route(to) {
      this.vazilLayoutProps.loadedNav = to.path
    }
  },
}
</script>

<style lang="scss">
html {
  font-size: 14px !important;
  overflow: auto !important;
}

.test-content {
  width: 100px;
  height: 100px;
  background-color: yellow;
}
</style>
