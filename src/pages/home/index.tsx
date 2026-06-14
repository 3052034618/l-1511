import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SosButton from '../../components/SosButton'
import StatusBadge from '../../components/StatusBadge'
import { mockContacts } from '../../data/mockContacts'
import { getRelativeTime, formatBattery } from '../../utils/format'
import styles from './index.module.scss'

const HomePage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState('北京市朝阳区望京SOHO')
  const [batteryLevel, setBatteryLevel] = useState(75)
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toISOString())
  const [emergencyCount, setEmergencyCount] = useState(2)
  const [sosCountdown, setSosCountdown] = useState<number | null>(null)

  useEffect(() => {
    const emergencyContacts = mockContacts.filter(c => c.isEmergency)
    setEmergencyCount(emergencyContacts.length)
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = setInterval(() => {
        setSosCountdown(prev => {
          if (prev === null || prev <= 1) {
            if (timer) clearInterval(timer)
            triggerSOS()
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [sosCountdown])

  const handleSosClick = () => {
    if (sosCountdown !== null) {
      setSosCountdown(null)
      Taro.showToast({ title: '已取消SOS', icon: 'none' })
    } else {
      setSosCountdown(5)
    }
  }

  const triggerSOS = () => {
    console.log('[SOS] 触发紧急报警')
    Taro.showToast({ title: 'SOS已发送', icon: 'success' })
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/sos/index' })
    }, 500)
  }

  const handleRefresh = () => {
    setTimeout(() => {
      setLastUpdateTime(new Date().toISOString())
      Taro.stopPullDownRefresh()
      Taro.showToast({ title: '位置已更新', icon: 'none' })
    }, 1000)
  }

  const goToContacts = () => {
    Taro.switchTab({ url: '/pages/contacts/index' })
  }

  const goToSafeZones = () => {
    Taro.navigateTo({ url: '/pages/safe-zones/index' })
  }

  const goToTracks = () => {
    Taro.switchTab({ url: '/pages/tracks/index' })
  }

  const goToNotifications = () => {
    Taro.navigateTo({ url: '/pages/notifications/index' })
  }

  useEffect(() => {
    Taro.onPullDownRefresh(handleRefresh)
    return () => {
      Taro.offPullDownRefresh(handleRefresh)
    }
  }, [])

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.greeting}>你好，守护者</Text>
        <Text className={styles.subGreeting}>您的安全是我们的首要任务</Text>
      </View>

      <View className={styles.statusCard}>
        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${styles.success}`}>
            <Text>📍</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>当前位置</Text>
            <Text className={styles.statusValue}>{currentLocation}</Text>
          </View>
          <StatusBadge type="success" text="正常" showDot />
        </View>
        
        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${styles.info}`}>
            <Text>🔋</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>电量状态</Text>
            <Text className={styles.statusValue}>{formatBattery(batteryLevel)}</Text>
          </View>
          <StatusBadge 
            type={batteryLevel > 20 ? 'success' : 'warning'} 
            text={batteryLevel > 20 ? '充足' : '偏低'} 
            showDot 
          />
        </View>

        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${styles.success}`}>
            <Text>🛡️</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>位置同步</Text>
            <Text className={styles.statusValue}>已开启 · 每2小时</Text>
          </View>
          <StatusBadge type="info" text={getRelativeTime(lastUpdateTime)} />
        </View>

        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${styles.warning}`}>
            <Text>👥</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>紧急联系人</Text>
            <Text className={styles.statusValue}>{emergencyCount} 位已设置</Text>
          </View>
        </View>
      </View>

      <View className={styles.sosSection}>
        <Text className={styles.sosTitle}>紧急求助</Text>
        <SosButton 
          onClick={handleSosClick} 
          countdown={sosCountdown ?? undefined}
          isActive={sosCountdown !== null}
        />
        <Text className={styles.sosDesc}>
          长按或点击按钮5秒后将自动报警{'\n'}
          发送您的位置和10秒环境录音给所有紧急联系人
        </Text>
      </View>

      <View className={styles.quickActions}>
        <Text className={styles.sectionTitle}>快捷功能</Text>
        <View className={styles.actionGrid}>
          <View className={styles.actionItem} onClick={goToContacts}>
            <View className={`${styles.actionIcon} ${styles.primary}`}>
              <Text>👥</Text>
            </View>
            <Text className={styles.actionText}>紧急联系人</Text>
          </View>
          
          <View className={styles.actionItem} onClick={goToSafeZones}>
            <View className={`${styles.actionIcon} ${styles.success}`}>
              <Text>🏠</Text>
            </View>
            <Text className={styles.actionText}>安全区域</Text>
          </View>
          
          <View className={styles.actionItem} onClick={goToTracks}>
            <View className={`${styles.actionIcon} ${styles.warning}`}>
              <Text>📍</Text>
            </View>
            <Text className={styles.actionText}>历史轨迹</Text>
          </View>
          
          <View className={styles.actionItem} onClick={goToNotifications}>
            <View className={`${styles.actionIcon} ${styles.danger}`}>
              <Text>🔔</Text>
            </View>
            <Text className={styles.actionText}>通知中心</Text>
          </View>
        </View>
      </View>

      <View className={styles.tipSection}>
        <Text className={styles.tipTitle}>安全提示</Text>
        <Text className={styles.tipContent}>
          请确保已开启位置权限和通知权限，以便在紧急情况下能够及时获取您的位置信息并向紧急联系人发送警报。建议定期检查紧急联系人信息是否准确。
        </Text>
      </View>
    </ScrollView>
  )
}

export default HomePage
