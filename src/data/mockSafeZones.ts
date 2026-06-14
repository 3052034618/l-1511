import { SafeZone, SafeZoneType } from '../types/safeZone'

export const mockSafeZones: SafeZone[] = [
  {
    id: '1',
    name: '家',
    type: SafeZoneType.HOME,
    latitude: 39.9042,
    longitude: 116.4074,
    radius: 200,
    address: '北京市朝阳区望京SOHO附近',
    notifyOnEnter: true,
    notifyOnLeave: true,
    createdAt: '2024-01-10T08:00:00.000Z'
  },
  {
    id: '2',
    name: '公司',
    type: SafeZoneType.WORK,
    latitude: 39.9142,
    longitude: 116.4174,
    radius: 300,
    address: '北京市朝阳区国贸中心',
    notifyOnEnter: true,
    notifyOnLeave: false,
    createdAt: '2024-01-15T09:30:00.000Z'
  },
  {
    id: '3',
    name: '学校',
    type: SafeZoneType.SCHOOL,
    latitude: 39.9242,
    longitude: 116.4274,
    radius: 500,
    address: '北京市海淀区中关村大街1号',
    notifyOnEnter: true,
    notifyOnLeave: true,
    createdAt: '2024-02-20T10:00:00.000Z'
  }
]
