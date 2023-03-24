<template>
  <VazilLayout
    v-bind="props"
  >
    <!-- <template #headerItem="props">
      <v-btn
        v-bind="props.btnOptions"
      >
        <v-icon>mdi-help</v-icon>
      </v-btn>
    </template>  -->
    
    <template #navExpand_home>
      <div>home nav expand</div>
    </template> 
    <!-- <template #navExpand_reservation>
      <div>reservation nav expand임</div>
    </template>  -->
    <template #navExpand_settings>
      <div>settings nav expand</div>
    </template> 
  </VazilLayout>
</template>

<script>
import VazilLayout from './components/VazilLayout.vue'

export default {
  components: {
    VazilLayout,
  },
  data: () => ({
    props: {
      darkThemeLogo: "vridge_02.png",
      lightThemeLogo: "vridge_01.png",
      headerActiveList: ['theme', 'locale', 'notice', 'profile'],
      navItemPosition: 'center',
      navList: [
        {
          key: 'home',
          icon: 'mdi-home-outline',
          title: '홈',
          to: '/',
        },{
          key: 'reservation',
          icon: 'mdi-clock-outline',
          title: '예약',
          to: '/reservation',
          
        },{
          key: 'settings',
          icon: 'mdi-cog-outline',
          title: '설정',
          to: '/settings',
        },
      ],
      // userAvatar: "logo.png",
      userName: '성희',
      userEmail: 'shj@vazilcompany.com',
    }
  })
}
</script>

<style lang="scss">
html {
  font-size: 14px !important;
  overflow: auto !important;
}
</style>
