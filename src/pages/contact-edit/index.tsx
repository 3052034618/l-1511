import React, { useState, useEffect } from 'react'
import { View, Text, Input, Switch, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { Contact, ContactPermission, ContactPermissionText, ContactFormData } from '../../types/contact'
import { mockContacts } from '../../data/mockContacts'
import { validatePhone, validateName, validateRequired, isDuplicatePhone } from '../../utils/validator'
import styles from './index.module.scss'

const ContactEditPage: React.FC = () => {
  const router = useRouter()
  const contactId = router.params.id
  const isEdit = !!contactId

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    relation: '',
    permission: ContactPermission.FULL,
    isEmergency: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [contact, setContact] = useState<Contact | null>(null)

  useEffect(() => {
    if (isEdit) {
      const found = mockContacts.find(c => c.id === contactId)
      if (found) {
        setContact(found)
        setFormData({
          name: found.name,
          phone: found.phone,
          relation: found.relation,
          permission: found.permission,
          isEmergency: found.isEmergency
        })
        Taro.setNavigationBarTitle({ title: '编辑联系人' })
      }
    }
  }, [contactId, isEdit])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!validateRequired(formData.name)) {
      newErrors.name = '请输入姓名'
    } else if (!validateName(formData.name)) {
      newErrors.name = '姓名长度需在2-20个字符之间'
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = '请输入手机号'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '请输入正确的手机号格式'
    } else {
      const existingPhones = mockContacts
        .filter(c => c.id !== contactId)
        .map(c => c.phone)
      if (isDuplicatePhone(formData.phone, existingPhones)) {
        newErrors.phone = '该手机号已添加过联系人'
      }
    }

    if (!validateRequired(formData.relation)) {
      newErrors.relation = '请输入关系'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePermissionChange = (permission: ContactPermission) => {
    setFormData(prev => ({ ...prev, permission }))
  }

  const handleEmergencyChange = (value: boolean) => {
    setFormData(prev => ({ ...prev, isEmergency: value }))
  }

  const handleSave = () => {
    if (!validateForm()) {
      Taro.showToast({ title: '请检查填写信息', icon: 'none' })
      return
    }

    console.log('[ContactEdit] 保存联系人:', formData)
    
    Taro.showToast({
      title: isEdit ? '修改成功' : '添加成功',
      icon: 'success'
    })

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '删除联系人',
      content: '确定要删除该联系人吗？',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          console.log('[ContactEdit] 删除联系人:', contactId)
          Taro.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        }
      }
    })
  }

  const handleCancel = () => {
    Taro.navigateBack()
  }

  const permissionOptions = [
    { value: ContactPermission.FULL, name: '全部权限', desc: '可查看位置并接收SOS信号' },
    { value: ContactPermission.LOCATION_ONLY, name: '仅查看位置', desc: '只能查看位置信息' },
    { value: ContactPermission.SOS_ONLY, name: '仅接收SOS', desc: '只能接收SOS紧急信号' }
  ]

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <View className={styles.formSection}>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>姓名
            </Text>
            <View className={styles.inputWrapper}>
              <Input
                className={styles.input}
                placeholder="请输入姓名"
                placeholderClass={styles.placeholder}
                value={formData.name}
                onInput={(e) => handleInputChange('name', e.detail.value)}
                maxlength={20}
              />
            </View>
          </View>
          {errors.name && <View className={styles.errorMsg}>{errors.name}</View>}
        </View>

        <View className={styles.formSection}>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>手机号
            </Text>
            <View className={styles.inputWrapper}>
              <Input
                className={styles.input}
                type="number"
                placeholder="请输入手机号"
                placeholderClass={styles.placeholder}
                value={formData.phone}
                onInput={(e) => handleInputChange('phone', e.detail.value)}
                maxlength={11}
              />
            </View>
          </View>
          {errors.phone && <View className={styles.errorMsg}>{errors.phone}</View>}
        </View>

        <View className={styles.formSection}>
          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>关系
            </Text>
            <View className={styles.inputWrapper}>
              <Input
                className={styles.input}
                placeholder="如：父亲、母亲、朋友"
                placeholderClass={styles.placeholder}
                value={formData.relation}
                onInput={(e) => handleInputChange('relation', e.detail.value)}
                maxlength={10}
              />
            </View>
          </View>
          {errors.relation && <View className={styles.errorMsg}>{errors.relation}</View>}
        </View>

        <View className={styles.permissionSection}>
          <Text className={styles.sectionTitle}>通知权限</Text>
          <View className={styles.permissionList}>
            {permissionOptions.map(option => (
              <View
                key={option.value}
                className={classnames(
                  styles.permissionItem,
                  formData.permission === option.value && styles.active
                )}
                onClick={() => handlePermissionChange(option.value)}
              >
                <View className={styles.permissionRadio}>
                  <View className={styles.permissionRadioInner}></View>
                </View>
                <View className={styles.permissionInfo}>
                  <Text className={styles.permissionName}>{option.name}</Text>
                  <Text className={styles.permissionDesc}>{option.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.emergencyToggle}>
          <View className={styles.emergencyInfo}>
            <Text className={styles.emergencyTitle}>设为紧急联系人</Text>
            <Text className={styles.emergencyDesc}>SOS报警时将优先通知紧急联系人</Text>
          </View>
          <Switch
            checked={formData.isEmergency}
            color='#f53f3f'
            onChange={(e) => handleEmergencyChange(e.detail.value)}
          />
        </View>

        {isEdit && (
          <View className={styles.deleteBtn} onClick={handleDelete}>
            <Text className={styles.deleteBtnText}>删除联系人</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          <Text className={styles.cancelBtnText}>取消</Text>
        </View>
        <View 
          className={classnames(styles.saveBtn)}
          onClick={handleSave}
        >
          <Text className={styles.saveBtnText}>
            {isEdit ? '保存修改' : '添加联系人'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default ContactEditPage
