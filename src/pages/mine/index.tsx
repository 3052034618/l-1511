import React, { useState } from 'react'
import { View, Text, Switch, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockContacts } from '../../data/mockContacts'
import { mockSafeZones } from '../../data/mockSafeZones'
import { formatPhoneDisplay } from '../../utils/validator'
import styles from './index.module.scss'

const MinePage: React.FC = () => {
  const [autoLocation, setAutoLocation] = useState(true)
  const [batteryMonitor, setBatteryMonitor] = useState(true)
  const [notification, setNotification] = useState(true)

  const emergencyCount = mockContacts.filter(c => c.isEmergency).length
  const safeZoneCount = mockSafeZones.length

  const goToSafeZones = () => {
    Taro.navigateTo({ url: '/pages/safe-zones/index' })
  }

  const goToNotifications = () => {
    Taro.navigateTo({ url: '/pages/notifications/index' })
  }

  const goToContactEdit = () => {
    Taro.navigateTo({ url: '/pages/contact-edit/index' })
  }

  const handleAutoLocationChange = (value: boolean) => {
    setAutoLocation(value)
    console.log('[Settings] 自动位置采集:', value)
  }

  const handleBatteryMonitorChange = (value: boolean) => {
    setBatteryMonitor(value)
    console.log('[Settings] 电量监控:', value)
  }

  const handleNotificationChange = (value: boolean) => {
    setNotification(value)
    console.log('[Settings] 通知开关:', value)
  }

  const handleAbout = () => {
    Taro.showModal({
      title: '关于安全守护',
      content: '安全守护 v1.0.0\n\n一款专注于个人安全防护的应用，为您和家人提供全方位的安全保障。',
      showCancel: false
    })
  }

  const handleHelp = () => {
    Taro.showModal({
      title: '帮助中心',
      content: '常见问题：\n1. 如何添加紧急联系人？\n2. SOS报警如何使用？\n3. 安全区域如何设置？\n\n如需更多帮助，请联系客服。',
      showCancel: false
    })
  }

  const handleClearData = () => {
    Taro.showModal({
      title: '清除数据',
      content: '确定要清除所有本地数据吗？此操作不可恢复。',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          console.log('[Settings] 清除数据')
          Taro.showToast({ title: '已清除', icon: 'success' })
        }
      }
    })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>李</Text>
          </View>
          <View className={styles.userDetails}>
            <Text className={styles.userName}>李小明</Text>
            <Text className={styles.userPhone}>{formatPhoneDisplay('13800138000')}</Text>
          </View>
        </View>

        <View className={styles.statusCard}>
          <View className={styles.statusItem}>
            <Text className={styles.statusNumber}>{emergencyCount}</Text>
            <Text className={styles.statusLabel}>紧急联系人</Text>
          </View>
          <View className={styles.statusItem}>
            <Text className={styles.statusNumber}>{safeZoneCount}</Text>
            <Text className={styles.statusLabel}>安全区域</Text>
          </View>
          <View className={styles.statusItem}>
            <Text className={styles.statusNumber}>7</Text>
            <Text className={styles.statusLabel}>守护天数</Text>
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>安全设置</Text>
      <View className={styles.section}>
        <View className={styles.menuItem} onClick={goToSafeZones}>
          <View className={`${styles.menuIcon} ${styles.success}`}>
            <Text>🏠</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>安全区域管理</Text>
          </View>
          <View className={styles.menuRight}>
            <Text className={styles.menuRightText}>{safeZoneCount}个区域</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>

        <View className={styles.menuItem}>
          <View className={`${styles.menuIcon} ${styles.primary}`}>
            <Text>📍</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>自动位置采集</Text>
          </View>
          <View className={styles.menuRight}>
            <Switch
              className={styles.switch}
              checked={autoLocation}
              color='#165dff'
              onChange={(e) => handleAutoLocationChange(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.menuItem}>
          <View className={`${styles.menuIcon} ${styles.info}`}>
            <Text>🔋</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>电量监控</Text>
          </View>
          <View className={styles.menuRight}>
            <Switch
              className={styles.switch}
              checked={batteryMonitor}
              color='#165dff'
              onChange={(e) => handleBatteryMonitorChange(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.menuItem}>
          <View className={`${styles.menuIcon} ${styles.warning}`}>
            <Text>🔔</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>消息通知</Text>
          </View>
          <View className={styles.menuRight}>
            <Switch
              className={styles.switch}
              checked={notification}
              color='#165dff'
              onChange={(e) => handleNotificationChange(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>其他</Text>
      <View className={styles.section}>
        <View className={styles.menuItem} onClick={goToNotifications}>
          <View className={`${styles.menuIcon} ${styles.danger}`}>
            <Text>📋</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>通知记录</Text>
          </View>
          <View className={styles.menuRight}>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>

        <View className={styles.menuItem} onClick={handleHelp}>
          <View className={`${styles.menuIcon} ${styles.primary}`}>
            <Text>❓</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>帮助中心</Text>
          </View>
          <View className={styles.menuRight}>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>

        <View className={styles.menuItem} onClick={handleAbout}>
          <View className={`${styles.menuIcon} ${styles.success}`}>
            <Text>ℹ️</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>关于我们</Text>
          </View>
          <View className={styles.menuRight}>
            <Text className={styles.menuRightText}>v1.0.0</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.menuItem} onClick={handleClearData}>
          <View className={`${styles.menuIcon} ${styles.warning}`}>
            <Text>🗑️</Text>
          </View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>清除缓存数据</Text>
          </View>
          <View className={styles.menuRight}>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <Text className={styles.version}>安全守护 v1.0.0</Text>
    </ScrollView>
  )
}

export default MinePage
