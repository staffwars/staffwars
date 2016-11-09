<template>
  <nav>
    <ul id="js-nav" class="navigation">
      <li id="js-boss-info" class="navigation__item mg-88r" v-if="isActiveBossInFo">
        <div class="media">
          <div class="media__img">
            <img v-bind:src="bossInfo.img" width="50" height="50" alt="">
          </div>
          <div class="media__text">
            <p class="txt-s">{{ bossInfo.organization }}</p>
            <p class="txt-m mg-3t">{{ bossInfo.name }}</p>
          </div>
        </div>
      </li>
      <li class="navigation__item mg-117r" v-if="isActiveSchedule">
        <div class="time">
          <div class="time__headline">
            <p class="time__en">SCHEDULE</p>
            <p class="time__ja">着席予定時間</p>
          </div>
          <form class="time__entry" @submit="submitTimeHandler" @reset="">
            <label class="time__textLabel">
              <input type="text" class="time__text" v-model="bossInfo.time" v-bind:value="bossInfo.time" @input="inputTimeHandler">
            </label>
            <label class="time__resetLabel">
              <input type="reset" class="time__reset">
            </label>
          </form>
        </div>
      </li>
      <li class="navigation__item">
        <div class="title">
          <h2 class="title__text">全社員早押<span class="title__caution">上司</span>争奪戦</h2>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'navigation',
  props: ['bossInfo'],
  data () {
    return {
      isActiveBossInFo: false,
      isActiveSchedule: false
    };
  },
  created () {
    // 上司情報の受け取りを検知
    this.$watch('bossInfo', () => {
      this.isActiveBossInFo = true;
      this.isActiveSchedule = true;
    });

    this.submitFlag;
  },
  methods: {
    // 時間が入力された時のイベント
    inputTimeHandler() {

      // 前回のinputイベント発火から3秒経っていたら上司情報更新の処理開始
      clearTimeout(this.submitFlag);
      this.submitFlag = setTimeout(() => {
        this.updateStartTime();
      }, 3000);
    },

    // フォームがsubmitされた時のイベント
    submitTimeHandler (e) {
      e.preventDefault();

      // タイマー止める
      clearTimeout(this.submitFlag);

      this.updateStartTime();
    },

    // リセットボタンが押された時のイベント
    resetTimeHandler () {
      // start_datetimeを空にして送る処理
    },

    // 上司情報の時間を更新
    updateStartTime () {
      const validatedTime = this.validateInputTime();

      console.log('validated!');
      console.log(validatedTime);

      if (validatedTime) {
        this.sendStartTime(this.formatInputTime(validatedTime));
      } else {
        // hh:mm形式で入力してくださいと表示
      }
    },

    // 入力された値をvalidate
    validateInputTime () {
      const result = this.bossInfo.time.match(/^[0-9]{2}:[0-9]{2}$/);

      if (result) {
        return result[0];
      }
      return null;
    },

    // 時間送る
    sendStartTime (timeString) {
      const updateInfo = {
        start_datetime: timeString
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.bossInfo.id}/`, updateInfo).then((response) => {
        // success callback
        console.log(response);
      }, (response) => {
        // error callback
        console.log(response);
      });
    },

    // 入力された時間をISO文字列に変換
    formatInputTime (validatedTime) {
      console.log(validatedTime);
      const splitedTime = validatedTime.split(':');
      const hour = splitedTime[0];
      const minutes = splitedTime[1];

      // 勝手に現在時刻から日付決めちゃう
      const dt = new Date();
      dt.setHours(hour);
      dt.setMinutes(minutes);

      return dt.toISOString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/setting/var";
@import "../../scss/setting/sprite";
@import "../../scss/module/navigation";
@import "../../scss/module/media";
@import "../../scss/module/title";
@import "../../scss/module/time";
</style>