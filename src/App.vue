<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style style lang="scss">
//@import './css/common.scss';
#app {
  font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  /* margin-top: 60px; */
  
}
.el-tooltip__popper{
    max-width: 800px;
  }
body{
  padding: 0;
  min-height: 100vh;
}

// @font-face {
//   font-family: 'icomoon';
//   src:  url('../static/fonts/icomoon.eot?i0kctx');
//   src:  url('../static/fonts/icomoon.eot?i0kctx#iefix') format('embedded-opentype'),
//   url('../static/fonts/icomoon.ttf?i0kctx') format('truetype'),
//   url('../static/fonts/icomoon.woff?i0kctx') format('woff'),
//   url('../static/fonts/icomoon.svg?i0kctx#icomoon') format('svg');
//   font-weight: normal;
//   font-style: normal;
// }

</style>
