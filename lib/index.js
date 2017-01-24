'use strict';

var _StorageService = require('./StorageService');

var _StorageService2 = _interopRequireDefault(_StorageService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  LocalStorage: new _StorageService2.default(window.localStorage),
  SessionStorage: new _StorageService2.default(window.sessionStorage)
};