<template>
  <!-- <div id="app"> -->
    <!-- <hello></hello> -->
    <page></page>
  <!-- </div> -->
</template>

<script>
// import Hello from './components/Hello.vue'
import Page from './components/Page.vue'

export default {
  name: 'app',
  components: {
    // Hello
    Page
  }
}
</script>

<style lang="scss">
@import "../css/setting/var";
@import "../css/base/reset";
@import "../css/base/default";
@import "../css/utility/is";
@import "../css/utility/mg";
@import "../css/utility/txt";
</style>