<!-- あとでコンポーネントをもっと細かい単位で分割したい… -->

<template>
  <div id="page" class="bg">
    <div class="frame">
      <div class="frame__container">
        <p class="frame__status">{{ top_status }}</p>
        <!-- frame__body box box--dark -->
        <div class="frame__body box box--dark" v-if="isActiveBox">
          <div class="box__container">
            <!-- form -->
            <form class="login" v-if="isActiveForm" v-on:submit="loginClickHandler">
              <input type="text" placeholder="your id" class="login__text" v-model="id" v-bind:value="id">
              <input type="submit" value="ログイン" class="login__submit">
            </form>
            <!-- /form -->
            <!-- logo -->
            <h1 v-if="isActiveLogo"><img src="img/logo.png" width="228" height="92" alt="全社員早押上司争奪戦"></h1>
            <!-- /logo -->
          </div>
        </div>
        <!-- /frame__body box box--dark -->
        <!-- frame__body staff -->
        <div class="frame__body staff" v-if="isActiveStaff">
          <ul class="staff__list" v-on:scroll="listScrollHandler" ref="staffList">
            <li class="staff__item staff__item--active" v-for="staffData in staffDatas">
              <div class="media">
                <div class="media__img media__img--border">
                  <img v-bind:src="'img/' + staffData.code + '.png'" width="80" height="80" v-bind:alt="staffData.name">
                </div>
                <div class="media__text">
                  <p class="txt-s txt-primary">STAFF:0{{ staffData.index }}</p>
                  <p class="txt-s mg-8t">{{ staffData.organization }}</p>
                  <p class="txt-l mg-3t">{{ staffData.name }}</p>
                </div>
              </div>
              <span class="staff__num">0{{ staffData.index }}</span>
            </li>
            <li class="staff__item staff__item--inactive" v-if="isActiveStaff02">
            <li class="staff__item staff__item--inactive" v-if="isActiveStaff03">
          </ul>
          <span class="staff__prev" v-if="isActivePrev" v-on:click="listPrevClickHandler"></span>
          <span class="staff__next" v-if="isActiveNext" v-on:click="listNextClickHandler"></span>
        </div>
        <!-- /frame__body staff -->
        <!-- frame__bottom status -->
        <div class="frame__bottom status" v-if="isActiveBottomStatus">
          <p class="status__text">{{ bottom_status }}</p>
        </div>
        <!-- /frame__bottom status -->
        <!-- frame__bottom button button--accent -->
        <div class="frame__bottom button button--accent" v-if="isActiveBottomButton">
          <span class="button__left button__left--1"></span>
          <span class="button__left button__left--2"></span>
          <span class="button__right button__right--1"></span>
          <span class="button__right button__right--2"></span>
          <button type="button" class="button__body" v-on:click="startClickHandler">早押開始</button>
        </div>
        <!-- /frame__bottom button button--accent -->
      </div>
    </div>
    <navigation v-bind:bossInfo="bossInfo"></navigation>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

export default {
  name: 'frame',
  components: {
    Navigation
  },
  data () {
    return {
      top_status: 'ログイン（仮）',
      bottom_status: '',
      id: '',
      bossInfo: {},
      staffDatas: [],
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
    };
  },
  init () {
    // 待ち人数を初期化
    this.staffLength = null;
  },
  methods: {
    // ログインボタンクリック時のイベント
    loginClickHandler (e) {
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

    // すべての上司情報を取得
    getBossesData () {
      this.$http.get('https://staffwars.azurewebsites.net/api/boss/').then((response) => {
          // success callback
          const bossData = this.getBossData(response.data, this.id);

          if (bossData) {
            // 子コンポーネントnavigationに渡す上司情報を準備
            this.bossInfo = {
              id: bossData.id,
              img: `img/${bossData.code}.png`,
              organization: bossData.organization,
              name: bossData.name,
              time: this.formatStartTime(bossData.start_datetime)
            };

            // ログインフォーム非表示
            this.isActiveForm = false;

            // frame下ステータスをリセット
            this.bottom_status = '';

            /*
             * テスト用コード
             */
            // 上司待ちを登録
            // this.registerStaff('seki-may');
            // 上司待ちを解除
            // this.unregisterStaff('iwata-na');


            // 上司を待っている部下を取得
            this.getWaitStaff();

            // 5秒に1回待ち状況を取得
            setInterval(() => {
              this.getWaitStaff();
            }, 5000);
          } else {
            // エラー文表示
            this.bottom_status = 'idが存在しません';
          }
        }, (response) => {
          // error callback
          console.log(response);
        });
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
      this.$http.get(`https://staffwars.azurewebsites.net/api/boss/${this.id}/regist/`).then((response) => {
        // success callback
        this.countWaitStaff(response);
      }, (response) => {
        // error callback
        console.log(response);
      });
    },

    // 上司待ちを登録（テスト用）
    registerStaff(code) {
      const body = {
        code: code
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.id}/regist/`, body).then((response) => {
        // success callback
        this.countWaitStaff(response);
      }, (response) => {
        // error callback
        console.log(response);
      });
    },

    // 上司待ちを解除
    unregisterStaff(code) {
      const body = {
        code: code
      };

      this.$http.post(`https://staffwars.azurewebsites.net/api/boss/${this.id}/unregist/`, body).then((response) => {
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
          this.showNostaffPage();
        }
      } else { // 待ちあり
        if (this.staffLength !== staffData.length) { // 待ち人数が変化していたら
          // 待ち人数を更新
          this.staffLength = staffData.length;

          this.showStaffPage(staffData, staffData.length);
        }
      }
    },

    // 待ちなし画面表示
    showNostaffPage () {
      this.top_status = 'あなたを待っている部下はいません';
      this.bottom_status = '部下エントリー受付中…';
      this.isActiveLogo = true;
    },

    // 待ちあり画面
    showStaffPage (staffData, staffLength) {
      this.top_status = `あなたを待っている部下が${staffLength}人います`;

      // index番号を追加した部下情報をdataに追加
      this.staffDatas = this.addIndex(staffData);

      // boxを非表示に
      this.isActiveBox = false;

      // 部下情報を表示
      this.isActiveStaff = true;

      // 空枠表示切り替え
      this.switchInActiveStaffItem(staffLength);

      if (staffLength > 3) {
        // 矢印初期表示
        this.isActiveNext = true;
      }

      // 画面下ステータスをリセット
      this.isActiveBottomStatus = false;
      this.bottom_status = '';

      // 早押しボタン表示
      this.isActiveBottomButton = true;
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

    addIndex (staffData) {
      for (let i = 0, length = staffData.length; i < length; i++) {
        staffData[i].index = i + 1;
      }
      return staffData;
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
      xhr.open('POST', `https://staffwars.azurewebsites.net/api/boss/${this.id}/start/`, false);
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
</style>