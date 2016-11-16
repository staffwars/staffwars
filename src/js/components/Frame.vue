<!-- 00: ログイン画面 -->
<!-- 01: 待ちなし画面 -->
<!-- 02~03: 待ちあり画面 -->
<!-- 04: カウントダウン画面 -->
<!-- 05: 結果画面 -->

<!-- template -->
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
        <div class="box box--dark" v-if="isActiveDarkBox">
          <div class="loader" v-if="isActiveLoading">
            <div class="loader__body"></div>
          </div>
          <div class="box__container">
            <!-- 00 -->
            <form class="login" v-if="isActiveForm" @submit="submitLoginHandler">
              <input type="text" placeholder="your id" class="login__text" autofocus v-model="bossId">
              <input type="submit" value="ログイン" class="login__submit">
            </form>
            <!-- /00 -->
            <!-- 01 -->
            <h1 v-if="isActiveLogo"><img src="img/logo.png" width="228" height="92" alt="全社員早押上司争奪戦"></h1>
            <!-- /01 -->
            <!-- 04 -->
            <span class="counter" v-if="isActiveCounter" v-bind:class="counterObj"></span>
            <!-- /04 -->
          </div>
        </div>
        <!-- /box -->
        <!-- 00,01,04 -->

        <!-- 05 -->
        <!-- box -->
        <transition name="loader">
          <div class="box box--bright" v-if="isActiveBrightBox">
            <!-- winner -->
            <div class="box__container" v-if="isActiveWinner">
              <img src="img/winner.png" width="120" height="23" alt="WINNER">
              <p class="txt-m mg-13t">{{ rankings[0].organization }}</p>
              <p class="txt-xxl txt-bold mg-5t">{{ rankings[0].name }}</p>
              <div class="box__table">
                <table class="resultTable mg-20t">
                  <caption class="resultTable__caption">RESULT</caption>
                  <tr v-for="(ranking, index) in rankings">
                    <td class="resultTable__td resultTable__rank">{{ index + 1 }}</td>
                    <td class="resultTable__td resultTable__name">{{ ranking.name }}</td>
                    <td class="resultTable__td resultTable__time">{{ ranking.record }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- /winner -->
            <!-- draw -->
            <div class="box__container" v-if="isActiveDraw">
              <p class="box__result">DRAW</p>
            </div>
            <!-- /draw -->
          </div>
        </transition>
        <!-- /box -->
        <!-- 05 -->

        <!-- 02,03 -->
        <!-- staff -->
        <div class="staff" v-if="isActiveStaff">
          <ul class="staff__list" @scroll="scrollListHandler" ref="staffList">
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
          <span class="staff__prev" v-if="isActivePrev" @click="clickListPrevHandler"></span>
          <span class="staff__next" v-if="isActiveNext" @click="clickListNextHandler"></span>
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
          <div class="button button--accent" v-if="isActiveStartButton">
            <span class="button__left button__left--1"></span>
            <span class="button__left button__left--2"></span>
            <span class="button__right button__right--1"></span>
            <span class="button__right button__right--2"></span>
            <button type="button" class="button__body" @click="clickStartHandler">早押開始</button>
          </div>
          <!-- /02~03 -->
          <!-- 05 -->
          <div class="button button--primary" v-if="isActiveResetButton">
            <span class="button__left button__left--1"></span>
            <span class="button__left button__left--2"></span>
            <span class="button__right button__right--1"></span>
            <span class="button__right button__right--2"></span>
            <button type="button" class="button__body" @click="clickResetHandler">RESET</button>
          </div>
          <!-- /05 -->
        </div>
        <!-- /frame__bottom -->
      </div>
      <!-- frame__body -->
    </div>
    <!-- /frame__container -->
  </div>
  <!-- /frame -->
</template>
<!-- /template -->

<!-- script -->
<script>
export default {
  name: 'frame',
  data() {
    return {
      topStatus: '',
      bottomStatus: '',
      staffDatas: [],
      bossId: '',
      counterObj: {
        'counter--1': false,
        'counter--2': false,
        'counter--3': false,
        'counter--4': false,
        'counter--5': false,
        'counter--6': false,
        'counter--7': false,
        'counter--8': false,
        'counter--9': false,
        'counter--10': false
      },
      pushResult: {},
      rankings: [
        {
          name: '',
          organization: ''
        }
      ],
      counter: 10,
      isActiveForm: false,
      isActiveLogo: false,
      isActiveBottomStatus: true,
      isActiveStartButton: false,
      isActiveStaff: false,
      isActiveDarkBox: false,
      isActivePrev: false,
      isActiveNext: false,
      isActiveStaff02: false,
      isActiveStaff03: false,
      isActiveCounter: false,
      isActiveResetButton: false,
      isActiveBrightBox: false,
      isActiveLoading: false,
      isActiveWinner: false,
      isActiveDraw: false
    };
  },
  created() {
    // 待ち人数を初期化
    this.staffLength = null;

    // 初期画面切り替え
    this.switchFirstView();
    
    // 早押し結果の受け取りを検知
    this.$watch('rankings', () => {
      // box表示
      this.isActiveBrightBox = true;
      this.isActiveWinner = true;

      setTimeout(() => {
        // リセットボタン表示
        this.isActiveResetButton = true;
      }, 2000);
    });
  },
  methods: {
    // ログインボタンクリック時のイベント
    submitLoginHandler(e) {
      e.preventDefault();

      // すべての上司情報を取得
      this.getBossesData();
    },

    // 早押開始ボタンクリック時のイベント
    clickStartHandler() {
      // push通知受け取り
      this.getPushNotice();

      // 早押し中フラグ
      this.startFlag = true;

      // 部下リスト非表示
      this.hiddenStaffModule();

      // カウントダウン表示
      this.showCountModule();

      // ローディング表示
      this.isActiveLoading = true;

      // 早押し開始
      this.requestStart();
    },

    // 部下リストスクロール時のイベント
    scrollListHandler(e) {
      // 前回のスクロールイベント発火から0.1秒経っていたら矢印切り替え
      clearTimeout(this.scrollFlg);
      this.scrollFlg = setTimeout(() => {
        // 矢印切り替え
        this.switchArrow(e.target);
      }, 100);
    },

    // prevクリック時のイベント
    clickListPrevHandler() {
      // とりあえず一番上にいきなり移動しちゃう仕様
      this.$refs.staffList.scrollTop = 0;
    },

    // nextクリック時のイベント
    clickListNextHandler() {
      // とりあえず一番下にいきなり移動しちゃう仕様
      this.$refs.staffList.scrollTop = this.$refs.staffList.scrollHeight - 350;
    },

     // リセットボタンクリック時のイベント
    clickResetHandler() {
      // 早押し中フラグ
      this.startFlag = false;

      // 結果を非表示
      this.hiddenPushResultModule();

      // 待ち人数を初期化
      this.staffLength = null;

      // 上司待ち状況を取得
      this.getWaitStaff();
    },

    // 上司IDを保持しているかしていないかによって画面を切り替え
    switchFirstView() {
      // パラメータ取得
      const param = this.getParam();

      if (param && param.id) {
        // パラメータから取得した上司IDをdataに追加
        this.bossId = param.id;

        // すべての上司情報を取得していろいろ
        this.getBossesData();
      } else {
        // ログインフォーム表示
        this.showLoginModule();
      }
    },

    // クエリパラメータ取得
    getParam() {
      let result = {};

      const query = document.location.search;

      if (query.length > 1) {
        // 0番目の文字列（？）を除いた文字列を取得し、区切り記号（＆）で文字列を配列に分割
        const params = query.substring(1).split('&');

        for (let i = 0, length = params.length; i < length; i++) {
          // パラメータ名とパラメータ値に分割
          const element = params[i].split('=');

          // パラメータ名をキーとして連想配列に追加
          result[element[0]] = element[1];
        }

        return result;
      }
      return null;
    },

    // push通知受け取り
    getPushNotice() {
      // MilkCocoa
      /* globals MilkCocoa */
      const milkcocoa = new MilkCocoa('guitariu6e7lgx.mlkcca.com');
      const ds = milkcocoa.dataStore('messages');

      ds.on('push', (data) => {
        switch (data.value.type) {
          case 'pre_start': { // カウントダウン開始５秒前
            // console.log('countdown pre start');
            break;
          }
          case 'start': { // カウントダウン開始
            // console.log('countdown start');

            // ローディング非表示
            this.isActiveLoading = false;

            // カウントダウン
            this.countDown();
            this.countInterval = setInterval(() => {
              this.countDown();
            }, 1000);

            break;
          }
          case 'pre_finish': { // カウントダウン終了５秒前
            // console.log('countdown pre finish');
            break;
          }
          case 'finish': { // カウントダウン終了＝早押し開始
            // console.log('countdown finish');

            // カウントダウン非表示
            this.hiddenCountModule();

            // 画面上ステータス更新
            this.topStatus = '早押し結果取得中';

            // ローディング表示
            this.isActiveLoading = true;

            // 早押し開始時間を保持
            this.pushStartTime = data.timestamp;
            break;
          }
          case 'result': { // 早押し結果の通知
            // console.log('countdown result');

            // ローディング非表示
            this.isActiveLoading = false;

            // 結果を表示
            this.showPushResultModule(data.value);
            break;
          }
          default:
        }
      });
    },

    // 上司情報を親コンポーネントに送る
    sendBossInfo(bossInfo) {
      this.$emit('send-from-frame', bossInfo);
    },

    // すべての上司情報を取得
    getBossesData() {
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
        console.error(response);
      });
    },

    // 特定の上司情報を取得
    getBossData(bossesData, bossId) {
      const bossData = bossesData.data.filter((v) => v.id === bossId);

      if (bossData.length === 1) {
        return bossData[0];
      }

      return null;
    },

    // APIから受け取った時間を、hh:mmの文字列に変換
    formatStartTime(ISOString) {
      if (ISOString !== '') {
        const dt = new Date(ISOString);

        const dtObj = {
          hours: dt.getHours(),
          minutes: dt.getMinutes()
        };

        for (let key in dtObj) {
          if (dtObj[key] < 10) {
            dtObj[key] = '0' + dtObj[key];
          }
        }

        return `${dtObj.hours}:${dtObj.minutes}`;
      }
      // 受け取った時間が空文字列だったら空文字列を返却
      return '';
    },

    // 上司を待っている部下を取得
    getWaitStaff() {
      this.$http.get(`https://staffwars.azurewebsites.net/api/boss/${this.bossId}/regist/`).then((response) => {
        // success callback
        this.countWaitStaff(response);
      }, (response) => {
        // error callback
        console.error(response);
      });
    },

    // 待っている部下の数を数える
    countWaitStaff(response) {
      const staffData = response.data.data;
      const staffLength = staffData.length;

      if (staffLength === 0) { // 待ちなし
        if (this.staffLength !== staffData.length) { // 待ち人数が変化していたら
          // 待ち人数を更新
          this.staffLength = staffData.length;

          if (!this.startFlag) {
            // 0人画面表示
            this.setNostaffModule();
          }
        }
      } else { // 待ちあり
        if (this.staffLength !== staffData.length) { // 待ち人数が変化していたら
          // 待ち人数を更新
          this.staffLength = staffData.length;

          if (!this.startFlag) {
            this.setStaffModule(staffData, staffData.length);
          }
        }
      }
    },

    // 部下情報一覧を取得
    getStaffInfo(simpleStaffData) {
      this.$http.get('https://staffwars.azurewebsites.net/api/subordinate/').then((response) => {
        // success callback
        this.getStaffOrganization(response.data.data, simpleStaffData);
      }, (response) => {
        // error callback
        console.error(response);
      });
    },

    // 部下の組織を取得して追加したものを返却
    getStaffOrganization(data, simpleStaffData) {
      let category = '';

      for (let i = 0, simpleStaffDataLength = simpleStaffData.length; i < simpleStaffDataLength; i++) {
        for (let j = 0, dataLength = data.length; j < dataLength; j++) {
          if (simpleStaffData[i].subordinate) { // ランキング
            category = 'ranking';

            if (simpleStaffData[i].subordinate.code === data[j].code) {
              simpleStaffData[i].subordinate.organization = data[j].organization;
            }
          } else { // 上司待ち部下一覧
            category = 'staffList';

            if (simpleStaffData[i].code === data[j].code) {
              simpleStaffData[i].organization = data[j].organization;
            }
          }
        }
      }

      if (category === 'ranking') {
        // ランキングをdataに追加
        this.setRankingsData(simpleStaffData);
      } else {
        // 部下情報をdataに追加
        this.staffDatas = simpleStaffData;
      }
    },

    // 待ちなし画面設定
    setNostaffModule() {
      this.hiddenStaffModule();
      this.showNostaffModule();
    },

    // 待ちあり画面設定
    setStaffModule(staffData, staffLength) {
      this.hiddenNoStaffModule();
      this.showStaffModule(staffData, staffLength);
    },

    // ログインモジュール非表示
    hiddenLoginModule() {
      // 画面上ステータスリセット
      this.topStatus = '';

      // box非表示
      this.isActiveDarkBox = false;

      // フォーム非表示
      this.isActiveForm = false;

      // frame下ステータスをリセット
      this.bottomStatus = '';
    },

    // ログインモジュール表示
    showLoginModule() {
      // 画面上ステータス更新
      this.topStatus = 'ログイン（仮）';

      // box表示
      this.isActiveDarkBox = true;

      // フォーム表示
      this.isActiveForm = true;
    },

    // 待ちなし画面表示
    showNostaffModule() {
      // 画面上ステータス更新
      this.topStatus = 'あなたを待っている部下はいません';

      // 画面下ステータス更新・表示
      this.bottomStatus = '部下エントリー受付中…';
      this.isActiveBottomStatus = true;

      // box表示
      this.isActiveDarkBox = true;

      // ロゴ表示
      this.isActiveLogo = true;
    },

    // 待ちなし画面非表示
    hiddenNoStaffModule() {
      // 画面下ステータスリセット
      this.isActiveBottomStatus = false;
      this.bottomStatus = '';

      // boxを非表示に
      this.isActiveDarkBox = false;

      // ロゴ非表示
      this.isActiveLogo = false;
    },

    // 待ちあり画面表示
    showStaffModule(staffData, staffLength) {
      // 画面上ステータス更新
      this.topStatus = `あなたを待っている部下が${staffLength}人います`;

      this.getStaffInfo(staffData);

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
      this.isActiveStartButton = true;
    },

    // 待ちあり画面非表示
    hiddenStaffModule() {
      // 画面上ステータスリセット
      this.topStatus = '';

      // 画面下ステータス非表示・リセット
      this.isActiveBottomStatus = false;
      this.bottomStatus = '';

      // 部下一覧非表示
      this.isActiveStaff = false;

      // ボタン非表示
      this.isActiveStartButton = false;
    },

    // カウントダウン表示
    showCountModule() {
      // 画面上ステータス表示
      this.topStatus = '部下側早押し準備中';

      // box表示
      this.isActiveDarkBox = true;

      // カウンター表示
      this.isActiveCounter = true;

      // 画面下ステータス表示
      this.isActiveBottomStatus = true;
      this.bottomStatus = '部下の早押し結果待ち';
    },

    // カウントダウン非表示
    hiddenCountModule () {
      // 画面上ステータスリセット
      this.topStatus = '';

      // カウンター非表示
      this.isActiveCounter = false;

      // 画面下ステータス非表示・リセット
      this.isActiveBottomStatus = false;
      this.bottomStatus = '';
    },

    // 早押し結果を表示
    showPushResultModule(value) {
      // box非表示
      this.isActiveDarkBox = false;

      const result = value.result;

      if (result.length) {
        // datetimeでソートし、部下の組織を取得
        this.getStaffInfo(this.sortPushResult(result));

        // 画面上ステータス更新
        this.topStatus = '部下が来るまで席で待機してください';
      } else {
        // 画面上ステータス更新
        this.topStatus = '諸事情により実行されませんでした';

        // DRAW表示
        this.isActiveBrightBox = true;
        this.isActiveDraw = true;

        setTimeout(() => {
          // リセットボタン表示
          this.isActiveResetButton = true;
        }, 2000);
      }
    },

    // 早押し結果を非表示
    hiddenPushResultModule() {
      // 画面上ステータスリセット
      this.topStatus = '';

      // ボックス非表示
      this.isActiveBrightBox = false;

      // ボックスの中身非表示
      this.isActiveWinner = false;
      this.isActiveDraw = false;

      // リセットボタン非表示
      this.isActiveResetButton = false;
    },

    // カウントダウン
    countDown() {
      if (this.counter === 0) { // カウントが0だったら
        // カウントダウン停止
        clearInterval(this.countInterval);

        // 1を非表示に
        this.counterObj['counter--1'] = false;

        // カウンター自体を非表示に
        this.isActiveCounter = false;

        // カウントを10に戻す
        this.counter = 10;

        // 処理を抜ける
        return;
      }

      const activeClassName = `counter--${this.counter}`;
      const inActiveClassName = `counter--${this.counter + 1}`;

      // 現在のカウントを表示
      this.counterObj[activeClassName] = true;

      // 前のカウントを非表示
      this.counterObj[inActiveClassName] = false;

      this.counter--;
    },

    // 早押し順でソート
    sortPushResult(result) {
      const sortedResult = result.sort((a, b) => {
        if (a.datetime < b.datetime) {
          return -1;
        }

        if (a.datetime > b.datetime) {
          return 1;
        }

        return 0;
      });

      return sortedResult;
    },

    // rankingsを更新
    setRankingsData(result) {

      const rankings = [];

      for (let i = 0, length = result.length; i < length; i++) {
        const ranking = {
          // 名前を配列に追加
          name: result[i].subordinate.name,

          // 早押し開始時間から実際に押された時間を引き、秒に換算して配列に追加
          record: (result[i].datetime - this.pushStartTime) / 1000,

          organization: result[i].subordinate.organization
        };

        rankings.push(ranking);
      }

      // ランキングをdataに追加
      this.rankings = rankings;
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
    requestStart() {
      const xhr = new XMLHttpRequest();

      // ハンドラの登録.
      xhr.onreadystatechange = () => {
        switch (xhr.readyState) {
          case 0: { // 未初期化状態.
            // console.log('uninitialized!');
            break;
          }
          case 1: { // データ送信中.
            // console.log('loading...');
            break;
          }
          case 2: { // 応答待ち.
            // console.log('loaded.');
            break;
          }
          case 3: { // データ受信中.
            // console.log(`interactive... ${xhr.responseText.length} bytes.`);
            break;
          }
          case 4: { // データ受信完了.
            if (xhr.status === 200 || xhr.status === 304) {
              // const data = xhr.responseText; // responseXML もあり
              // console.log(`COMPLETE! :${data}`);
              // console.log('COMPLETE!');
            } else {
              // console.error(`Failed. HttpStatus: ${xhr.statusText}`);
            }
            break;
          }
          default:
        }
      };

      xhr.open('POST', `https://staffwars.azurewebsites.net/api/boss/${this.bossId}/start/`, false);

      // POST 送信の場合は Content-Type は固定.
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.send('');
      xhr.abort(); // 再利用する際にも abort() しないと再利用できないらしい.
    },

    // 矢印切り替え
    switchArrow(el) {
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
<!-- /script -->

<!-- style -->
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
@import "../../scss/module/resultTable";
@import "../../scss/module/loader";
</style>
<!-- /style -->
