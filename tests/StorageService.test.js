import 'mock-local-storage'
import { expect } from 'chai'
import StorageService from '../src/StorageService'

describe('StorageService', () => {
  const storageService = new StorageService(localStorage)

  it('should initialize key-values', () => {
    storageService.init({ foo: 'bar' })
    expect(localStorage.getItem('foo')).to.eq('bar')
  })

  it('should initialize key-values with additional prefix', () => {
    storageService.init({ foo: 'bar' }, 'prefix')
    expect(localStorage.getItem('prefix-foo')).to.eq('bar')
  })

  it('should set and get string value', () => {
    storageService.set('foo', 'barbar')
    expect(storageService.get('foo')).to.eq('barbar')
  })

  it('should set and get bool value', () => {
    storageService.set('foo', true)
    expect(storageService.get('foo')).to.eq(true)
    storageService.set('foo', false)
    expect(storageService.get('foo')).to.eq(false)
  })

  it('should set and get null', () => {
    storageService.set('foo', null)
    expect(storageService.get('foo')).to.eq(null)
  })

  it('should set and get undefined', () => {
    storageService.set('foo', undefined)
    expect(storageService.get('foo')).to.eq(undefined)
  })

  it('should set and get array key', () => {
    storageService.set(['foo', 'bar'], 'value')
    expect(storageService.get(['foo', 'bar'])).to.eq('value')
  })

  it('should store value only during expiration time', (done) => {
    storageService.setWithExpiration('key', 'value', 1, null)
    expect(storageService.getWithExpiration('key')).to.eq('value')
    setTimeout(() => {
      expect(storageService.getWithExpiration('key')).to.eq(null)
      done()
    }, 1500)
  })
})