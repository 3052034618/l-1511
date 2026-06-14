import React, { useState, useEffect } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import ContactCard from '../../components/ContactCard'
import { Contact } from '../../types/contact'
import { appStore } from '../../store/appStore'
import styles from './index.module.scss'

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchText, setSearchText] = useState('')
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])

  const refreshList = () => {
    setContacts([...appStore.getState().contacts])
  }

  useDidShow(() => {
    refreshList()
  })

  useEffect(() => {
    filterContacts()
  }, [contacts, searchText])

  const filterContacts = () => {
    if (!searchText.trim()) {
      setFilteredContacts(contacts)
      return
    }
    const filtered = contacts.filter(c =>
      c.name.includes(searchText) ||
      c.phone.includes(searchText) ||
      c.relation.includes(searchText)
    )
    setFilteredContacts(filtered)
  }

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/contact-edit/index' })
  }

  const handleContactClick = (contact: Contact) => {
    Taro.navigateTo({
      url: `/pages/contact-edit/index?id=${contact.id}`
    })
  }

  const handleRefresh = () => {
    setTimeout(() => {
      refreshList()
      Taro.stopPullDownRefresh()
    }, 500)
  }

  useEffect(() => {
    Taro.onPullDownRefresh(handleRefresh)
    return () => {
      Taro.offPullDownRefresh(handleRefresh)
    }
  }, [])

  const emergencyContacts = filteredContacts.filter(c => c.isEmergency)
  const normalContacts = filteredContacts.filter(c => !c.isEmergency)

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{contacts.length}</Text>
            <Text className={styles.statLabel}>总联系人</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{emergencyContacts.length}</Text>
            <Text className={styles.statLabel}>紧急联系人</Text>
          </View>
        </View>
      </View>

      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          className={styles.searchInput}
          placeholder="搜索联系人姓名、电话..."
          value={searchText}
          onInput={(e) => setSearchText(e.detail.value)}
        />
      </View>

      <ScrollView scrollY>
        {filteredContacts.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>👥</Text>
            <Text className={styles.emptyText}>
              {searchText ? '未找到匹配的联系人' : '暂无联系人'}
            </Text>
            <Text className={styles.emptyHint}>
              {searchText ? '试试其他关键词搜索' : '添加紧急联系人，守护您的安全'}
            </Text>
          </View>
        ) : (
          <>
            {emergencyContacts.length > 0 && (
              <>
                <Text className={styles.sectionTitle}>紧急联系人</Text>
                <View className={styles.contactList}>
                  {emergencyContacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onClick={() => handleContactClick(contact)}
                    />
                  ))}
                </View>
              </>
            )}

            {normalContacts.length > 0 && (
              <>
                <Text className={styles.sectionTitle}>普通联系人</Text>
                <View className={styles.contactList}>
                  {normalContacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onClick={() => handleContactClick(contact)}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <View className={styles.addButton} onClick={handleAdd}>
        <Text className={styles.addButtonText}>+ 添加联系人</Text>
      </View>
    </View>
  )
}

export default ContactsPage
