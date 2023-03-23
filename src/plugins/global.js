export default {
  install(Vue) {
    Vue.config.globalProperties.$utils = {
      toLocalDateTimeString(dateString) {
        try{
          if(typeof dateString !== 'string') {
            let date = new Date(dateString[0], (dateString[1] - 1), dateString[2], dateString[3], dateString[4], dateString[5]);
            date.setHours(date.getHours() + 9);
            return date.toISOString().replace('T', ' ').substring(0, 19);
          } else {
            let date = new Date(  dateString);
            date.setHours(date.getHours() + 9);
            return date.toISOString().replace('T', ' ').substring(0, 19);
          }
        }catch{
          return ''
        }
      },
      getTimeFromNow(date) {
        const now = new Date();
        const today = now
        const timeValue = new Date(date);
  
        const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
  
        if (betweenTime < 1) return '방금전';
        if (betweenTime < 60) {
            return `${betweenTime}분전`;
        }
  
        const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}시간전`;
        }
  
        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 365) {
            return `${betweenTimeDay}일전`;
        }
  
        return `${Math.floor(betweenTimeDay / 365)}년전`;
      },
    }
  }
}