import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SafeZoneCard from '../../components/SafeZoneCard'
import { SafeZone, SafeZoneType, SafeZoneTypeText } from '../../types/safeZone'
import { mockSafeZones } from '../../data/mockSafeZones'
import styles from './index.module.scss'

const SafeZonesPage: React.FC = () => {
  const [zones, setZones] = useState<SafeZone[]>([])

  useEffect(() => {
    loadZones()
  }, [])

  const loadZones = () => {
    setZones(mockSafeZones)
  }

  const getZoneIcon = (type: SafeZoneType) => {
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

  const handleAddZone = () => {
    Taro.showActionSheet({
      itemList: ['家', '公司', '学校', '自定义'],
      success: (res) => {
        const types = [
          SafeZoneType.HOME,
          SafeZoneType.WORK,
          SafeZoneType.SCHOOL,
          SafeZoneType.CUSTOM
        ]
        const selectedType = types[res.tapIndex]
        console.log('[SafeZones] 添加区域类型:', selectedType)
        Taro.showToast({ 
          title: `添加${SafeZoneTypeText[selectedType]}`, 
          icon: 'none' 
        })
      }
    })
  }

  const handleZoneClick = (zone: SafeZone) => {
    console.log('[SafeZones] 点击区域:', zone.name)
    Taro.showActionSheet({
      itemList: ['编辑区域', '删除区域'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showToast({ title: '编辑功能开发中', icon: 'none' })
        } else if (res.tapIndex === 1) {
          handleDeleteZone(zone)
        }
      }
    })
  }

  const handleDeleteZone = (zone: SafeZone) => {
    Taro.showModal({
      title: '删除安全区域',
      content: `确定要删除"${zone.name}"安全区域吗？`,
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          setZones(prev => prev.filter(z => z.id !== zone.id))
          console.log('[SafeZones] 删除区域:', zone.id)
          Taro.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  }

  const homeZones = zones.filter(z => z.type === SafeZoneType.HOME)
  const workZones = zones.filter(z => z.type === SafeZoneType.WORK)
  const otherZones = zones.filter(z => 
    z.type !== SafeZoneType.HOME && z.type !== SafeZoneType.WORK
  )

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>安全区域管理</Text>
        <Text className={styles.headerDesc}>
          设置家庭、公司等常用地点，进出时自动通知您的家人
        </Text>
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>💡 小提示</Text>
        <Text className={styles.tipContent}>
          安全区域使用GPS定位进行监测，为保证准确性请开启高精度定位权限。建议设置半径不小于200米，避免频繁误报。
        </Text>
      </View>

      <ScrollView scrollY>
        {zones.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📍</Text>
            <Text className={styles.emptyText}>暂无安全区域</Text>
            <Text className={styles.emptyHint}>
              添加您常去的地点，进出时自动通知家人
            </Text>
          </View>
        ) : (
          <>
            {homeZones.length > 0 && (
              <>
                <Text className={styles.sectionTitle}>家庭</Text>
                <View className={styles.zoneList}>
                  {homeZones.map(zone => (
                    <SafeZoneCard
                      key={zone.id}
                      zone={zone}
                      onClick={() => handleZoneClick(zone)}
                    />
                  ))}
                </View>
              </>
            )}

            {workZones.length > 0 && (
              <>
                <Text className={styles.sectionTitle}>工作</Text>
                <View className={styles.zoneList}>
                  {workZones.map(zone => (
                    <SafeZoneCard
                      key={zone.id}
                      zone={zone}
                      onClick={() => handleZoneClick(zone)}
                    />
                  ))}
                </View>
              </>
            )}

            {otherZones.length > 0 && (
              <>
                <Text className={styles.sectionTitle}>其他</Text>
                <View className={styles.zoneList}>
                  {otherZones.map(zone => (
                    <SafeZoneCard
                      key={zone.id}
                      zone={zone}
                      onClick={() => handleZoneClick(zone)}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <View className={styles.addButton} onClick={handleAddZone}>
        <Text className={styles.addButtonText}>+ 添加安全区域</Text>
      </View>
    </View>
  )
}

export default SafeZonesPage
