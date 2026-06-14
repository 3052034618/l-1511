export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 20
}

export const validateRadius = (radius: number): boolean => {
  return radius >= 50 && radius <= 5000
}

export const formatPhoneDisplay = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone
  return `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`
}

export const isDuplicatePhone = (phone: string, existingPhones: string[], excludeId?: string): boolean => {
  return existingPhones.some(p => p === phone)
}
