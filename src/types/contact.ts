export enum ContactPermission {
  LOCATION_ONLY = 'location_only',
  SOS_ONLY = 'sos_only',
  FULL = 'full'
}

export interface Contact {
  id: string
  name: string
  phone: string
  avatar?: string
  relation: string
  permission: ContactPermission
  isEmergency: boolean
  createdAt: string
  updatedAt: string
}

export interface ContactFormData {
  name: string
  phone: string
  relation: string
  permission: ContactPermission
  isEmergency: boolean
}

export const ContactPermissionText: Record<ContactPermission, string> = {
  [ContactPermission.LOCATION_ONLY]: '仅查看位置',
  [ContactPermission.SOS_ONLY]: '仅接收SOS',
  [ContactPermission.FULL]: '全部权限'
}
