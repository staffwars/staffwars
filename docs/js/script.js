(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Login = function () {
  function Login() {
    _classCallCheck(this, Login);
  }

  _createClass(Login, [{
    key: 'init',
    value: function init() {
      this.addLoginClickEvent();
    }
  }, {
    key: 'addLoginClickEvent',
    value: function addLoginClickEvent() {
      var _this = this;

      document.getElementById('js-login-button').addEventListener('click', function () {
        var data = _this.getData(_this.getBossId());
        _this.insertBossInfo(data);
        _this.showEl(document.getElementById('js-boss-info'));
      });
    }
  }, {
    key: 'getBossId',
    value: function getBossId() {
      return document.getElementById('js-login-id').value;
    }
  }, {
    key: 'getData',
    value: function getData(bossId) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', 'https://staffwars.azurewebsites.net/api/boss/' + bossId, false);
      xhr.send(null);

      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
      }
    }
  }, {
    key: 'insertBossInfo',
    value: function insertBossInfo(data) {
      console.log(data);

      var myViewModel = new Vue({
        el: '#js-boss-info',
        data: data.data
      });
    }
  }, {
    key: 'showEl',
    value: function showEl(el) {
      el.classList.remove('is-hidden');
    }
  }]);

  return Login;
}();

exports.default = Login;

},{}],2:[function(require,module,exports){
'use strict';

var _Login = require('./module/Login');

var _Login2 = _interopRequireDefault(_Login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

  var login = new _Login2.default();

  login.init();
})();

},{"./module/Login":1}]},{},[2]);
