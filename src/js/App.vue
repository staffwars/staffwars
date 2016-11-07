<template>
  <!-- <div id="app"> -->
    <!-- <hello></hello> -->
    <page></page>
  <!-- </div> -->
</template>

<script>
// import Hello from './components/Hello.vue'
import Page from './components/Page.vue';

export default {
  name: 'app',
  components: {
    // Hello
    Page
  }
};
</script>

<style lang="scss">
@import "../scss/setting/var";
@import "../scss/base/reset";
@import "../scss/base/default";
@import "../scss/utility/is";
@import "../scss/utility/mg";
@import "../scss/utility/txt";
</style>