'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tempStorage = {};

var StorageService = function () {
  function StorageService(storage) {
    _classCallCheck(this, StorageService);

    this.storageIsAvailable = false;
    this.isInitialized = false;
    this.storage = {};
    this.prefix = '';

    this._setStorage(storage);
  }

  _createClass(StorageService, [{
    key: 'init',
    value: function init(obj, prefix) {
      if (prefix) {
        this.setPrefix(prefix);
      }
      this._checkSanity();
      this.isInitialized = true;

      for (var i in obj) {
        if (!this.get(i)) {
          this.set(i, obj[i]);
        }
      }
    }
  }, {
    key: 'setPrefix',
    value: function setPrefix(prefix) {
      this.prefix = prefix;
    }
  }, {
    key: 'get',
    value: function get(key) {
      var dashed = this._addDashInBetween(key);
      var concatenated = this._concat(this.prefix, dashed);

      if (this.storageIsAvailable) {
        return this._cast(this.storage.getItem(concatenated));
      } else {
        return this._cast(_tempStorage[concatenated]);
      }
    }
  }, {
    key: 'set',
    value: function set(key, val) {
      if (this.isInitialized === false) {
        return 'Storage is not initialized. Didn\'t you call .init() yet?';
      } else {
        var dashed = this._addDashInBetween(key);
        var concatenated = this._concat(this.prefix, dashed);

        if (this.storageIsAvailable) {
          this.storage.setItem(concatenated, val);
        } else {
          _tempStorage[concatenated] = val;
        }
      }
    }
  }, {
    key: 'getWithExpiration',
    value: function getWithExpiration(key) {
      var time = this.get(key + '-!#ExpirationTime#!');
      if (time && +(0, _moment2.default)().format('x') >= +time) {
        this.set(key, this.get(key + '-!#ExpirationValue#!'));
        this.set(key + '-!#ExpirationTime#!', 'null');
      }
      return this.get(key);
    }
  }, {
    key: 'setWithExpiration',
    value: function setWithExpiration(key, val, expirationTerm) {
      var valueAfterExpiration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'null';

      var expirationTime = +(0, _moment2.default)().format('x') + expirationTerm * 1000;
      this.set(key, val);
      this.set(key + '-!#ExpirationTime#!', String(expirationTime));
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
        this.storage.setItem(this.prefix + '-sanityChecked', 'true');
        this.storageIsAvailable = true;
      } catch (err) {
        this.storageIsAvailable = false;
      }
    }
  }, {
    key: '_cast',
    value: function _cast(val) {
      if (val === 'true' || val === 'false') {
        return this._stringToBoolean(val);
      } else if (val === 'null') {
        return this._stringToNull(val);
      } else {
        return val;
      }
    }
  }, {
    key: '_concat',
    value: function _concat(prefix, arr) {
      return prefix + '-' + arr;
    }
  }, {
    key: '_setStorage',
    value: function _setStorage(storage) {
      if (storage === 'local') {
        this.storage = window.localStorage;
      } else if (storage === 'session') {
        this.storage = window.sessionStorage;
      }
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
  }, {
    key: '_stringToNull',
    value: function _stringToNull(val) {
      if (val === 'null') {
        return null;
      } else {
        return val;
      }
    }
  }]);

  return StorageService;
}();

exports.default = StorageService;
