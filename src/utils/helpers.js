export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

export const formatMoney = (amount) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

export const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export const formatDateFull = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const getMonthName = (monthStr) => {
  const [year, month] = monthStr.split('-')
  const d = new Date(year, month - 1)
  return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

export const getToday = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export const haptic = (type = 'light') => {
  if (navigator.vibrate) {
    const patterns = { light: 10, medium: 20, heavy: 30, success: [10, 50, 10], error: [20, 30, 20, 30, 20] }
    navigator.vibrate(patterns[type] || 10)
  }
}

export const EXPENSE_CATEGORIES = [
  { id: 'comida', label: 'Comida', color: '#f97316', icon: '🍔' },
  { id: 'transporte', label: 'Transporte', color: '#3b82f6', icon: '🚌' },
  { id: 'servicios', label: 'Servicios', color: '#8b5cf6', icon: '📱' },
  { id: 'entretenimiento', label: 'Entretenimiento', color: '#ec4899', icon: '🎮' },
  { id: 'ropa', label: 'Ropa', color: '#f43f5e', icon: '👕' },
  { id: 'salud', label: 'Salud', color: '#10b981', icon: '💊' },
  { id: 'educacion', label: 'Educación', color: '#06b6d4', icon: '📚' },
  { id: 'otros', label: 'Otros', color: '#6b7280', icon: '📦' },
]

export const INCOME_CATEGORIES = [
  { id: 'sueldo', label: 'Sueldo', color: '#10b981', icon: '💼' },
  { id: 'freelance', label: 'Freelance', color: '#8b5cf6', icon: '💻' },
  { id: 'ventas', label: 'Ventas', color: '#f97316', icon: '🛍️' },
  { id: 'otros_ing', label: 'Otros', color: '#6b7280', icon: '💰' },
]

export const TIKTOK_CATEGORIES = [
  { id: 'tutorial', label: 'Tutorial', color: '#3b82f6' },
  { id: 'trend', label: 'Trend', color: '#ec4899' },
  { id: 'storytelling', label: 'Storytelling', color: '#8b5cf6' },
  { id: 'humor', label: 'Humor', color: '#f97316' },
  { id: 'educativo', label: 'Educativo', color: '#10b981' },
  { id: 'bts', label: 'Behind the scenes', color: '#06b6d4' },
  { id: 'otro', label: 'Otro', color: '#6b7280' },
]

export const IDEA_STATES = [
  { id: 'idea', label: 'Idea', color: '#6b7280' },
  { id: 'en_produccion', label: 'En producción', color: '#f97316' },
  { id: 'grabado', label: 'Grabado', color: '#3b82f6' },
  { id: 'editado', label: 'Editado', color: '#8b5cf6' },
  { id: 'publicado', label: 'Publicado', color: '#10b981' },
]

export const PRIORITY_LEVELS = [
  { id: 'alta', label: 'Alta', color: '#ef4444' },
  { id: 'media', label: 'Media', color: '#f97316' },
  { id: 'baja', label: 'Baja', color: '#6b7280' },
]
