import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import SosButton from '../../components/SosButton'
import StatusBadge from '../../components/StatusBadge'
import { appStore } from '../../store/appStore'
import { getRelativeTime, formatBattery } from '../../utils/format'
import styles from './index.module.scss'

const COLLECTION_INTERVAL = 15 * 1000
const FAIL_CHANCE = 0.15

const HomePage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState('加载中...')
  const [batteryLevel, setBatteryLevel] = useState(75)
  const [lastUpdateTime, setLastUpdateTime] = useState('')
  const [emergencyCount, setEmergencyCount] = useState(0)
  const [sosCountdown, setSosCountdown] = useState<number | null>(null)
  const [isCollecting, setIsCollecting] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'success' | 'warning' | 'error'>('success')
  const [failCount, setFailCount] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sosTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isVisible = useRef(true)

  const doCollect = useCallback(() => {
    setIsCollecting(true)
    const failed = Math.random() < FAIL_CHANCE

    setTimeout(() => {
      if (!isVisible.current) {
        setIsCollecting(false)
        return
      }

      if (failed) {
        const newFailCount = failCount + 1
        setFailCount(newFailCount)
        setLocationStatus('error')
        setCurrentLocation('采集失败')
        console.log('[Home] 位置采集失败，累计失败次数:', newFailCount)
        appStore.getState().incrementLocationFail()

        if (newFailCount >= 2) {
          console.log('[Home] 触发失踪预警')
          Taro.showModal({
            title: '失踪预警',
            content: '连续2次位置采集失败，系统已触发失踪预警并通知所有联系人和平台客服。',
            showCancel: false,
            confirmColor: '#f53f3f'
          })
        }
      } else {
        setFailCount(0)
        appStore.getState().resetLocationFail()
        setLocationStatus('success')
        const locations = [
          '北京市朝阳区望京SOHO',
          '北京市朝阳区国贸中心',
          '北京市海淀区中关村',
          '北京市东城区王府井',
          '北京市西城区金融街'
        ]
        const loc = locations[Math.floor(Math.random() * locations.length)]
        setCurrentLocation(loc)
        const battery = 30 + Math.floor(Math.random() * 70)
        setBatteryLevel(battery)
        appStore.getState().updateLocation({
          address: loc,
          latitude: 39.9042 + (Math.random() - 0.5) * 0.05,
          longitude: 116.4074 + (Math.random() - 0.5) * 0.05
        })
        appStore.getState().updateBattery(battery)
      }

      setLastUpdateTime(new Date().toISOString())
      setIsCollecting(false)
    }, 800)
  }, [failCount])

  useDidShow(() => {
    isVisible.current = true
    const state = appStore.getState()
    setEmergencyCount(state.contacts.filter(c => c.isEmergency).length)
    setCurrentLocation(state.currentLocation.address)
    setBatteryLevel(state.batteryLevel)
    setLastUpdateTime(state.lastLocationUpdate)
    setFailCount(state.locationFailCount)
    if (state.locationFailCount > 0) {
      setLocationStatus('warning')
    }

    doCollect()
    timerRef.current = setInterval(doCollect, COLLECTION_INTERVAL)
  })

  useDidHide(() => {
    isVisible.current = false
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  })

  useEffect(() => {
    if (sosCountdown !== null && sosCountdown > 0) {
      sosTimerRef.current = setInterval(() => {
        setSosCountdown(prev => {
          if (prev === null || prev <= 1) {
            if (sosTimerRef.current) clearInterval(sosTimerRef.current)
            triggerSOS()
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (sosTimerRef.current) clearInterval(sosTimerRef.current)
    }
  }, [sosCountdown])

  const handleSosClick = () => {
    if (sosCountdown !== null) {
      setSosCountdown(null)
      if (sosTimerRef.current) clearInterval(sosTimerRef.current)
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
    doCollect()
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  useEffect(() => {
    Taro.onPullDownRefresh(handleRefresh)
    return () => {
      Taro.offPullDownRefresh(handleRefresh)
    }
  }, [])

  const goToContacts = () => Taro.switchTab({ url: '/pages/contacts/index' })
  const goToSafeZones = () => Taro.navigateTo({ url: '/pages/safe-zones/index' })
  const goToTracks = () => Taro.switchTab({ url: '/pages/tracks/index' })
  const goToNotifications = () => Taro.navigateTo({ url: '/pages/notifications/index' })

  const locationBadgeText = locationStatus === 'success' ? '正常' : locationStatus === 'warning' ? '异常' : '失败'
  const batteryBadgeType = batteryLevel > 20 ? 'success' : 'warning'
  const batteryBadgeText = batteryLevel > 20 ? '充足' : '偏低'

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.greeting}>你好，守护者</Text>
        <Text className={styles.subGreeting}>您的安全是我们的首要任务</Text>
      </View>

      <View className={styles.statusCard}>
        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${locationStatus === 'success' ? styles.success : styles.warning}`}>
            <Text>📍</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>当前位置</Text>
            <Text className={styles.statusValue}>{currentLocation}</Text>
          </View>
          <StatusBadge type={locationStatus} text={locationBadgeText} showDot />
        </View>

        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${styles.info}`}>
            <Text>🔋</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>电量状态</Text>
            <Text className={styles.statusValue}>{formatBattery(batteryLevel)}</Text>
          </View>
          <StatusBadge type={batteryBadgeType} text={batteryBadgeText} showDot />
        </View>

        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${isCollecting ? styles.warning : styles.success}`}>
            <Text>🛡️</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>位置同步</Text>
            <Text className={styles.statusValue}>
              {isCollecting ? '采集中...' : `已开启 · 每15秒`}
            </Text>
          </View>
          <StatusBadge
            type={isCollecting ? 'warning' : 'info'}
            text={lastUpdateTime ? getRelativeTime(lastUpdateTime) : '--'}
          />
        </View>

        <View className={styles.statusRow}>
          <View className={`${styles.statusIcon} ${failCount >= 2 ? styles.warning : styles.success}`}>
            <Text>⚠️</Text>
          </View>
          <View className={styles.statusInfo}>
            <Text className={styles.statusLabel}>采集状态</Text>
            <Text className={styles.statusValue}>
              连续失败 {failCount} 次{failCount >= 2 ? ' · 已触发预警' : ''}
            </Text>
          </View>
          <StatusBadge
            type={failCount >= 2 ? 'error' : 'success'}
            text={failCount >= 2 ? '预警' : '正常'}
            showDot
          />
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
          点击按钮5秒后将自动报警{'\n'}
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
          系统每15秒自动采集一次位置和电量信息。连续2次采集失败将触发失踪预警并通知所有联系人和平台客服。建议保持网络畅通和定位权限开启。
        </Text>
      </View>
    </ScrollView>
  )
}

export default HomePage
