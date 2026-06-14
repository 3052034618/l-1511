import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Contact } from '../../types/contact'
import { mockContacts } from '../../data/mockContacts'
import { formatPhoneDisplay } from '../../utils/validator'
import styles from './index.module.scss'

const SosPage: React.FC = () => {
  const [isActive, setIsActive] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRecording, setIsRecording] = useState(true)
  const [location, setLocation] = useState({
    address: '北京市朝阳区望京SOHO附近',
    latitude: 39.9042,
    longitude: 116.4074
  })
  const [notifiedContacts, setNotifiedContacts] = useState<Contact[]>([])

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const emergencyContacts = mockContacts.filter(c => c.isEmergency)
    setNotifiedContacts(emergencyContacts)

    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isActive])

  useEffect(() => {
    if (isRecording && elapsedTime >= 10) {
      setIsRecording(false)
      console.log('[SOS] 录音完成，时长10秒')
    }
  }, [elapsedTime, isRecording])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const handleCancel = () => {
    Taro.showModal({
      title: '取消报警',
      content: '确定要取消本次SOS报警吗？',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          setIsActive(false)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          console.log('[SOS] 取消报警')
          Taro.showToast({ title: '已取消', icon: 'none' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
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
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          console.log('[SOS] 结束报警')
          Taro.showToast({ title: '已通知联系人', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
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

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.sosContainer}>
        <View className={styles.statusBadge}>
          <View className={styles.statusDot}></View>
          <Text>{isActive ? 'SOS报警中' : '报警已取消'}</Text>
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
                {isRecording ? '录音中...' : '录音完成'}
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
                  <Text style={{ fontSize: '24rpx', color: '#86909c' }}>10秒录音已保存</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View className={styles.contactsCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.cardIcon}>👥</Text>
            已通知联系人 ({notifiedContacts.length})
          </Text>
          <View className={styles.contactsList}>
            {notifiedContacts.map(contact => (
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
