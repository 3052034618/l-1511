import { NotificationItem } from '../types/sos'

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'sos',
    title: 'SOS报警已触发',
    content: '您的紧急SOS报警已成功发送给5位紧急联系人',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'geofence',
    title: '安全区域提醒',
    content: '您已离开"家"安全区域',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: '位置同步成功',
    content: '您的位置信息已同步至服务器，电量75%',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: '4',
    type: 'warning',
    title: '低电量提醒',
    content: '当前电量低于20%，请注意及时充电',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: '5',
    type: 'geofence',
    title: '安全区域提醒',
    content: '您已到达"公司"安全区域',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: '6',
    type: 'info',
    title: '位置采集失败',
    content: '第1次位置采集失败，将在2小时后重试',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: '7',
    type: 'sos',
    title: 'SOS测试完成',
    content: '您的SOS功能测试已完成，所有联系人通知正常',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: '8',
    type: 'warning',
    title: '失踪预警',
    content: '连续2次位置采集失败，系统已触发失踪预警',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    read: true
  }
]
