/* External Dependencies */
import moment from 'moment'
  
/**
 * Object to be used when the web storage is not available, e.g. in secret mode of Safari.
 */
let _tempStorage = {}

class StorageService {

  constructor(storage) {
    this.storageIsAvailable = false
    this.isInitialized = false
    this.storage = {}
    this.prefix = ''
    
    this._setStorage(storage)
  }
  
  
  /**********************************************
   * Public methods
   **********************************************/

  init(obj, prefix) {
    if (prefix) {
      this.setPrefix(prefix)
    }
    this.isInitialized = true // order matters. This should be preceded by any other setItem()s
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

    if (this.storageIsAvailable) {
      return this._cast(this.storage.getItem(concatenated))
    } else {
      return this._cast(_tempStorage[concatenated])
    }
  }

  set(key, val) {
    if (this.isInitialized === false) {
      return 'Storage is not initialized. Didn\'t you call .init() yet?'
    } else {
      let dashed = this._addDashInBetween(key)
      let concatenated = this._concat(this.prefix, dashed)
  
      if (this.storageIsAvailable) {
        this.storage.setItem(concatenated, val)
      } else {
        _tempStorage[concatenated] = val
      }
    }
  }

  getWithExpiration(key) {
    const time = this.get(`${key}-!#ExpirationTime#!`)
    if (time && (+moment().format('x') >= +time)) {
      this.set(key, this.get(`${key}-!#ExpirationValue#!`))
      this.set(`${key}-!#ExpirationTime#!`, 'null')
    }
    return this.get(key)
  }

  setWithExpiration(key, val, expirationTerm /* seconds */, valueAfterExpiration = 'null') {
    const expirationTime = +moment().format('x') + expirationTerm * 1000
    this.set(key, val)
    this.set(`${key}-!#ExpirationTime#!`, String(expirationTime))
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
      this.storage.setItem(`${this.prefix}-sanityChecked`, 'true')
      this.storageIsAvailable = true
    } catch(err) {
      this.storageIsAvailable = false
    }
  }

  _cast(val) {
    if (val === 'true' || val === 'false') {
      return this._stringToBoolean(val)
    } else if (val === 'null') {
      return this._stringToNull(val)
    } else if (val === 'undefined') {
      return this._stringToUnefined(val)
    } else {
      return val
    }
  }

  _concat(prefix, arr) {
    return `${prefix}-${arr}`
  }

  _setStorage(storage) {
    if (storage === 'local') {
      this.storage = window.localStorage
    } else if (storage === 'session') {
      this.storage = window.sessionStorage
    }
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

  _stringToNull(val) {
    if (val === 'null') {
      return null
    } else {
      return val
    }
  }
  
  _stringToUndefined(val) {
    if (val === 'undefined') {
      return undefined
    } else {
      return val
    }
  }
}

export default StorageService
