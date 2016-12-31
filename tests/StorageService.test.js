import 'mock-local-storage'
import { expect } from 'chai'
import StorageService from '../src/StorageService'

describe('StorageService', () => {
  const storageService = new StorageService(global.localStorage)

  it('test', () => {
    expect(true).to.eq(true)
  })
})