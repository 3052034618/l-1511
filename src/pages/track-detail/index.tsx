import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { TrackDetail, LocationPoint } from '../../types/location'
import { getMockTrackDetail } from '../../data/mockTracks'
import { formatTime, formatDate, formatDistance, formatDuration, formatBattery } from '../../utils/format'
import styles from './index.module.scss'

const TrackDetailPage: React.FC = () => {
  const router = useRouter()
  const trackId = router.params.id
  const [trackDetail, setTrackDetail] = useState<TrackDetail | null>(null)

  useEffect(() => {
    loadTrackDetail()
  }, [trackId])

  const loadTrackDetail = () => {
    if (!trackId) {
      Taro.showToast({ title: '参数错误', icon: 'none' })
      return
    }
    const detail = getMockTrackDetail(trackId)
    if (detail) {
      setTrackDetail(detail)
      Taro.setNavigationBarTitle({ title: `${formatDate(detail.date)} 轨迹` })
    } else {
      Taro.showToast({ title: '未找到轨迹', icon: 'none' })
    }
  }

  const handleExport = () => {
    Taro.showModal({
      title: '导出轨迹',
      content: '确定要导出该轨迹记录为PDF吗？',
      confirmText: '导出',
      success: (res) => {
        if (res.confirm) {
          console.log('[TrackDetail] 导出PDF:', trackId)
          Taro.showLoading({ title: '生成中...' })
          setTimeout(() => {
            Taro.hideLoading()
            Taro.showToast({ title: '导出成功', icon: 'success' })
          }, 1500)
        }
      }
    })
  }

  const handleShare = () => {
    console.log('[TrackDetail] 分享轨迹')
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  if (!trackDetail) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📍</Text>
          <Text className={styles.emptyText}>加载中...</Text>
        </View>
      </View>
    )
  }

  const points = trackDetail.points

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.dateText}>{formatDate(trackDetail.date)}</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>📏</Text>
            <Text className={styles.statValue}>{formatDistance(trackDetail.distance)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>⏱️</Text>
            <Text className={styles.statValue}>{formatDuration(trackDetail.duration)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>📍</Text>
            <Text className={styles.statValue}>{points.length}个位置点</Text>
          </View>
        </View>
      </View>

      <View className={styles.mapPlaceholder}>
        <View className={styles.mapRoute}></View>
        <View className={styles.startPin}></View>
        <View className={styles.endPin}></View>
        <Text className={styles.mapIcon}>🗺️</Text>
        <Text className={styles.mapText}>轨迹地图</Text>
      </View>

      <ScrollView scrollY style={{ paddingBottom: '140rpx' }}>
        <View className={styles.timelineSection}>
          <Text className={styles.sectionTitle}>
            位置点时间线
            <Text className={styles.pointCount}>共{points.length}个</Text>
          </Text>
          
          <View className={styles.timeline}>
            <View className={styles.timelineLine}></View>
            {points.map((point, index) => (
              <View key={point.id} className={styles.timelineItem}>
                <View className={classnames(
                  styles.timelineDot,
                  index === 0 && styles.start,
                  index === points.length - 1 && styles.end
                )}></View>
                <View className={styles.pointCard}>
                  <Text className={styles.pointTime}>
                    {formatTime(point.timestamp)}
                    {index === 0 && ' · 起点'}
                    {index === points.length - 1 && ' · 终点'}
                  </Text>
                  <Text className={styles.pointAddress}>
                    {point.address || '未知位置'}
                  </Text>
                  <View className={styles.pointMeta}>
                    <View className={styles.metaItem}>
                      <Text className={styles.metaIcon}>🔋</Text>
                      <Text>{formatBattery(point.battery)}</Text>
                    </View>
                    {point.accuracy && (
                      <View className={styles.metaItem}>
                        <Text className={styles.metaIcon}>🎯</Text>
                        <Text>精度{point.accuracy}m</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.shareBtn} onClick={handleShare}>
          <Text className={styles.shareBtnText}>分享轨迹</Text>
        </View>
        <View className={styles.exportBtn} onClick={handleExport}>
          <Text className={styles.exportBtnText}>导出 PDF</Text>
        </View>
      </View>
    </View>
  )
}

export default TrackDetailPage
