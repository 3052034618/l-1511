import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface ListItemProps {
  icon?: string
  iconType?: 'primary' | 'success' | 'warning' | 'danger'
  title: string
  desc?: string
  rightText?: string
  showArrow?: boolean
  onClick?: () => void
}

const ListItem: React.FC<ListItemProps> = ({
  icon,
  iconType = 'primary',
  title,
  desc,
  rightText,
  showArrow = true,
  onClick
}) => {
  return (
    <View className={styles.listItem} onClick={onClick}>
      {icon && (
        <View className={classnames(styles.icon, styles[iconType])}>
          <Text>{icon}</Text>
        </View>
      )}
      <View className={styles.content}>
        <Text className={styles.title}>{title}</Text>
        {desc && <Text className={styles.desc}>{desc}</Text>}
      </View>
      <View className={styles.right}>
        {rightText && <Text className={styles.rightText}>{rightText}</Text>}
        {showArrow && <Text className={styles.arrow}>›</Text>}
      </View>
    </View>
  )
}

export default ListItem
