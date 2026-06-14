import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import SafeZoneCard from '../../components/SafeZoneCard'
import { SafeZone, SafeZoneType } from '../../types/safeZone'
import { appStore } from '../../store/appStore'
import styles from './index.module.scss'

const SafeZonesPage: React.FC = () => {
  const [zones, setZones] = useState<SafeZone[]>([])

  useDidShow(() => {
    setZones([...appStore.getState().safeZones])
  })

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
        Taro.navigateTo({
          url: `/pages/zone-edit/index?type=${types[res.tapIndex]}`
        })
      }
    })
  }

  const handleZoneClick = (zone: SafeZone) => {
    Taro.navigateTo({
      url: `/pages/zone-edit/index?id=${zone.id}`
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
