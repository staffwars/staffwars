<!-- template -->
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
          <form class="time__entry" @submit="submitTimeHandler" @reset="resetTimeHandler">
            <label class="time__textLabel">
              <input type="text" class="time__text" placeholder="00:00" ref="timeText" v-model="bossInfo.time" v-bind:value="bossInfo.time" v-bind:class="{ 'time__text--notice': isTimeCautionNotice }" @input="inputTimeHandler">
            </label>
            <label class="time__resetLabel">
              <input type="reset" value="" class="time__reset" v-if="isActiveReset">
            </label>
          </form>
          <div class="time__balloon" v-if="isActiveBalloon">
            <p class="time__caution">正しく時間を入力してください</p>
          </div>
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
<!-- /template -->

<!-- script -->
<script>
export default {
  name: 'navigation',
  props: ['bossInfo'],
  data() {
    return {
      isActiveBossInFo: false,
      isActiveSchedule: false,
      isActiveReset: true,
      isActiveBalloon: false,
      isTimeCautionNotice: false,
    };
  },
  created() {
    // 上司情報の受け取りを検知
    this.$watch('bossInfo', () => {
      this.isActiveBossInFo = true;
      this.isActiveSchedule = true;
    });

    // 時間の変更を検知
    this.$watch('bossInfo.time', () => {
      // リセットボタンの表示・非表示を切り替え
      this.switchResetButton();

      // エラー文非表示
      this.isActiveBalloon = false;

      // 時間が送られる時のアニメーションをクラスを外す
      this.isTimeCautionNotice = false;
    });
  },
  methods: {
    // リセットボタンの表示・非表示を切り替え
    switchResetButton() {
      if (this.bossInfo.time === '') {
        // リセットボタン非表示
        this.isActiveReset = false;
      } else {
        // リセットボタン表示
        this.isActiveReset = true;
      }
    },

    // 時間が入力された時のイベント
    inputTimeHandler() {
      // 前回のinputイベント発火から1秒経っていたら上司情報更新の処理開始
      clearTimeout(this.submitFlag);
      this.submitFlag = setTimeout(() => {
        this.updateStartTime();
      }, 1000);
    },

    // フォームがsubmitされた時のイベント
    submitTimeHandler(e) {
      e.preventDefault();

      // タイマー止める
      clearTimeout(this.submitFlag);

      // 上司情報を更新
      this.updateStartTime();
    },

    // リセットボタンが押された時のイベント
    resetTimeHandler() {
      // dataを空に
      this.bossInfo.time = '';

      // start_datetimeを空で送る
      this.sendStartTime('');
    },

    // 上司情報の時間を更新
    updateStartTime() {
      if (this.bossInfo.time === '') { // 入力された値が空だったら
        // start_datetimeを空で送る
        this.sendStartTime('');
      } else {
        // バリデート
        const validatedTime = this.validateInputTime();

        if (validatedTime) {
          // 時間をAPIに送る
          this.sendStartTime(this.formatInputTime(validatedTime));
        } else {
          // エラー文表示
          this.isActiveBalloon = true;
        }
      }
    },

    // 入力された値をvalidate
    validateInputTime() {
      const result = this.bossInfo.time.match(/^[0-2][0-9]:[0-5][0-9]$/);

      if (result) {
        return result[0];
      }

      return null;
    },

    // 時間APIに送る
    sendStartTime(timeString) {
      const updateInfo = {
        start_datetime: timeString,
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.bossInfo.id}/`, updateInfo).then(() => {
        // success callback
        // 時間がAPIに送られたことを文字色の変化でユーザに伝える
        this.isTimeCautionNotice = true;

        // フォーカスを外す
        this.$refs.timeText.blur();
      }, (response) => {
        // error callback
        console.error(response);
      });
    },

    // 入力された時間をISO文字列に変換
    formatInputTime(validatedTime) {
      const splitedTime = validatedTime.split(':');
      const hour = splitedTime[0];
      const minutes = splitedTime[1];

      // 勝手に現在時刻から日付決めちゃう
      const dt = new Date();
      dt.setHours(hour);
      dt.setMinutes(minutes);

      return dt.toISOString();
    },
  },
};
</script>
<!-- /script -->

<!-- style -->
<style lang="scss" scoped>
@import "../../scss/setting/var";
@import "../../scss/setting/sprite";
@import "../../scss/module/navigation";
@import "../../scss/module/media";
@import "../../scss/module/title";
@import "../../scss/module/time";
</style>
<!-- /style -->