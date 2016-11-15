<template>
  <div class="testModal" v-if="isActiveTest">
    <span class="testModal__close" @click="clickCloseHandler">×</span>
    <p class="testModal__text">てすとつーる</p>
    <form class="testModal__form" @submit="submitRegisterHandler" v-on:reset="resetRegisterHandler">
      <select name="code" class="testModal__select" v-model="staffCode" v-bind:value="staffCode">
        <option value="inoue-no">inoue-no</option>
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
  props: ['bossInfo'],
  data () {
    return {
      staffCode: 'inoue-no',
      isActiveTest: false
    };
  },
  created () {
    // 上司情報の受け取りを検知
    this.$watch('bossInfo', () => {
      this.isActiveTest = true;
    });
  },
  methods: {
    // 上司待ち登録イベント（テスト用）
    submitRegisterHandler (e) {
      e.preventDefault();

      // 上司待ちを登録
      this.registerStaff(this.staffCode);
    },

    // 上司待ち解除イベント（テスト用）
    resetRegisterHandler (e) {
      e.preventDefault();

      // 上司待ちを解除
      this.unregisterStaff(this.staffCode);
    },

    // 閉じるイベント（テスト用）
    clickCloseHandler () {
      this.isActiveTest = false;
    },

    // 上司待ちを登録（テスト用）
    registerStaff(code) {
      const body = {
        code: code
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.bossInfo.id}/regist/`, body).then((response) => {
        // success callback
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

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.bossInfo.id}/unregist/`, body).then((response) => {
        // success callback
        console.log(response);
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
