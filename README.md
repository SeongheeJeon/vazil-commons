# vazil-commons

Vazil Company UI 공용 컴포넌트 라이브러리


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [License](#license)


## Installation

``` bash
npm install vazil-commons
```


## Usage


### Global


### Local



### Props

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


### Events


### Slots

| Name                              | Description                                                                                                                                                                                                                                                                           |
|:----------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| headerItem                        | add header custom menu 
| navExpand_${navList item's key}   | nav 확장 패널



## Development

To begin development, run:

``` bash
npm install
npm run dev
```

## License

