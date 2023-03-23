<template>
  <VazilLayout
    v-bind="props"
  >
    <template #headerItem="props">
      <v-btn
        v-bind="props.btnOptions"
      >
        <v-icon>mdi-help</v-icon>
      </v-btn>
    </template> 
  </VazilLayout>
</template>

<script>
import VazilLayout from '../components/VazilLayout.vue'

export default {
  name: 'HomeView',
  components: {
    VazilLayout,
  },
  data: () => ({
    props: {
      darkThemeLogo: "vridge_02.png",
      lightThemeLogo: "vridge_01.png",
      headerActiveList: ['theme', 'locale', 'notice', 'profile'],
      navList: [
        {
          icon: 'mdi-home-outline',
          title: 'Home',
          to: '/',
        },{
          icon: 'mdi-clock-outline',
          title: 'Reservation',
          to: '/reservation',
        },{
          icon: 'mdi-cog-outline',
          title: 'Settings',
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
