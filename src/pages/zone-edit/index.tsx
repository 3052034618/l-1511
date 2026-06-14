import React, { useState, useEffect } from 'react'
import { View, Text, Input, Switch, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { SafeZone, SafeZoneType } from '../../types/safeZone'
import { appStore } from '../../store/appStore'
import { validateRequired } from '../../utils/validator'
import styles from './index.module.scss'

const typeOptions: { value: SafeZoneType; icon: string; name: string }[] = [
  { value: SafeZoneType.HOME, icon: '🏠', name: '家' },
  { value: SafeZoneType.WORK, icon: '🏢', name: '公司' },
  { value: SafeZoneType.SCHOOL, icon: '🏫', name: '学校' },
  { value: SafeZoneType.CUSTOM, icon: '📍', name: '自定义' }
]

const ZoneEditPage: React.FC = () => {
  const router = useRouter()
  const zoneId = router.params.id
  const isEdit = !!zoneId

  const [zoneType, setZoneType] = useState<SafeZoneType>(SafeZoneType.HOME)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [radius, setRadius] = useState('200')
  const [notifyOnEnter, setNotifyOnEnter] = useState(true)
  const [notifyOnLeave, setNotifyOnLeave] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit && zoneId) {
      const found = appStore.getState().safeZones.find(z => z.id === zoneId)
      if (found) {
        setZoneType(found.type)
        setName(found.name)
        setAddress(found.address || '')
        setRadius(String(found.radius))
        setNotifyOnEnter(found.notifyOnEnter)
        setNotifyOnLeave(found.notifyOnLeave)
        Taro.setNavigationBarTitle({ title: '编辑安全区域' })
      }
    } else if (router.params.type) {
      setZoneType(router.params.type as SafeZoneType)
    }
  }, [zoneId, router.params.type])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!validateRequired(name)) {
      newErrors.name = '请输入区域名称'
    }

    if (!validateRequired(address)) {
      newErrors.address = '请输入区域地址'
    }

    const radiusNum = Number(radius)
    if (!radius || isNaN(radiusNum) || radiusNum < 50 || radiusNum > 5000) {
      newErrors.radius = '半径需在50-5000米之间'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      Taro.showToast({ title: '请检查填写信息', icon: 'none' })
      return
    }

    const zoneData = {
      name,
      type: zoneType,
      latitude: 39.9042 + (Math.random() - 0.5) * 0.05,
      longitude: 116.4074 + (Math.random() - 0.5) * 0.05,
      radius: Number(radius),
      address,
      notifyOnEnter,
      notifyOnLeave
    }

    if (isEdit && zoneId) {
      appStore.getState().updateSafeZone(zoneId, zoneData)
      console.log('[ZoneEdit] 更新区域:', zoneId)
    } else {
      appStore.getState().addSafeZone(zoneData)
      console.log('[ZoneEdit] 新增区域:', zoneData)
    }

    Taro.showToast({
      title: isEdit ? '修改成功' : '添加成功',
      icon: 'success'
    })

    setTimeout(() => {
      Taro.navigateBack()
    }, 800)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '删除安全区域',
      content: '确定要删除该安全区域吗？',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          appStore.getState().deleteSafeZone(zoneId!)
          console.log('[ZoneEdit] 删除区域:', zoneId)
          Taro.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 800)
        }
      }
    })
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.typeSection}>
          <Text className={styles.sectionLabel}>区域类型</Text>
          <View className={styles.typeGrid}>
            {typeOptions.map(opt => (
              <View
                key={opt.value}
                className={classnames(
                  styles.typeItem,
                  zoneType === opt.value && styles.active
                )}
                onClick={() => setZoneType(opt.value)}
              >
                <Text className={styles.typeIcon}>{opt.icon}</Text>
                <Text className={styles.typeName}>{opt.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>名称
            </Text>
            <View className={styles.inputWrapper}>
              <Input
                className={styles.input}
                placeholder="如：家、公司"
                placeholderClass={styles.placeholder}
                value={name}
                onInput={(e) => {
                  setName(e.detail.value)
                  if (errors.name) setErrors(prev => { const n = { ...prev }; delete n.name; return n })
                }}
                maxlength={20}
              />
            </View>
          </View>
          {errors.name && <View className={styles.errorMsg}>{errors.name}</View>}
        </View>

        <View className={styles.formSection}>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>地址
            </Text>
            <View className={styles.inputWrapper}>
              <Input
                className={styles.input}
                placeholder="请输入地址"
                placeholderClass={styles.placeholder}
                value={address}
                onInput={(e) => {
                  setAddress(e.detail.value)
                  if (errors.address) setErrors(prev => { const n = { ...prev }; delete n.address; return n })
                }}
                maxlength={50}
              />
            </View>
          </View>
          {errors.address && <View className={styles.errorMsg}>{errors.address}</View>}
        </View>

        <View className={styles.formSection}>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>半径(米)
            </Text>
            <View className={styles.inputWrapper}>
              <Input
                className={styles.input}
                type="digit"
                placeholder="50-5000"
                placeholderClass={styles.placeholder}
                value={radius}
                onInput={(e) => {
                  setRadius(e.detail.value)
                  if (errors.radius) setErrors(prev => { const n = { ...prev }; delete n.radius; return n })
                }}
                maxlength={4}
              />
            </View>
          </View>
          {errors.radius && <View className={styles.errorMsg}>{errors.radius}</View>}
        </View>

        <View className={styles.notifySection}>
          <Text className={styles.sectionLabel}>进出提醒</Text>
          <View className={styles.notifyItem}>
            <View className={styles.notifyInfo}>
              <Text className={styles.notifyTitle}>进入提醒</Text>
              <Text className={styles.notifyDesc}>进入安全区域时通知家人</Text>
            </View>
            <Switch
              checked={notifyOnEnter}
              color='#165dff'
              onChange={(e) => setNotifyOnEnter(e.detail.value)}
            />
          </View>
          <View className={styles.notifyItem}>
            <View className={styles.notifyInfo}>
              <Text className={styles.notifyTitle}>离开提醒</Text>
              <Text className={styles.notifyDesc}>离开安全区域时通知家人</Text>
            </View>
            <Switch
              checked={notifyOnLeave}
              color='#165dff'
              onChange={(e) => setNotifyOnLeave(e.detail.value)}
            />
          </View>
        </View>

        {isEdit && (
          <View className={styles.deleteBtn} onClick={handleDelete}>
            <Text className={styles.deleteBtnText}>删除安全区域</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          <Text className={styles.cancelBtnText}>取消</Text>
        </View>
        <View className={styles.saveBtn} onClick={handleSave}>
          <Text className={styles.saveBtnText}>{isEdit ? '保存修改' : '添加区域'}</Text>
        </View>
      </View>
    </View>
  )
}

export default ZoneEditPage
