export enum SafeZoneType {
  HOME = 'home',
  WORK = 'work',
  SCHOOL = 'school',
  CUSTOM = 'custom'
}

export interface SafeZone {
  id: string
  name: string
  type: SafeZoneType
  latitude: number
  longitude: number
  radius: number
  address?: string
  notifyOnEnter: boolean
  notifyOnLeave: boolean
  createdAt: string
}

export const SafeZoneTypeText: Record<SafeZoneType, string> = {
  [SafeZoneType.HOME]: '家',
  [SafeZoneType.WORK]: '公司',
  [SafeZoneType.SCHOOL]: '学校',
  [SafeZoneType.CUSTOM]: '自定义'
}
