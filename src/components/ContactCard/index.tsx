import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Contact, ContactPermissionText } from '../../types/contact'
import styles from './index.module.scss'

interface ContactCardProps {
  contact: Contact
  onClick?: () => void
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const getAvatarText = (name: string) => {
    return name.charAt(0)
  }

  return (
    <View className={styles.contactCard} onClick={handleClick}>
      <View className={styles.avatar}>
        <Text className={styles.avatarText}>{getAvatarText(contact.name)}</Text>
      </View>
      <View className={styles.info}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{contact.name}</Text>
          {contact.isEmergency && (
            <Text className={styles.emergencyBadge}>紧急</Text>
          )}
        </View>
        <Text className={styles.relation}>{contact.relation} · {contact.phone}</Text>
        <Text className={styles.permission}>
          {ContactPermissionText[contact.permission]}
        </Text>
      </View>
      <Text className={styles.arrow}>›</Text>
    </View>
  )
}

export default ContactCard
