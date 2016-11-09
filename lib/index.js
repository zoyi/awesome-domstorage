'use strict';

var _StorageService = require('./StorageService');

var _StorageService2 = _interopRequireDefault(_StorageService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  LocalStorage: new _StorageService2.default('local'),
  SessionStorage: new _StorageService2.default('session')
};