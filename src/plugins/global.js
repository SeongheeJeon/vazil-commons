export default {
  install(Vue) {
    const utils = {
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
    
    const regular = { // 각 정규표현식의 조건을 충족할 경우 true 반환
      noBlank(data){ // 공백 입력 불가
        let reg = /[\s]/g;
        return !reg.test(data)
      },
      enNumOnly(data){ // 영문, 숫자만
        let reg= /^[A-Za-z0-9\s]+$/g
        return reg.test(data)
      },
      koEnOnly(data){ // 한글, 영문만
        let reg =  /^[ㄱ-ㅎ가-힣a-zA-Z\s]+$/
        return reg.test(data)
      },
      koEnNumOnly(data){ // 한글, 영문, 숫자만
        let reg = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]+$/
        return reg.test(data)
      },
      emailLast(data){ // 이메일 @ 뒷부분 (ex: dd.com)
        let reg = /^[a-z0-9]{1}[a-z0-9-]+[a-z0-9]{1}\.(([a-z]{1}[a-z.]+[a-z]{1})|([a-z]+))$/g
        return reg.test(data)
      },
      passwordEasy(data){ // 영문,숫자 포함하여 6~20자 이내
        let reg= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9@$!%*#?&]{6,20}$/g
        return reg.test(data)
      },
      passwordHard(data){ // 영문,숫자,특수문자(!@$%^&* 만 허용) 포함하여 9~20자 이내
        let reg= /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{9,20}$/g
        return reg.test(data)
      },
      email(data){ // 이메일 형식
        let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return reg.test(data)
      },
      number(data){ // 숫자만
        let reg = /^[0-9]/
        return reg.test(data)
      },
      phone(data) { // 전화번호 형식
        let reg = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/g
        return reg.test(data)
      }
    }
    
    const rule = {
      required: value => !!value || '값을 입력해주세요.',
      noBlank: value => regular.noBlank(value) || '공백은 입력할 수 없습니다.',
      enNumOnly: value => regular.enNumOnly(value) || '영문과 숫자만 입력 가능합니다.',
      koEnOnly: value => regular.koEnOnly(value) || '한글과 영문만 입력 가능합니다.',
      koEnNumOnly: value => regular.koEnNumOnly(value) || '한글, 영문, 숫자만 입력 가능합니다.',
      emailLast: value => regular.emailLast(value) || '이메일 형식이 올바르지 않습니다.',
      passwordEasy: value => regular.passwordEasy(value) || '영문, 숫자를 포함하여 6~20자 이내로 입력해주세요.',
      passwordHard: value => regular.passwordHard(value) || '영문, 숫자, 특수문자를 포함하여 9~20자 이내로 입력해주세요.',
      email: value => regular.email(value) || '이메일 형식이 올바르지 않습니다.',
      number: value => regular.number(value) || '숫자만 입력 가능합니다.',
      phone: value => regular.phone(value) || '전화번호 형식이 올바르지 않습니다.',
    }
    
    const rules = {
      emailFirst: [
        rule.required,
        rule.noBlank,
        rule.enNumOnly,
      ],
      emailLast: [
        rule.required,
        rule.noBlank,
        rule.emailLast,
      ],
      passwordEasy: [
        rule.required,
        rule.noBlank,
        rule.passwordEasy,
      ],
      passwordHard: [
        rule.required,
        rule.noBlank,
        rule.passwordHard,
      ],
      name: [
        rule.required,
        rule.noBlank,
        rule.koEnOnly,
      ],
      nickname: [
        rule.required,
        rule.noBlank,
        rule.koEnNumOnly,
      ],
    }
    
    Vue.config.globalProperties.$utils = utils
    Vue.config.globalProperties.$regular = regular
    Vue.config.globalProperties.$rule = rule
    Vue.config.globalProperties.$rules = rules
  }
}