export enum SosStatus {
  IDLE = 'idle',
  COUNTDOWN = 'countdown',
  ACTIVE = 'active',
  RESOLVED = 'resolved'
}

export interface SosRecord {
  id: string
  status: SosStatus
  startTime: string
  endTime?: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  audioUrl?: string
  audioDuration?: number
  notifiedContacts: string[]
  isFake?: boolean
}

export interface NotificationItem {
  id: string
  type: 'sos' | 'warning' | 'info' | 'geofence'
  title: string
  content: string
  timestamp: string
  read: boolean
  relatedId?: string
}
