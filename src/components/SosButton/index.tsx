import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface SosButtonProps {
  onClick?: () => void
  countdown?: number
  isActive?: boolean
}

const SosButton: React.FC<SosButtonProps> = ({ onClick, countdown, isActive = false }) => {
  return (
    <View 
      className={classnames(styles.sosButton, isActive && styles.countdown)} 
      onClick={onClick}
    >
      {isActive && (
        <>
          <View className={styles.ripple}></View>
          <View className={styles.ripple}></View>
        </>
      )}
      <Text className={styles.sosText}>
        {countdown !== undefined ? countdown : 'SOS'}
      </Text>
      <Text className={styles.subText}>
        {countdown !== undefined ? '点击取消' : '一键报警'}
      </Text>
    </View>
  )
}

export default SosButton
