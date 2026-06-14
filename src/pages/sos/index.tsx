import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Contact } from '../../types/contact'
import { appStore } from '../../store/appStore'
import { formatPhoneDisplay } from '../../utils/validator'
import styles from './index.module.scss'

const SosPage: React.FC = () => {
  const [isActive, setIsActive] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [recordingCountdown, setRecordingCountdown] = useState(10)
  const [isRecording, setIsRecording] = useState(true)
  const [location, setLocation] = useState({
    address: '获取中...',
    latitude: 0,
    longitude: 0
  })
  const [allContacts, setAllContacts] = useState<Contact[]>([])
  const [presetPhone, setPresetPhone] = useState('110')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const state = appStore.getState()
    setAllContacts(state.contacts)
    setPresetPhone(state.presetPhone)
    setLocation({
      address: state.currentLocation.address,
      latitude: state.currentLocation.latitude,
      longitude: state.currentLocation.longitude
    })
  }, [])

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive])

  useEffect(() => {
    if (isRecording && recordingCountdown > 0) {
      recordTimerRef.current = setInterval(() => {
        setRecordingCountdown(prev => {
          if (prev <= 1) {
            if (recordTimerRef.current) clearInterval(recordTimerRef.current)
            setIsRecording(false)
            console.log('[SOS] 录音完成，时长10秒')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current)
    }
  }, [isRecording, recordingCountdown])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const addSosNotification = (title: string, content: string) => {
    appStore.getState().addNotification({
      type: 'sos',
      title,
      content,
      timestamp: new Date().toISOString(),
      read: false
    })
  }

  const handleCancel = () => {
    Taro.showModal({
      title: '取消报警',
      content: '确定要取消本次SOS报警吗？',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          setIsActive(false)
          if (timerRef.current) clearInterval(timerRef.current)
          if (recordTimerRef.current) clearInterval(recordTimerRef.current)
          addSosNotification(
            'SOS报警已取消',
            `报警已取消，持续时长${formatTime(elapsedTime)}。位置：${location.address}。`
          )
          console.log('[SOS] 取消报警')
          Taro.showToast({ title: '已取消', icon: 'none' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 800)
        }
      }
    })
  }

  const handleEndAlarm = () => {
    Taro.showModal({
      title: '结束报警',
      content: '确定要结束本次SOS报警吗？系统将通知所有联系人报警已解除。',
      confirmText: '结束',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          setIsActive(false)
          if (timerRef.current) clearInterval(timerRef.current)
          if (recordTimerRef.current) clearInterval(recordTimerRef.current)
          addSosNotification(
            'SOS报警已解除',
            `报警已解除，持续时长${formatTime(elapsedTime)}。位置：${location.address}。已通知所有联系人和预设电话${presetPhone}。`
          )
          console.log('[SOS] 结束报警')
          Taro.showToast({ title: '已通知联系人', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 800)
        }
      }
    })
  }

  const handleCallContact = (contact: Contact) => {
    Taro.makePhoneCall({
      phoneNumber: contact.phone,
      fail: (err) => {
        console.error('[SOS] 拨打电话失败:', err)
      }
    })
  }

  const handleCallPreset = () => {
    Taro.makePhoneCall({
      phoneNumber: presetPhone,
      fail: (err) => {
        console.error('[SOS] 拨打预设电话失败:', err)
      }
    })
  }

  const notifiedCount = allContacts.length + 1

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.sosContainer}>
        <View className={styles.statusBadge}>
          <View className={styles.statusDot}></View>
          <Text>{isActive ? 'SOS报警中' : '报警已结束'}</Text>
        </View>

        <View className={styles.sosButton}>
          <View className={styles.sosButtonInner}>
            <Text className={styles.sosText}>SOS</Text>
            <Text className={styles.sosSubText}>紧急求助</Text>
          </View>
        </View>

        <Text className={styles.timeDisplay}>{formatTime(elapsedTime)}</Text>

        <View className={styles.locationCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.cardIcon}>📍</Text>
            您的位置
          </Text>
          <View className={styles.locationContent}>
            <View className={styles.locationDot}></View>
            <View className={styles.locationInfo}>
              <Text className={styles.locationAddress}>{location.address}</Text>
              <Text className={styles.locationCoord}>
                经度: {location.longitude.toFixed(4)} 纬度: {location.latitude.toFixed(4)}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.audioCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.cardIcon}>🎤</Text>
            环境录音
          </Text>
          <View className={styles.audioContent}>
            <View className={styles.audioIcon}>
              <Text>🔊</Text>
            </View>
            <View className={styles.audioInfo}>
              <Text className={styles.audioStatus}>
                {isRecording ? `录音中... ${recordingCountdown}秒` : '录音完成 (10秒)'}
              </Text>
              <View className={styles.audioWave}>
                {isRecording ? (
                  <>
                    <View className={styles.waveBar}></View>
                    <View className={styles.waveBar}></View>
                    <View className={styles.waveBar}></View>
                    <View className={styles.waveBar}></View>
                    <View className={styles.waveBar}></View>
                  </>
                ) : (
                  <Text style={{ fontSize: '24rpx', color: '#86909c' }}>10秒录音已保存并发送给联系人</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View className={styles.contactsCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.cardIcon}>👥</Text>
            通知对象 ({notifiedCount})
          </Text>
          <View className={styles.contactsList}>
            {allContacts.map(contact => (
              <View
                key={contact.id}
                className={styles.contactItem}
                onClick={() => handleCallContact(contact)}
              >
                <View className={styles.contactAvatar}>
                  <Text className={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
                </View>
                <View className={styles.contactInfo}>
                  <Text className={styles.contactName}>{contact.name}</Text>
                  <Text className={styles.contactPhone}>{formatPhoneDisplay(contact.phone)}</Text>
                </View>
                <Text className={styles.contactStatus}>已通知</Text>
              </View>
            ))}

            <View
              className={styles.contactItem}
              onClick={handleCallPreset}
            >
              <View className={`${styles.contactAvatar} ${styles.presetAvatar}`}>
                <Text className={styles.contactAvatarText}>☎️</Text>
              </View>
              <View className={styles.contactInfo}>
                <Text className={styles.contactName}>预设报警电话</Text>
                <Text className={styles.contactPhone}>{formatPhoneDisplay(presetPhone)}</Text>
              </View>
              <Text className={styles.contactStatus}>已通知</Text>
            </View>
          </View>
        </View>

        <View className={styles.bottomBar}>
          <View className={styles.cancelBtn} onClick={handleCancel}>
            <Text className={styles.cancelBtnText}>取消报警</Text>
          </View>
          <View className={styles.confirmBtn} onClick={handleEndAlarm}>
            <Text className={styles.confirmBtnText}>我已安全</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default SosPage
