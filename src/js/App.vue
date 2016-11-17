<!-- template -->
<template>
  <div id="app" class="bg">
    <testModal v-bind:bossInfo="bossInfoFromChild"></testModal>
    <frame @send-from-frame="getBossInfo"></frame>
    <navigation v-bind:bossInfo="bossInfoFromChild"></navigation>
  </div>
</template>
<!-- /template -->

<!-- script -->
<script>
import Frame from './components/Frame.vue';
import Navigation from './components/Navigation.vue';
// import TestModal from './components/TestModal.vue';

export default {
  name: 'app',
  components: {
    Frame,
    Navigation,
    // TestModal,
  },
  data() {
    return {
      bossInfoFromChild: '',
    };
  },
  methods: {
    getBossInfo(value) {
      this.bossInfoFromChild = value;
    },
  },
};
</script>
<!-- /script -->

<!-- style -->
<style lang="scss">
@import "../scss/setting/var";
@import "../scss/setting/sprite";
@import "../scss/base/reset";
@import "../scss/base/default";
@import "../scss/module/bg";
@import "../scss/utility/is";
@import "../scss/utility/mg";
@import "../scss/utility/txt";
</style>
<!-- /style -->