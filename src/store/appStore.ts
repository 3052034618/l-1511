import { createStore } from 'zustand/vanilla'
import Taro from '@tarojs/taro'
import { Contact, ContactPermission } from '../types/contact'
import { SafeZone, SafeZoneType } from '../types/safeZone'
import { NotificationItem } from '../types/sos'
import { TrackSummary } from '../types/location'
import { mockContacts } from '../data/mockContacts'
import { mockSafeZones } from '../data/mockSafeZones'
import { mockNotifications } from '../data/mockNotifications'
import { mockTrackSummaries } from '../data/mockTracks'

const STORAGE_KEYS = {
  CONTACTS: 'safety_contacts',
  SAFE_ZONES: 'safety_zones',
  NOTIFICATIONS: 'safety_notifications',
  LOCATION_FAIL_COUNT: 'safety_location_fail_count',
  PRESET_PHONE: 'safety_preset_phone'
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = Taro.getStorageSync(key)
    if (raw) return JSON.parse(raw) as T
  } catch (e) {
    console.error('[Store] load error:', key, e)
  }
  return fallback
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    Taro.setStorageSync(key, JSON.stringify(data))
  } catch (e) {
    console.error('[Store] save error:', key, e)
  }
}

export interface AppState {
  contacts: Contact[]
  safeZones: SafeZone[]
  notifications: NotificationItem[]
  trackSummaries: TrackSummary[]
  locationFailCount: number
  presetPhone: string
  currentLocation: { address: string; latitude: number; longitude: number }
  batteryLevel: number
  lastLocationUpdate: string

  addContact: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact
  updateContact: (id: string, data: Partial<Contact>) => void
  deleteContact: (id: string) => void
  getContacts: () => Contact[]

  addSafeZone: (data: Omit<SafeZone, 'id' | 'createdAt'>) => SafeZone
  updateSafeZone: (id: string, data: Partial<SafeZone>) => void
  deleteSafeZone: (id: string) => void

  addNotification: (n: Omit<NotificationItem, 'id'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  incrementLocationFail: () => void
  resetLocationFail: () => void
  updateLocation: (loc: { address: string; latitude: number; longitude: number }) => void
  updateBattery: (level: number) => void
  setPresetPhone: (phone: string) => void
}

export const appStore = createStore<AppState>((set, get) => ({
  contacts: loadFromStorage<Contact[]>(STORAGE_KEYS.CONTACTS, mockContacts),
  safeZones: loadFromStorage<SafeZone[]>(STORAGE_KEYS.SAFE_ZONES, mockSafeZones),
  notifications: loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, mockNotifications),
  trackSummaries: mockTrackSummaries,
  locationFailCount: loadFromStorage<number>(STORAGE_KEYS.LOCATION_FAIL_COUNT, 0),
  presetPhone: loadFromStorage<string>(STORAGE_KEYS.PRESET_PHONE, '110'),
  currentLocation: { address: '北京市朝阳区望京SOHO', latitude: 39.9042, longitude: 116.4074 },
  batteryLevel: 75,
  lastLocationUpdate: new Date().toISOString(),

  addContact: (data) => {
    const now = new Date().toISOString()
    const contact: Contact = { ...data, id: `c_${Date.now()}`, createdAt: now, updatedAt: now }
    set(state => {
      const contacts = [...state.contacts, contact]
      saveToStorage(STORAGE_KEYS.CONTACTS, contacts)
      return { contacts }
    })
    return contact
  },

  updateContact: (id, data) => {
    set(state => {
      const contacts = state.contacts.map(c =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      )
      saveToStorage(STORAGE_KEYS.CONTACTS, contacts)
      return { contacts }
    })
  },

  deleteContact: (id) => {
    set(state => {
      const contacts = state.contacts.filter(c => c.id !== id)
      saveToStorage(STORAGE_KEYS.CONTACTS, contacts)
      return { contacts }
    })
  },

  getContacts: () => get().contacts,

  addSafeZone: (data) => {
    const zone: SafeZone = { ...data, id: `z_${Date.now()}`, createdAt: new Date().toISOString() }
    set(state => {
      const safeZones = [...state.safeZones, zone]
      saveToStorage(STORAGE_KEYS.SAFE_ZONES, safeZones)
      return { safeZones }
    })
    return zone
  },

  updateSafeZone: (id, data) => {
    set(state => {
      const safeZones = state.safeZones.map(z =>
        z.id === id ? { ...z, ...data } : z
      )
      saveToStorage(STORAGE_KEYS.SAFE_ZONES, safeZones)
      return { safeZones }
    })
  },

  deleteSafeZone: (id) => {
    set(state => {
      const safeZones = state.safeZones.filter(z => z.id !== id)
      saveToStorage(STORAGE_KEYS.SAFE_ZONES, safeZones)
      return { safeZones }
    })
  },

  addNotification: (n) => {
    const notification: NotificationItem = { ...n, id: `n_${Date.now()}` }
    set(state => {
      const notifications = [notification, ...state.notifications]
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
      return { notifications }
    })
  },

  markNotificationRead: (id) => {
    set(state => {
      const notifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
      return { notifications }
    })
  },

  markAllNotificationsRead: () => {
    set(state => {
      const notifications = state.notifications.map(n => ({ ...n, read: true }))
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
      return { notifications }
    })
  },

  incrementLocationFail: () => {
    set(state => {
      const newCount = state.locationFailCount + 1
      saveToStorage(STORAGE_KEYS.LOCATION_FAIL_COUNT, newCount)
      if (newCount >= 2) {
        const notification: Omit<NotificationItem, 'id'> = {
          type: 'warning',
          title: '失踪预警',
          content: `连续${newCount}次位置采集失败，系统已触发失踪预警，已通知所有联系人和平台客服`,
          timestamp: new Date().toISOString(),
          read: false
        }
        const fullNotification: NotificationItem = { ...notification, id: `n_${Date.now()}` }
        const notifications = [fullNotification, ...state.notifications]
        saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
        return { locationFailCount: newCount, notifications }
      }
      return { locationFailCount: newCount }
    })
  },

  resetLocationFail: () => {
    set(() => {
      saveToStorage(STORAGE_KEYS.LOCATION_FAIL_COUNT, 0)
      return { locationFailCount: 0 }
    })
  },

  updateLocation: (loc) => {
    set(() => ({
      currentLocation: loc,
      lastLocationUpdate: new Date().toISOString()
    }))
  },

  updateBattery: (level) => {
    set(() => ({ batteryLevel: level }))
  },

  setPresetPhone: (phone) => {
    set(() => {
      saveToStorage(STORAGE_KEYS.PRESET_PHONE, phone)
      return { presetPhone: phone }
    })
  }
}))

export function useStore<T>(selector: (state: AppState) => T): T {
  const [value, setValue] = React.useState(() => selector(appStore.getState()))
  React.useEffect(() => {
    const unsub = appStore.subscribe(state => setValue(selector(state)))
    return unsub
  }, [])
  return value
}

import React from 'react'
