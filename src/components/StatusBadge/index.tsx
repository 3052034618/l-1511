import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

type BadgeType = 'success' | 'warning' | 'error' | 'info' | 'default'

interface StatusBadgeProps {
  type?: BadgeType
  text: string
  showDot?: boolean
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  type = 'default', 
  text, 
  showDot = false 
}) => {
  return (
    <View className={classnames(styles.statusBadge, styles[type])}>
      {showDot && <View className={styles.dot}></View>}
      <Text>{text}</Text>
    </View>
  )
}

export default StatusBadge
