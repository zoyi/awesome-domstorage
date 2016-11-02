/**
 * LocalStorageService provides an abstraction for Web storage (Dom storage) of a web browser.
 * The difference with SessionStorageService is the storage handled.
 *
 * Knowing that Web Storage is of only a single layer structure, this service
 * helps nested structuring of key-value pairs by filling dashes in-between.
 *
 * e.g. You might want to have a structure like the following,
 *      {'key1': {
 *         'foo': 'false',
 *         'bar': 'true'
 *       },
*        'messenger': {
 *         ...
 *       }
 *       ...
 *      }
 *
 * In this case, 'foo' of 'key1' becomes 'key1-foo' with value 'false'.
 * Note that Web Storage can only have string value NOT boolean. However,
 * 'false' (string) becomes false (boolean) by calling stringToBoolean().
 *
 * In case where the Web Storage cannot be used, this service generates
 * its own temporary storage object to store the configuration. Temporary storage
 * expires every time the web page is refreshed, though.
 *
 * setPrefix() to set prefix for each key in order to avoid potential conflicts.
 * e.g. Using the aforementioned example, 'key1-foo' is prefixed with 'myApp'
 *       'myApp-key1-foo' = false
 *       ...
 *
 * Since Oct 2016.
 * Written by Engine enginehenryed@gmail.com, Luan luan@zoyi.co, Sean sean@zoyi.co
 */

import moment from 'moment'


/**
 * Object to be used when the web storage is not available, e.g. secret mode in Safari.
 */
let _tempStorage = {}

class LocalStorageService {

  constructor() {
    this.isEnabled = false
    this.prefix = ''
  }

  /**********************************************
   * Public methods
   **********************************************/

  init(obj, prefix) {
    if (prefix) {
      this.setPrefix(prefix)
    }
  
    this._checkSanity()

    for (let i in obj) {
      if (!this.get(i)) {
        this.set(i, obj[i])
      }
    }
  }
  
  setPrefix(prefix) {
    this.prefix = prefix
  }

  get(key) {
    let dashed = this._addDashInBetween(key)
    let concatenated = this._concat(this.prefix, dashed)

    if (this.isEnabled) {
      return this._stringToBoolean(window.localStorage.getItem(concatenated))
    } else {
      return this._stringToBoolean(_tempStorage[concatenated])
    }
  }

  set(key, val) {
    let dashed = this._addDashInBetween(key)
    let concatenated = this._concat(this.prefix, dashed)

    if (this.isEnabled) {
      window.localStorage.setItem(concatenated, val)
    } else {
      _tempStorage[concatenated] = val
    }
  }

  getWithExpiration(key) {
    const time = this.get(`${key}-!#ExpirationTime#!`)
    if (time && (Number(time) >= Number(moment().format('x')))) {
      this.set(key, this.get(`${key}-!#ExpirationValue#!`))
      this.set(`${key}-!#ExpirationTime#!`, 'null')
    }
    return this.get(key)
  }

  setWithExpiration(key, val, expirationTime, valueAfterExpiration = 'null') {
    this.set(key, val)
    this.set(`${key}-!#ExpirationTime#!`, expirationTime)
    this.set(`${key}-!#ExpirationValue#!`, valueAfterExpiration)
  }


  /**********************************************
   * Private methods
   **********************************************/

  _addDashInBetween(key) {
    if (Array.isArray(key)) {
      let ret = key[0];
      for (let i = 1; i < key.length; i++) {
        ret += '-'
        ret += key[i]
      }
      return ret
    } else {
      return key
    }
  }

  /**
   * Check to see if the web storage is able to be used.
   */
  _checkSanity() {
    try {
      window.localStorage.setItem(`${this.prefix}-sanityChecked`, 'true')
      this.isEnabled = true
    } catch(err) {
      this.isEnabled = false
    }
  }

  _concat(prefix, arr) {
    return `${prefix}-${arr}`
  }

  _stringToBoolean(val) {
    if (val === 'true') {
      return true
    } else if (val === 'false') {
      return false
    } else {
      return val
    }
  }

}

export default new LocalStorageService()
