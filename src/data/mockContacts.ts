import { Contact, ContactPermission } from '../types/contact'

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: '张伟',
    phone: '13800138001',
    relation: '父亲',
    permission: ContactPermission.FULL,
    isEmergency: true,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: '2',
    name: '李芳',
    phone: '13800138002',
    relation: '母亲',
    permission: ContactPermission.FULL,
    isEmergency: true,
    createdAt: '2024-01-15T10:35:00.000Z',
    updatedAt: '2024-01-15T10:35:00.000Z'
  },
  {
    id: '3',
    name: '王小明',
    phone: '13900139003',
    relation: '朋友',
    permission: ContactPermission.LOCATION_ONLY,
    isEmergency: false,
    createdAt: '2024-02-10T14:20:00.000Z',
    updatedAt: '2024-02-10T14:20:00.000Z'
  },
  {
    id: '4',
    name: '刘强',
    phone: '13700137004',
    relation: '同事',
    permission: ContactPermission.SOS_ONLY,
    isEmergency: false,
    createdAt: '2024-03-05T09:15:00.000Z',
    updatedAt: '2024-03-05T09:15:00.000Z'
  },
  {
    id: '5',
    name: '赵丽',
    phone: '13600136005',
    relation: '姐姐',
    permission: ContactPermission.FULL,
    isEmergency: false,
    createdAt: '2024-03-12T16:45:00.000Z',
    updatedAt: '2024-03-12T16:45:00.000Z'
  }
]
