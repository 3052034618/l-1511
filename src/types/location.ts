export interface LocationPoint {
  id: string
  latitude: number
  longitude: number
  address?: string
  timestamp: string
  battery: number
  accuracy?: number
}

export interface TrackSummary {
  id: string
  date: string
  startTime: string
  endTime: string
  pointCount: number
  distance: number
  startAddress?: string
  endAddress?: string
}

export interface TrackDetail {
  id: string
  date: string
  points: LocationPoint[]
  distance: number
  duration: number
}

export interface GeoFenceEvent {
  id: string
  zoneId: string
  zoneName: string
  type: 'enter' | 'leave'
  timestamp: string
  location: LocationPoint
}
