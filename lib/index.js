'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionStorage = exports.LocalStorage = undefined;

var _LocalStorageService = require('./LocalStorageService');

var _LocalStorageService2 = _interopRequireDefault(_LocalStorageService);

var _SessionStorageService = require('./SessionStorageService');

var _SessionStorageService2 = _interopRequireDefault(_SessionStorageService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.LocalStorage = _LocalStorageService2.default;
exports.SessionStorage = _SessionStorageService2.default;