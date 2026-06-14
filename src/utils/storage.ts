import Taro from '@tarojs/taro'

const STORAGE_KEYS = {
  CONTACTS: 'safety_contacts',
  SAFE_ZONES: 'safety_zones',
  SOS_STATUS: 'sos_status',
  USER_SETTINGS: 'user_settings'
}

export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const value = Taro.getStorageSync(key)
    return value ? (JSON.parse(value) as T) : defaultValue
  } catch (error) {
    console.error('[Storage] get error:', error)
    return defaultValue
  }
}

export const setStorage = <T>(key: string, value: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value))
  } catch (error) {
    console.error('[Storage] set error:', error)
  }
}

export const removeStorage = (key: string): void => {
  try {
    Taro.removeStorageSync(key)
  } catch (error) {
    console.error('[Storage] remove error:', error)
  }
}

export { STORAGE_KEYS }
