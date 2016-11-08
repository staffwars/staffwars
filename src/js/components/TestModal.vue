<template>
  <div class="testModal" v-if="isActiveTest">
    <span class="testModal__close" v-on:click="closeClickHandler">×</span>
    <p class="testModal__text">てすとつーる</p>
    <form action="" class="testModal__form" v-on:submit="registerSubmitHandler" v-on:reset="registerResetHandler">
      <select name="code" class="testModal__select" v-model="staffCode" v-bind:value="staffCode">
        <option value="iwata-na">iwata-na</option>
        <option value="kaifuku">kaifuku</option>
        <option value="seki-may">seki-may</option>
        <option value="matsumura-s">matsumura-s</option>
      </select>
      <input type="reset" value="上司待ち解除" class="testModal__reset">
      <input type="submit" value="上司待ち登録" class="testModal__submit">
    </form>
  </div>
</template>

<script>
export default {
  name: 'testModal',
  props: ['isActiveTest', 'bossId'],
  data () {
    return {
      staffCode: 'iwata-na',
    };
  },
  methods: {
    // 上司待ち登録イベント（テスト用）
    registerSubmitHandler (e) {
      e.preventDefault();

      // 上司待ちを登録
      this.registerStaff(this.staffCode);
    },

      // 上司待ち解除イベント（テスト用）
    registerResetHandler (e) {
      e.preventDefault();

      // 上司待ちを解除
      this.unregisterStaff(this.staffCode);
    },

    // 閉じるイベント（テスト用）
    closeClickHandler () {
      this.isActiveTest = false;
    },

    // 上司待ちを登録（テスト用）
    registerStaff(code) {
      const body = {
        code: code
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.bossId}/regist/`, body).then((response) => {
        // success callback
        this.$parent.countWaitStaff(response);
        console.log(response);
      }, (response) => {
        // error callback
        console.log(response);
      });
    },

    // 上司待ちを解除（テスト用）
    unregisterStaff(code) {
      const body = {
        code: code
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.bossId}/unregist/`, body).then((response) => {
        // success callback
        this.$parent.countWaitStaff(response);
      }, (response) => {
        // error callback
        console.log(response);
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/setting/var";
@import "../../scss/module/testModal";
</style>
