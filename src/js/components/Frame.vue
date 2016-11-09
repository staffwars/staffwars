<!-- 00: ログイン画面 -->
<!-- 01: 待ちなし画面 -->
<!-- 02~03: 待ちあり画面 -->
<!-- 04: カウントダウン画面 -->
<!-- 05: 結果画面 -->

<template>
  <!-- frame -->
  <div class="frame">
    <!-- frame__container -->
    <div class="frame__container">
      <p class="frame__status">{{ topStatus }}</p>
      <!-- frame__body -->
      <div class="frame__body">

        <!-- 00,01,04 -->
        <!-- box -->
        <div class="box box--dark" v-if="isActiveBox">
          <div class="box__container">
            <!-- 00 -->
            <form class="login" v-if="isActiveForm" @submit="loginSubmitHandler">
              <input type="text" placeholder="your id" class="login__text" autofocus v-model="bossId">
              <input type="submit" value="ログイン" class="login__submit">
            </form>
            <!-- /00 -->
            <!-- 01 -->
            <h1 v-if="isActiveLogo"><img src="img/logo.png" width="228" height="92" alt="全社員早押上司争奪戦"></h1>
            <!-- /01 -->
            <!-- 04 -->
            <!-- <span class="counter counter--10"></span> -->
            <!-- /04 -->
          </div>
        </div>
        <!-- /box -->
        <!-- 00,01,04 -->

        <!-- 05 -->
        <!-- box -->
        <!-- <div class="box box--bright">
          <div class="box__contaner">
            <img src="img/winner.png" width="120" height="23" alt="WINNER">
            <p class="txt-m mg-13t">Z14推進機関 第一開発部 エンジニア</p>
            <p class="txt-xxl txt-bold mg-5t">岩田 直樹</p>
            <div class="box__table">
              <table class="resultTable mg-20t">
                <caption class="resultTable__caption">RESULT</caption>
                <tr>
                  <td class="resultTable__td resultTable__rank">1</td>
                  <td class="resultTable__td resultTable__name">岩田直樹</td>
                  <td class="resultTable__td resultTable__time">00.01.00</td>
                </tr>
                <tr>
                  <td class="resultTable__td resultTable__rank">2</td>
                  <td class="resultTable__td resultTable__name">ぐる ナビ子</td>
                  <td class="resultTable__td resultTable__time">00.02.00</td>
                </tr>
                <tr>
                  <td class="resultTable__td resultTable__rank">3</td>
                  <td class="resultTable__td resultTable__name">小山田 花子</td>
                  <td class="resultTable__td resultTable__time">00.05.50</td>
                </tr>
              </table>
            </div>
          </div>
        </div> -->
        <!-- /box -->
        <!-- frame__bottom -->
        <!-- <div class="frame__bottom button button--primary">
          <span class="button__left button__left--1"></span>
          <span class="button__left button__left--2"></span>
          <span class="button__right button__right--1"></span>
          <span class="button__right button__right--2"></span>
          <button type="button" class="button__body">RESET</button>
        </div> -->
        <!-- /frame__bottom -->
        <!-- 05 -->

        <!-- 02,03 -->
        <!-- staff -->
        <div class="staff" v-if="isActiveStaff">
          <ul class="staff__list" @scroll="listScrollHandler" ref="staffList">
            <li class="staff__item staff__item--active" v-for="(staffData, index) in staffDatas">
              <div class="media">
                <div class="media__img media__img--border">
                  <img v-bind:src="'img/' + staffData.code + '.png'" width="80" height="80" v-bind:alt="staffData.name">
                </div>
                <div class="media__text">
                  <p class="txt-s txt-primary">STAFF:0{{ index + 1 }}</p>
                  <p class="txt-s mg-8t">{{ staffData.organization }}</p>
                  <p class="txt-l mg-3t">{{ staffData.name }}</p>
                </div>
              </div>
              <span class="staff__num">0{{ index + 1 }}</span>
            </li>
            <li class="staff__item staff__item--inactive" v-if="isActiveStaff02">
            <li class="staff__item staff__item--inactive" v-if="isActiveStaff03">
          </ul>
          <span class="staff__prev" v-if="isActivePrev" @click="listPrevClickHandler"></span>
          <span class="staff__next" v-if="isActiveNext" @click="listNextClickHandler"></span>
        </div>
        <!-- /staff -->
        <!-- /02,03 -->

        <!-- frame__bottom -->
        <div class="frame__bottom">
          <!-- 00,01,04 -->
          <div class="status" v-if="isActiveBottomStatus">
            <p class="status__text">{{ bottomStatus }}</p>
          </div>
          <!-- /00,01,04 -->
          <!-- 02~03 -->
          <div class="button button--accent" v-if="isActiveBottomButton">
            <span class="button__left button__left--1"></span>
            <span class="button__left button__left--2"></span>
            <span class="button__right button__right--1"></span>
            <span class="button__right button__right--2"></span>
            <button type="button" class="button__body" @click="startClickHandler">早押開始</button>
          </div>
          <!-- /02~03 -->
        </div>
        <!-- /frame__bottom -->
      </div>
      <!-- frame__body -->
    </div>
    <!-- /frame__container -->
  </div>
  <!-- /frame -->
</template>

<script>
export default {
  name: 'frame',
  data () {
    return {
      topStatus: 'ログイン（仮）',
      bottomStatus: '',
      staffDatas: [],
      bossId: '',
      isActiveForm: true,
      isActiveLogo: false,
      isActiveBottomStatus: true,
      isActiveBottomButton: false,
      isActiveStaff: false,
      isActiveBox: true,
      isActivePrev: false,
      isActiveNext: false,
      isActiveStaff02: false,
      isActiveStaff03: false
      // テスト用
      // isActiveTest: false
    };
  },
  created () {
    // 待ち人数を初期化
    this.staffLength = null;
  },
  methods: {
    // ログインボタンクリック時のイベント
    loginSubmitHandler (e) {
      e.preventDefault();

      // すべての上司情報を取得
      this.getBossesData();
    },

    // 早押開始ボタンクリック時のイベント
    startClickHandler () {
      // MilkCocoa
      // const MilkCocoa = require('milkcocoa');
      // const milkcocoa = new MilkCocoa('guitariu6e7lgx.mlkcca.com');
      // const ds = milkcocoa.dataStore('messages');
      //
      // ds.on('post', (data) => {
      //   console.log(data);
      // });
      //
      console.log('start');

      // 早押し開始
      this.requestStart();
    },

    // 部下リストスクロール時のイベント(あとで間引き処理追加)
    listScrollHandler (e) {
      // 矢印切り替え
      this.switchArrow(e.target);
    },

    // prevクリック時のイベント
    listPrevClickHandler () {
      // とりあえず一番上までスクロールしちゃう仕様
      this.$refs.staffList.scrollTop = 0;
    },

    // nextクリック時のイベント
    listNextClickHandler () {
      // とりあえず一番下までスクロールしちゃう仕様
      this.$refs.staffList.scrollTop = this.$refs.staffList.scrollHeight - 350;
    },

    // 上司情報を親コンポーネントに送る
    sendBossInfo (bossInfo) {
      this.$emit('send-from-frame', bossInfo);
    },

    // すべての上司情報を取得
    getBossesData () {
      this.$http.get('https://staffwars.azurewebsites.net/api/boss/').then((response) => {
          // success callback
          const bossData = this.getBossData(response.data, this.bossId);


          if (bossData) {
            // 親コンポーネントに渡す上司情報を準備
            const bossInfo = {
              id: bossData.id,
              img: `img/${bossData.code}.png`,
              organization: bossData.organization,
              name: bossData.name,
              time: this.formatStartTime(bossData.start_datetime)
            };

            // 上司情報を親コンポーネントに送信
            this.sendBossInfo(bossInfo);

            // ログイン画面のモジュールを非表示に
            this.hiddenLoginModule();

            // 上司を待っている部下を取得
            this.getWaitStaff();

            // 5秒に1回待ち状況を取得
            setInterval(() => {
              this.getWaitStaff();
            }, 5000);

            // テスト用フォーム表示
            this.isActiveTest = true;
          } else {
            // エラー文表示
            this.bottomStatus = 'idが存在しません';
          }
        }, (response) => {
          // error callback
          console.log(response);
        });
    },

    // ログイン画面のモジュールを非表示に
    hiddenLoginModule() {
      // box非表示
      this.isActiveBox = false;

      // 画面上ステータスリセット
      this.topStatus = '';

      // ログインフォーム非表示
      this.isActiveForm = false;

      // frame下ステータスをリセット
      this.bottomStatus = '';
    },

    // 特定の上司情報を取得
    getBossData (bossesData, bossId) {
      const bossData = bossesData.data.filter((v) => v.id === bossId);

      if (bossData.length === 1) {
        return bossData[0];
      }

      return null;
    },

    // APIから受け取った時間を、hh:mmの文字列に変換
    formatStartTime (ISOString) {
      const dt = new Date(ISOString);

      return `${dt.getHours()}:${dt.getMinutes()}`;
    },

    // 上司を待っている部下を取得
    getWaitStaff () {
      this.$http.get(`https://staffwars.azurewebsites.net/api/boss/${this.bossId}/regist/`).then((response) => {
        // success callback
        this.countWaitStaff(response);
      }, (response) => {
        // error callback
        console.log(response);
      });
    },

    // 待っている部下の数を数える
    countWaitStaff (response) {
      const staffData = response.data.data;
      const staffLength = staffData.length;

      if (staffLength === 0) { // 待ちなし
        if (this.staffLength !== staffData.length) { // 待ち人数が変化していたら
          // 待ち人数を更新
          this.staffLength = staffData.length;

          // 0人画面表示
          this.setNostaffModule();
        }
      } else { // 待ちあり
        if (this.staffLength !== staffData.length) { // 待ち人数が変化していたら
          // 待ち人数を更新
          this.staffLength = staffData.length;

          this.setStaffModule(staffData, staffData.length);
        }
      }
    },

    // 待ちなし画面設定
    setNostaffModule () {
      this.hiddenStaffModule();
      this.showNostaffModule();
    },

    // 待ちあり画面設定
    setStaffModule (staffData, staffLength) {
      this.hiddenNoStaffModule();
      this.showStaffModule(staffData, staffLength);
    },

    // 待ちなし画面表示
    showNostaffModule () {
      // 画面上ステータス更新
      this.topStatus = 'あなたを待っている部下はいません';

      // 画面下ステータス更新・表示
      this.bottomStatus = '部下エントリー受付中…';
      this.isActiveBottomStatus = true;

      // box表示
      this.isActiveBox = true;

      // ロゴ表示
      this.isActiveLogo = true;
    },

    // 待ちなし画面非表示
    hiddenNoStaffModule () {
      // 画面下ステータスリセット
      this.isActiveBottomStatus = false;
      this.bottomStatus = '';

      // boxを非表示に
      this.isActiveBox = false;

      // ロゴ非表示
      this.isActiveLogo = false;
    },

    // 待ちあり画面表示
    showStaffModule (staffData, staffLength) {
      // 画面上ステータス更新
      this.topStatus = `あなたを待っている部下が${staffLength}人います`;

      // 部下情報をdataに追加
      this.staffDatas = staffData;

      // 部下情報を表示
      this.isActiveStaff = true;

      // 空枠表示切り替え
      this.switchInActiveStaffItem(staffLength);

      // 矢印表示切り替え
      if (staffLength > 3) {
        this.isActiveNext = true;
      } else {
        this.isActiveNext = false;
      }

      // 早押しボタン表示
      this.isActiveBottomButton = true;
    },

    // 待ちあり画面非表示
    hiddenStaffModule () {
      // 画面下ステータス非表示・リセット
      this.isActiveBottomStatus = false;
      this.bottomStatus = '';

      // 部下一覧非表示
      this.isActiveStaff = false;

      // ボタン非表示
      this.isActiveBottomButton = false;
    },

    // 空枠表示切り替え
    switchInActiveStaffItem(staffLength) {
      if (staffLength === 1) {
        this.isActiveStaff02 = true;
        this.isActiveStaff03 = true;
      } else if (staffLength === 2) {
        this.isActiveStaff02 = false;
        this.isActiveStaff03 = true;
      } else {
        this.isActiveStaff02 = false;
        this.isActiveStaff03 = false;
      }
    },

    // 早押し開始
    requestStart () {
      const xhr = new XMLHttpRequest();
      // ハンドラの登録.
      xhr.onreadystatechange = () => {
      switch (xhr.readyState) {
        case 0:
          // 未初期化状態.
          console.log('uninitialized!');
          break;
        case 1: // データ送信中.
          console.log('loading...');
          break;
        case 2: // 応答待ち.
          console.log('loaded.');
          break;
        case 3: // データ受信中.
          console.log(`interactive... ${xhr.responseText.length} bytes.`);
          break;
        case 4: // データ受信完了.
          if (xhr.status === 200 || xhr.status === 304) {
            const data = xhr.responseText; // responseXML もあり
            console.log(`COMPLETE! :${data}`);
          } else {
            console.log(`Failed. HttpStatus: ${xhr.statusText}`);
          }
          break;
      }
      };
      xhr.open('POST', `https://staffwars.azurewebsites.net/api/boss/${this.bossId}/start/`, false);
      // POST 送信の場合は Content-Type は固定.
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      //
      xhr.send('');
      xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    },

    // 矢印切り替え
    switchArrow (el) {
      const scrollTop = el.scrollTop;

      if (scrollTop === 0) {
        this.isActivePrev = false;
      } else {
        this.isActivePrev = true;
      }

      if (scrollTop === el.scrollHeight - 350) {
        this.isActiveNext = false;
      } else {
        this.isActiveNext = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/setting/var";
@import "../../scss/setting/sprite";
@import "../../scss/module/bg";
@import "../../scss/module/frame";
@import "../../scss/module/box";
@import "../../scss/module/status";
@import "../../scss/module/login";
@import "../../scss/module/button";
@import "../../scss/module/staff";
@import "../../scss/module/media";
@import "../../scss/module/counter";
</style>
