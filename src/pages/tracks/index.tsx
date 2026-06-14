import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { TrackSummary } from '../../types/location'
import { mockTrackSummaries } from '../../data/mockTracks'
import { formatDistance, formatTime, formatDate, getRelativeTime } from '../../utils/format'
import styles from './index.module.scss'

const TracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<TrackSummary[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [totalDistance, setTotalDistance] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    loadTracks()
  }, [])

  useEffect(() => {
    calculateSummary()
  }, [tracks])

  const loadTracks = () => {
    setTracks(mockTrackSummaries)
    if (mockTrackSummaries.length > 0) {
      setSelectedDate(mockTrackSummaries[0].date)
    }
  }

  const calculateSummary = () => {
    const distance = tracks.reduce((sum, track) => sum + track.distance, 0)
    setTotalDistance(distance)
    setTotalCount(tracks.length)
  }

  const handlePrevDay = () => {
    const currentIndex = tracks.findIndex(t => t.date === selectedDate)
    if (currentIndex < tracks.length - 1) {
      setSelectedDate(tracks[currentIndex + 1].date)
    }
  }

  const handleNextDay = () => {
    const currentIndex = tracks.findIndex(t => t.date === selectedDate)
    if (currentIndex > 0) {
      setSelectedDate(tracks[currentIndex - 1].date)
    }
  }

  const handleTrackClick = (track: TrackSummary) => {
    Taro.navigateTo({ 
      url: `/pages/track-detail/index?id=${track.id}` 
    })
  }

  const handleExport = () => {
    Taro.showModal({
      title: '导出轨迹',
      content: `确定要导出${formatDate(selectedDate)}的轨迹记录为PDF吗？`,
      confirmText: '导出',
      success: (res) => {
        if (res.confirm) {
          console.log('[Tracks] 导出PDF')
          Taro.showToast({ title: '导出成功', icon: 'success' })
        }
      }
    })
  }

  const handleRefresh = () => {
    setTimeout(() => {
      loadTracks()
      Taro.stopPullDownRefresh()
    }, 800)
  }

  useEffect(() => {
    Taro.onPullDownRefresh(handleRefresh)
    return () => {
      Taro.offPullDownRefresh(handleRefresh)
    }
  }, [])

  const selectedTrack = tracks.find(t => t.date === selectedDate)

  return (
    <View className={styles.page}>
      <View className={styles.datePicker}>
        <View className={styles.dateNav}>
          <View className={styles.navBtn} onClick={handlePrevDay}>
            <Text>‹</Text>
          </View>
        </View>
        <Text className={styles.dateText}>
          {selectedDate ? formatDate(selectedDate) : '暂无数据'}
        </Text>
        <View className={styles.dateNav}>
          <View className={styles.navBtn} onClick={handleNextDay}>
            <Text>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>本周统计</Text>
        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{formatDistance(totalDistance)}</Text>
            <Text className={styles.summaryLabel}>总里程</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{totalCount}</Text>
            <Text className={styles.summaryLabel}>记录天数</Text>
          </View>
        </View>
      </View>

      <View className={styles.exportBtn} onClick={handleExport}>
        <Text className={styles.exportBtnText}>导出当天轨迹PDF</Text>
      </View>

      <Text className={styles.sectionTitle}>历史记录</Text>

      <ScrollView scrollY>
        {tracks.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📍</Text>
            <Text className={styles.emptyText}>暂无轨迹记录</Text>
            <Text className={styles.emptyHint}>开启位置服务后将自动记录您的轨迹</Text>
          </View>
        ) : (
          <View className={styles.trackList}>
            {tracks.map(track => (
              <View 
                key={track.id} 
                className={styles.trackCard}
                onClick={() => handleTrackClick(track)}
              >
                <View className={styles.trackHeader}>
                  <Text className={styles.trackDate}>
                    {formatDate(track.date)}
                  </Text>
                  <Text className={styles.trackDuration}>
                    {getRelativeTime(track.endTime)}
                  </Text>
                </View>
                
                <View className={styles.trackInfo}>
                  <View className={styles.trackInfoItem}>
                    <Text className={styles.trackInfoIcon}>📍</Text>
                    <Text>{track.pointCount} 个位置点</Text>
                  </View>
                  <View className={styles.trackInfoItem}>
                    <Text className={styles.trackInfoIcon}>📏</Text>
                    <Text>{formatDistance(track.distance)}</Text>
                  </View>
                </View>

                <View className={styles.trackRoute}>
                  <View className={styles.routePoint}>
                    <View className={`${styles.routeDot} ${styles.start}`}></View>
                    <Text className={styles.routeText}>
                      {formatTime(track.startTime)} {track.startAddress || '起点'}
                    </Text>
                  </View>
                  <View className={styles.routeLine}></View>
                  <View className={styles.routePoint}>
                    <View className={`${styles.routeDot} ${styles.end}`}></View>
                    <Text className={styles.routeText}>
                      {formatTime(track.endTime)} {track.endAddress || '终点'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default TracksPage
