import { TrackSummary, TrackDetail, LocationPoint } from '../types/location'

const generatePoints = (date: string, count: number): LocationPoint[] => {
  const points: LocationPoint[] = []
  const baseLat = 39.9042
  const baseLng = 116.4074
  
  for (let i = 0; i < count; i++) {
    const hour = 8 + Math.floor(i * 12 / count)
    const minute = Math.floor(Math.random() * 60)
    points.push({
      id: `point_${date}_${i}`,
      latitude: baseLat + (Math.random() - 0.5) * 0.05,
      longitude: baseLng + (Math.random() - 0.5) * 0.05,
      address: `北京市朝阳区第${i + 1}号街道`,
      timestamp: `${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000Z`,
      battery: 30 + Math.floor(Math.random() * 70),
      accuracy: 5 + Math.floor(Math.random() * 20)
    })
  }
  return points.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export const mockTrackSummaries: TrackSummary[] = [
  {
    id: 'track_20240613',
    date: '2024-06-13',
    startTime: '2024-06-13T08:30:00.000Z',
    endTime: '2024-06-13T20:15:00.000Z',
    pointCount: 6,
    distance: 15800,
    startAddress: '北京市朝阳区望京SOHO',
    endAddress: '北京市朝阳区三里屯'
  },
  {
    id: 'track_20240612',
    date: '2024-06-12',
    startTime: '2024-06-12T07:45:00.000Z',
    endTime: '2024-06-12T22:00:00.000Z',
    pointCount: 12,
    distance: 25600,
    startAddress: '北京市海淀区中关村',
    endAddress: '北京市朝阳区望京'
  },
  {
    id: 'track_20240611',
    date: '2024-06-11',
    startTime: '2024-06-11T09:00:00.000Z',
    endTime: '2024-06-11T18:30:00.000Z',
    pointCount: 8,
    distance: 8900,
    startAddress: '北京市朝阳区国贸',
    endAddress: '北京市东城区王府井'
  },
  {
    id: 'track_20240610',
    date: '2024-06-10',
    startTime: '2024-06-10T08:00:00.000Z',
    endTime: '2024-06-10T21:00:00.000Z',
    pointCount: 10,
    distance: 32400,
    startAddress: '北京市西城区西单',
    endAddress: '北京市朝阳区CBD'
  },
  {
    id: 'track_20240609',
    date: '2024-06-09',
    startTime: '2024-06-09T10:30:00.000Z',
    endTime: '2024-06-09T19:45:00.000Z',
    pointCount: 5,
    distance: 5200,
    startAddress: '北京市丰台区北京西站',
    endAddress: '北京市海淀区五道口'
  },
  {
    id: 'track_20240608',
    date: '2024-06-08',
    startTime: '2024-06-08T07:30:00.000Z',
    endTime: '2024-06-08T23:10:00.000Z',
    pointCount: 15,
    distance: 42800,
    startAddress: '北京市通州区通州北苑',
    endAddress: '北京市昌平区回龙观'
  },
  {
    id: 'track_20240607',
    date: '2024-06-07',
    startTime: '2024-06-07T08:15:00.000Z',
    endTime: '2024-06-07T20:30:00.000Z',
    pointCount: 9,
    distance: 18500,
    startAddress: '北京市石景山区八角游乐园',
    endAddress: '北京市西城区金融街'
  }
]

export const getMockTrackDetail = (trackId: string): TrackDetail | null => {
  const summary = mockTrackSummaries.find(t => t.id === trackId)
  if (!summary) return null
  
  return {
    id: summary.id,
    date: summary.date,
    points: generatePoints(summary.date, summary.pointCount),
    distance: summary.distance,
    duration: (new Date(summary.endTime).getTime() - new Date(summary.startTime).getTime()) / 1000
  }
}
