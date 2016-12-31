/**
 * awesome-domstorage
 * Since Oct 2016.
 * @repository https://github.com/zoyi/awesome-domstorage
 * @npm https://www.npmjs.com/package/awesome-domstorage
 * Written by Engine enginehenryed@gmail.com, Luan luan@zoyi.co, Sean lsw9549@gmail.com
 */

import StorageService from './StorageService'

module.exports = {
  LocalStorage: new StorageService(window.localStorage),
  SessionStorage: new StorageService(window.sessionStorage)
}
