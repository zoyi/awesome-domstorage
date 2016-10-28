/**
 * LocalStorageService provides an abstraction for Web storage (Dom storage) of a web browser.
 * The difference with SessionStorageService is the storage handled.
 *
 * _init has all the key-value pairs that should be initialized at application loading.
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
 * NAME is prefixed for each key in order to avoid potential conflicts.
 * e.g. Using the aforementioned example, 'key1-foo' is prefixed with 'myApp'
 *       'myApp-key1-foo' = false
 *       ...
 *
 * Since Oct 2016.
 * Worked by Engine engine@zoyi.co Luan luan@zoyi.co, Sean sean@zoyi.co
 */

import moment from 'moment'

/**
 * Name of the wrapper, used in order to avoid collision in namespace.
 */
const NAME = 'ch-plugin'

/**
 * Object to be used when the web storage is not available, e.g. secret mode in Safari.
 */
let _tempStorage = {}

class LocalStorageService {

  constructor() {
    this.isEnabled = false
    this._checkSanity()
  }

  /**********************************************
   * Public methods
   **********************************************/

  init(obj) {
    for (let i in obj) {
      if (!this.get(i)) {
        this.set(i, obj[i])
      }
    }
  }

  get(key) {
    let dashed = this._addDashInBetween(key)
    let concatenated = this._concat(NAME, dashed)

    if (this.isEnabled) {
      return this._stringToBoolean(window.localStorage.getItem(concatenated))
    } else {
      return this._stringToBoolean(_tempStorage[concatenated])
    }
  }

  set(key, val) {
    let dashed = this._addDashInBetween(key)
    let concatenated = this._concat(NAME, dashed)

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
      window.localStorage.setItem(`${NAME}-sanityChecked`, 'true')
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
