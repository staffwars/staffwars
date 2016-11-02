export default class Login {

  constructor() {
  }

  init() {
    this.addLoginClickEvent();
  }

  addLoginClickEvent() {
    document.getElementById('js-login-button').addEventListener('click', () => {
      const data = this.getData(this.getBossId());
      this.insertBossInfo(data);
      this.showEl(document.getElementById('js-boss-info'));
    });
  }

  getBossId() {
    return document.getElementById('js-login-id').value;
  }

  getData(bossId) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://staffwars.azurewebsites.net/api/boss/${bossId}`, false);
    xhr.send(null);

    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    }
  }

  insertBossInfo(data) {
    console.log(data);

    const myViewModel = new Vue({
      el: '#js-boss-info',
      data: data.data
    });
  }

  showEl(el) {
    el.classList.remove('is-hidden');
  }

}