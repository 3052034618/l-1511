import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { SafeZone, SafeZoneType, SafeZoneTypeText } from '../../types/safeZone'
import styles from './index.module.scss'

interface SafeZoneCardProps {
  zone: SafeZone
  onClick?: () => void
}

const SafeZoneCard: React.FC<SafeZoneCardProps> = ({ zone, onClick }) => {
  const getIconByType = (type: SafeZoneType) => {
    switch (type) {
      case SafeZoneType.HOME:
        return '🏠'
      case SafeZoneType.WORK:
        return '🏢'
      case SafeZoneType.SCHOOL:
        return '🏫'
      default:
        return '📍'
    }
  }

  return (
    <View className={styles.zoneCard} onClick={onClick}>
      <View className={classnames(styles.icon, styles[zone.type])}>
        <Text>{getIconByType(zone.type)}</Text>
      </View>
      <View className={styles.info}>
        <Text className={styles.name}>{zone.name}</Text>
        <Text className={styles.address}>{zone.address}</Text>
        <Text className={styles.radius}>半径 {zone.radius}米</Text>
        <View className={styles.notifyTags}>
          <Text className={classnames(styles.tag, zone.notifyOnEnter && styles.active)}>
            进入{zone.notifyOnEnter ? '提醒' : '不提醒'}
          </Text>
          <Text className={classnames(styles.tag, zone.notifyOnLeave && styles.active)}>
            离开{zone.notifyOnLeave ? '提醒' : '不提醒'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default SafeZoneCard
