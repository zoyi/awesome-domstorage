'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAME = 'ch-plugin';

var _tempStorage = {};

var LocalStorageService = function () {
  function LocalStorageService() {
    _classCallCheck(this, LocalStorageService);

    this.isEnabled = false;
    this._checkSanity();
  }

  _createClass(LocalStorageService, [{
    key: 'init',
    value: function init(obj) {
      for (var i in obj) {
        if (!this.get(i)) {
          this.set(i, obj[i]);
        }
      }
    }
  }, {
    key: 'get',
    value: function get(key) {
      var dashed = this._addDashInBetween(key);
      var concatenated = this._concat(NAME, dashed);

      if (this.isEnabled) {
        return this._stringToBoolean(window.localStorage.getItem(concatenated));
      } else {
        return this._stringToBoolean(_tempStorage[concatenated]);
      }
    }
  }, {
    key: 'set',
    value: function set(key, val) {
      var dashed = this._addDashInBetween(key);
      var concatenated = this._concat(NAME, dashed);

      if (this.isEnabled) {
        window.localStorage.setItem(concatenated, val);
      } else {
        _tempStorage[concatenated] = val;
      }
    }
  }, {
    key: 'getWithExpiration',
    value: function getWithExpiration(key) {
      var time = this.get(key + '-!#ExpirationTime#!');
      if (time && Number(time) >= Number((0, _moment2.default)().format('x'))) {
        this.set(key, this.get(key + '-!#ExpirationValue#!'));
        this.set(key + '-!#ExpirationTime#!', 'null');
      }
      return this.get(key);
    }
  }, {
    key: 'setWithExpiration',
    value: function setWithExpiration(key, val, expirationTime) {
      var valueAfterExpiration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'null';

      this.set(key, val);
      this.set(key + '-!#ExpirationTime#!', expirationTime);
      this.set(key + '-!#ExpirationValue#!', valueAfterExpiration);
    }
  }, {
    key: '_addDashInBetween',
    value: function _addDashInBetween(key) {
      if (Array.isArray(key)) {
        var ret = key[0];
        for (var i = 1; i < key.length; i++) {
          ret += '-';
          ret += key[i];
        }
        return ret;
      } else {
        return key;
      }
    }
  }, {
    key: '_checkSanity',
    value: function _checkSanity() {
      try {
        window.localStorage.setItem(NAME + '-sanityChecked', 'true');
        this.isEnabled = true;
      } catch (err) {
        this.isEnabled = false;
      }
    }
  }, {
    key: '_concat',
    value: function _concat(prefix, arr) {
      return prefix + '-' + arr;
    }
  }, {
    key: '_stringToBoolean',
    value: function _stringToBoolean(val) {
      if (val === 'true') {
        return true;
      } else if (val === 'false') {
        return false;
      } else {
        return val;
      }
    }
  }]);

  return LocalStorageService;
}();

exports.default = new LocalStorageService();