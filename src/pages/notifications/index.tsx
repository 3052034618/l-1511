import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import { NotificationItem } from '../../types/sos'
import { appStore } from '../../store/appStore'
import { getRelativeTime } from '../../utils/format'
import styles from './index.module.scss'

type TabType = 'all' | 'sos' | 'warning' | 'info'

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useDidShow(() => {
    setNotifications([...appStore.getState().notifications])
  })

  const getFilteredNotifications = (): NotificationItem[] => {
    if (activeTab === 'all') return notifications
    return notifications.filter(n => n.type === activeTab)
  }

  const getUnreadCount = (type?: TabType): number => {
    if (type === 'all') return notifications.filter(n => !n.read).length
    if (type) return notifications.filter(n => n.type === type && !n.read).length
    return 0
  }

  const tabs = [
    { key: 'all' as TabType, label: '全部' },
    { key: 'sos' as TabType, label: 'SOS' },
    { key: 'warning' as TabType, label: '预警' },
    { key: 'info' as TabType, label: '系统' }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sos': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      case 'geofence': return '📍'
      default: return '📋'
    }
  }

  const handleItemClick = (item: NotificationItem) => {
    console.log('[Notifications] 点击通知:', item.id)
    appStore.getState().markNotificationRead(item.id)
    setNotifications([...appStore.getState().notifications])

    if (item.type === 'sos') {
      Taro.navigateTo({ url: '/pages/sos/index' })
    } else if (item.type === 'geofence') {
      Taro.navigateTo({ url: '/pages/safe-zones/index' })
    }
  }

  const handleMarkAllRead = () => {
    appStore.getState().markAllNotificationsRead()
    setNotifications([...appStore.getState().notifications])
    Taro.showToast({ title: '已全部标为已读', icon: 'none' })
  }

  const filtered = getFilteredNotifications()

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(
              styles.tabItem,
              activeTab === tab.key && styles.active
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
            {getUnreadCount(tab.key) > 0 && (
              <View className={styles.tabBadge}>
                {getUnreadCount(tab.key)}
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.headerActions}>
        {getUnreadCount('all') > 0 && (
          <Text className={styles.markAllBtn} onClick={handleMarkAllRead}>
            全部标为已读
          </Text>
        )}
      </View>

      <ScrollView scrollY>
        {filtered.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔔</Text>
            <Text className={styles.emptyText}>暂无通知</Text>
            <Text className={styles.emptyHint}>
              有新的通知会显示在这里
            </Text>
          </View>
        ) : (
          <View className={styles.notificationList}>
            {filtered.map(item => (
              <View
                key={item.id}
                className={classnames(
                  styles.notificationItem,
                  !item.read && styles.unread
                )}
                onClick={() => handleItemClick(item)}
              >
                <View className={styles.notificationHeader}>
                  <View className={classnames(
                    styles.notificationIcon,
                    styles[item.type] || styles.info
                  )}>
                    <Text>{getNotificationIcon(item.type)}</Text>
                  </View>
                  <Text className={styles.notificationTitle}>
                    {item.title}
                  </Text>
                </View>
                <Text className={styles.notificationContent}>
                  {item.content}
                </Text>
                <Text className={styles.notificationTime}>
                  {getRelativeTime(item.timestamp)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default NotificationsPage
