export default class Login {

  constructor() {
  }

  init() {
    this.vm_nav = this.initNav();
    this.vm_frame = this.initFrame();
  }

  // frameのインスタンス生成
  initFrame() {
    const _this = this;

    return new Vue({
      el: '#js-frame',
      data: {
        top_status: 'ログイン（仮）',
        bottom_status: null,
        code: null,
        isHiddenForm: false
      },
      methods: {
        clickHandler: function () {
          // すべての上司情報を取得
          const bossesData = _this.getBossesData();

          // input要素からcodeを取得
          this.code = _this.getBossCode();

          // 該当codeを持つ上司情報を取得
          const bossData = _this.getBossData(bossesData, this.code);

          if (bossData) {
            // 上司情報をnavに表示
            _this.insertBossInfo(bossData);

            // ログインフォーム非表示
            this.isHiddenForm = true;

            // frame下ステータスをリセット
            this.bottom_status = null;
          } else {
            this.bottom_status = 'codeが存在しません';
          }
        }
      }
    });
  }

  // navのインスタンス生成
  initNav() {
    return new Vue({
      el: '#js-nav',
      data: {
        isHiddenBossInFo: true,
        isHiddenSchedule: true,
        img: null,
        organization: null,
        name: null,
        time: null
      }
    });
  }

  // すべての上司情報を取得
  getBossesData() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://staffwars.azurewebsites.net/api/boss/', false);
    xhr.send(null);

    return JSON.parse(xhr.responseText);
  }

  // 特定の上司情報を取得
  getBossData(bossesData, bossCode) {
    const bossData = bossesData.data.filter((v) => v.code === bossCode);

    if (bossData.length === 1) {
      return bossData[0];
    } else {
      return null;
    }
  }

  // ユーザが入力した上司IDを取得
  getBossCode() {
    return document.getElementById('js-login-code').value;
  }

  // 上司情報をnavに反映する
  insertBossInfo(data) {
    // 上司情報を挿入
    this.vm_nav.img = `img/${data.code}.png`;
    this.vm_nav.organization = data.organization;
    this.vm_nav.name = data.name;
    this.vm_nav.time = this.formatStartTime(data.start_datetime);;

    // 非表示から表示に切り替える
    this.vm_nav.isHiddenBossInFo = false;
    this.vm_nav.isHiddenSchedule = false;
  }

  // APIから受け取った時間を、hh:mmの文字列に変換
  formatStartTime(ISOString) {
    const dt = new Date(ISOString);

    return `${dt.getHours()}:${dt.getMinutes()}`
  }

}