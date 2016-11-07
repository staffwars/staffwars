<template>
  <nav>
    <ul id="js-nav" class="navigation">
      <li id="js-boss-info" class="navigation__item" v-if="isActiveBossInFo">
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
      <li class="navigation__item" v-if="isActiveSchedule">
        <div class="time">
          <div class="time__headline">
            <p class="time__en">SCHEDULE</p>
            <p class="time__ja">着席予定時間</p>
          </div>
          <div class="time__entry">
            <input type="time" class="time__input"  v-model="bossInfo.time" v-bind:value="bossInfo.time">
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
    // 上司情報の挿入を検知
    this.$watch('bossInfo', () => {
      this.isActiveBossInFo = true;
      this.isActiveSchedule = true;
    });

    // 時間の変更を検知
    this.$watch('bossInfo.time', () => {
      this.updateStartTime(this.formatInputTime(this.bossInfo.time));
    });
  },
  methods: {
    updateStartTime (ISOString) {
      const updateInfo = {
        start_datetime: ISOString
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.bossInfo.id}/`, updateInfo).then((response) => {
        // success callback
        // console.log(response);
      }, (response) => {
        // error callback
        // console.log(response);
      });
    },

    // 入力された時間をISO文字列に変換
    formatInputTime (inputTime) {
      const splitedTime = inputTime.split(':');
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