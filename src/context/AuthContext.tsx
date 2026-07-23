import { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRole = 'patient' | 'doctor' | 'admin'

export type UserProfile = {
  name: string
  email: string
  phone: string
  role: UserRole
  avatar: string
  dob: string
  bloodType: string
  allergies: string
  conditions: string
  notifications: boolean
  newsletter: boolean
  joinedDate: string
}

export type ChatMsg = { role: 'user' | 'bot'; text: string; time: string }

export type Appointment = {
  id: number
  doctor: string
  specialty: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

export type AdminUser = {
  id: number
  name: string
  email: string
  role: 'patient' | 'doctor'
  status: 'active' | 'suspended' | 'pending'
  joined: string
  avatar: string
  specialty?: string
  phone?: string
  appointments: number
  verified: boolean
}

export type SubAdmin = {
  id: number
  name: string
  email: string
  password: string
  permissions: string[]
  status: 'active' | 'suspended'
  created: string
  lastLogin: string
  avatar: string
}

export type AdminProduct = {
  id: number
  name: string
  category: string
  price: string
  stock: number
  status: 'active' | 'out_of_stock' | 'hidden'
  sales: number
  description: string
  badge: string | null
}

export type AdminAppointment = {
  id: number
  patient: string
  doctor: string
  specialty: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  fee: string
}

export type AdminChatLog = {
  id: number
  user: string
  messages: number
  lastMessage: string
  date: string
  flagged: boolean
}

export type SiteAnnouncement = {
  enabled: boolean
  text: string
  type: 'info' | 'warning' | 'success'
}

export type HomepageAd = {
  id: number
  badge: string
  title: string
  desc: string
  cta: string
  bg: string
  active: boolean
}

type AuthContextType = {
  user: UserProfile | null
  login: (data: Partial<UserProfile>) => void
  loginAsAdmin: (email?: string, name?: string) => void
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  chatHistory: ChatMsg[]
  addChatMsg: (msg: ChatMsg) => void
  appointments: Appointment[]
  addAppointment: (a: Appointment) => void
  // Admin data
  adminUsers: AdminUser[]
  subAdmins: SubAdmin[]
  adminProducts: AdminProduct[]
  adminAppointments: AdminAppointment[]
  adminChatLogs: AdminChatLog[]
  siteAnnouncement: SiteAnnouncement
  homepageAds: HomepageAd[]
  platformSettings: Record<string, boolean>
  // Admin actions
  updateAdminUser: (id: number, updates: Partial<AdminUser>) => void
  deleteAdminUser: (id: number) => void
  addAdminUser: (u: Omit<AdminUser, 'id'>) => void
  addSubAdmin: (s: Omit<SubAdmin, 'id'>) => void
  updateSubAdmin: (id: number, updates: Partial<SubAdmin>) => void
  deleteSubAdmin: (id: number) => void
  updateAdminProduct: (id: number, updates: Partial<AdminProduct>) => void
  deleteAdminProduct: (id: number) => void
  addAdminProduct: (p: Omit<AdminProduct, 'id'>) => void
  updateAdminAppointment: (id: number, updates: Partial<AdminAppointment>) => void
  deleteAdminAppointment: (id: number) => void
  deleteFlaggedLog: (id: number) => void
  setSiteAnnouncement: (a: SiteAnnouncement) => void
  updateHomepageAd: (id: number, updates: Partial<HomepageAd>) => void
  togglePlatformSetting: (key: string) => void
}

const defaultAppointments: Appointment[] = [
  { id: 1, doctor: 'Dr. Elena Vasquez', specialty: 'Cardiology', date: '2026-07-28', time: '10:00 AM', status: 'upcoming' },
  { id: 2, doctor: 'Dr. Amara Osei', specialty: 'Pediatrics', date: '2026-06-30', time: '2:30 PM', status: 'completed' },
]

const seedUsers: AdminUser[] = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@example.com', role: 'patient', status: 'active', joined: '2026-01-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&auto=format', appointments: 5, verified: true, phone: '+1 555-201-3344' },
  { id: 2, name: 'James Okonkwo', email: 'james@example.com', role: 'patient', status: 'active', joined: '2026-02-03', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format', appointments: 2, verified: true, phone: '+1 555-874-9900' },
  { id: 3, name: 'Dr. Elena Vasquez', email: 'elena@medisync.com', role: 'doctor', status: 'active', joined: '2025-11-20', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&auto=format', specialty: 'Cardiology', appointments: 312, verified: true, phone: '+1 555-300-1122' },
  { id: 4, name: 'Dr. Marcus Chen', email: 'marcus@medisync.com', role: 'doctor', status: 'active', joined: '2025-10-05', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&auto=format', specialty: 'Neurology', appointments: 278, verified: true, phone: '+1 555-410-7788' },
  { id: 5, name: 'Priya Sharma', email: 'priya@example.com', role: 'patient', status: 'active', joined: '2026-03-12', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&auto=format', appointments: 8, verified: true, phone: '+1 555-654-3210' },
  { id: 6, name: 'Dr. Raj Patel', email: 'raj@medisync.com', role: 'doctor', status: 'pending', joined: '2026-07-01', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=60&h=60&fit=crop&auto=format', specialty: 'Orthopedics', appointments: 0, verified: false, phone: '+1 555-777-2200' },
  { id: 7, name: 'Omar Hassan', email: 'omar@example.com', role: 'patient', status: 'suspended', joined: '2026-04-22', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60&h=60&fit=crop&auto=format', appointments: 1, verified: false, phone: '+1 555-991-0011' },
  { id: 8, name: 'Dr. Amara Osei', email: 'amara@medisync.com', role: 'doctor', status: 'active', joined: '2025-09-18', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=60&h=60&fit=crop&auto=format', specialty: 'Pediatrics', appointments: 445, verified: true, phone: '+1 555-120-4455' },
]

const seedSubAdmins: SubAdmin[] = [
  { id: 1, name: 'Dr. Kwame Boateng', email: 'kwame@medisync.com', password: 'kwame2026', permissions: ['users', 'appointments', 'chatlogs'], status: 'active', created: '2026-01-10', lastLogin: '2026-07-20', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&auto=format' },
  { id: 2, name: 'Ling Wei', email: 'ling@medisync.com', password: 'ling2026', permissions: ['products', 'overview'], status: 'active', created: '2026-03-05', lastLogin: '2026-07-19', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&h=60&fit=crop&auto=format' },
]

const seedProducts: AdminProduct[] = [
  { id: 1, name: 'CardioGuard Omega-3', category: 'Supplements', price: '$34.99', stock: 248, status: 'active', sales: 1204, description: 'Pharmaceutical-grade omega-3 fatty acids for cardiovascular and cognitive support.', badge: 'Best Seller' },
  { id: 2, name: 'SmartBP Monitor Pro', category: 'Devices', price: '$89.99', stock: 45, status: 'active', sales: 876, description: 'Clinical-accuracy blood pressure monitor with Bluetooth app sync.', badge: 'New' },
  { id: 3, name: 'VitaD3 + K2 Complex', category: 'Supplements', price: '$22.50', stock: 0, status: 'out_of_stock', sales: 567, description: 'Synergistic vitamin D3 and K2 formula for bone density and immune strength.', badge: null },
  { id: 4, name: 'DermaClear SPF50 Cream', category: 'Skincare', price: '$45.00', stock: 120, status: 'active', sales: 923, description: 'Dermatologist-formulated broad-spectrum SPF50 for sensitive and acne-prone skin.', badge: 'Sale' },
  { id: 5, name: 'Advanced First Aid Kit', category: 'First Aid', price: '$55.00', stock: 67, status: 'active', sales: 312, description: '120-piece comprehensive first aid kit meeting OSHA standards.', badge: 'Essential' },
  { id: 6, name: 'MindCalm Ashwagandha', category: 'Wellness', price: '$28.00', stock: 189, status: 'active', sales: 789, description: 'KSM-66 ashwagandha root extract for cortisol reduction and stress resilience.', badge: null },
  { id: 7, name: 'GlucoTrack Sensor Kit', category: 'Devices', price: '$129.99', stock: 12, status: 'active', sales: 445, description: 'Continuous glucose monitoring kit with 14-day sensors and real-time alerts.', badge: 'Sale' },
  { id: 8, name: 'ProBiome Defense 50B', category: 'Supplements', price: '$38.00', stock: 0, status: 'hidden', sales: 634, description: '50 billion CFU probiotic with 12 clinically validated strains.', badge: null },
]

const seedAppointments: AdminAppointment[] = [
  { id: 1, patient: 'Sarah Mitchell', doctor: 'Dr. Elena Vasquez', specialty: 'Cardiology', date: '2026-07-28', time: '10:00 AM', status: 'upcoming', fee: '$150' },
  { id: 2, patient: 'James Okonkwo', doctor: 'Dr. Amara Osei', specialty: 'Pediatrics', date: '2026-07-25', time: '2:30 PM', status: 'upcoming', fee: '$120' },
  { id: 3, patient: 'Priya Sharma', doctor: 'Dr. Marcus Chen', specialty: 'Neurology', date: '2026-07-10', time: '9:00 AM', status: 'completed', fee: '$180' },
  { id: 4, patient: 'Sarah Mitchell', doctor: 'Dr. Raj Patel', specialty: 'Orthopedics', date: '2026-07-05', time: '11:30 AM', status: 'cancelled', fee: '$200' },
  { id: 5, patient: 'Omar Hassan', doctor: 'Dr. Sophia Laurent', specialty: 'Dermatology', date: '2026-06-28', time: '3:00 PM', status: 'completed', fee: '$140' },
  { id: 6, patient: 'James Okonkwo', doctor: 'Dr. Elena Vasquez', specialty: 'Cardiology', date: '2026-06-20', time: '10:30 AM', status: 'completed', fee: '$150' },
]

const seedChatLogs: AdminChatLog[] = [
  { id: 1, user: 'Sarah Mitchell', messages: 14, lastMessage: 'What are symptoms of high blood pressure?', date: '2026-07-13', flagged: false },
  { id: 2, user: 'James Okonkwo', messages: 6, lastMessage: 'How can I improve my sleep quality?', date: '2026-07-12', flagged: false },
  { id: 3, user: 'Priya Sharma', messages: 22, lastMessage: 'What vitamins should I take daily?', date: '2026-07-11', flagged: false },
  { id: 4, user: 'Omar Hassan', messages: 3, lastMessage: 'Can I get prescription painkillers online?', date: '2026-07-10', flagged: true },
  { id: 5, user: 'Guest User', messages: 8, lastMessage: 'When should I see a cardiologist?', date: '2026-07-09', flagged: false },
]

const seedAds: HomepageAd[] = [
  { id: 1, badge: 'Special Offer', title: 'Free Annual Health Checkup', desc: 'Book a comprehensive health screening package for you and your family. Limited slots available.', cta: 'Book Now — Free', bg: 'linear-gradient(135deg, #1a6fbf 0%, #0d4a8a 100%)', active: true },
  { id: 2, badge: 'New Service', title: 'Telehealth Consultations', desc: 'See a doctor from home in under 15 minutes. Available 24/7 with board-certified physicians.', cta: 'Try Telehealth', bg: 'linear-gradient(135deg, #00c6ae 0%, #008f7e 100%)', active: true },
]

const defaultSettings: Record<string, boolean> = {
  doctorVerification: true,
  aiChatModeration: true,
  newRegistrations: true,
  telehealthFeatures: true,
  productMarketplace: true,
  maintenanceMode: false,
  emailNotifications: true,
  smsAlerts: false,
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>(defaultAppointments)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(seedUsers)
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(seedSubAdmins)
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>(seedProducts)
  const [adminAppointments, setAdminAppointments] = useState<AdminAppointment[]>(seedAppointments)
  const [adminChatLogs, setAdminChatLogs] = useState<AdminChatLog[]>(seedChatLogs)
  const [siteAnnouncement, setSiteAnnouncementState] = useState<SiteAnnouncement>({ enabled: false, text: '', type: 'info' })
  const [homepageAds, setHomepageAds] = useState<HomepageAd[]>(seedAds)
  const [platformSettings, setPlatformSettings] = useState(defaultSettings)

  const login = (data: Partial<UserProfile>) => {
    setUser({
      name: data.name || 'Alex Johnson',
      email: data.email || 'alex@example.com',
      phone: data.phone || '+1 (555) 012-3456',
      role: data.role || 'patient',
      avatar: data.role === 'doctor'
        ? 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80&h=80&fit=crop&auto=format'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
      dob: '1990-04-12', bloodType: 'O+', allergies: 'Penicillin', conditions: 'Mild hypertension',
      notifications: true, newsletter: false,
      joinedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    })
  }

  const loginAsAdmin = (email = 'admin@medisync.com', name = 'Super Admin') => {
    setUser({
      name, email, phone: '+1 (800) 000-0001', role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&auto=format',
      dob: '', bloodType: '', allergies: '', conditions: '',
      notifications: true, newsletter: false,
      joinedDate: 'January 1, 2025',
    })
  }

  const logout = () => { setUser(null); setChatHistory([]) }
  const updateProfile = (data: Partial<UserProfile>) => setUser(prev => prev ? { ...prev, ...data } : null)
  const addChatMsg = (msg: ChatMsg) => setChatHistory(prev => [...prev, msg])
  const addAppointment = (a: Appointment) => setAppointments(prev => [a, ...prev])

  // User CRUD
  const updateAdminUser = (id: number, updates: Partial<AdminUser>) =>
    setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
  const deleteAdminUser = (id: number) =>
    setAdminUsers(prev => prev.filter(u => u.id !== id))
  const addAdminUser = (u: Omit<AdminUser, 'id'>) =>
    setAdminUsers(prev => [...prev, { ...u, id: Date.now() }])

  // Sub-admin CRUD
  const addSubAdmin = (s: Omit<SubAdmin, 'id'>) =>
    setSubAdmins(prev => [...prev, { ...s, id: Date.now() }])
  const updateSubAdmin = (id: number, updates: Partial<SubAdmin>) =>
    setSubAdmins(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  const deleteSubAdmin = (id: number) =>
    setSubAdmins(prev => prev.filter(s => s.id !== id))

  // Product CRUD
  const updateAdminProduct = (id: number, updates: Partial<AdminProduct>) =>
    setAdminProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  const deleteAdminProduct = (id: number) =>
    setAdminProducts(prev => prev.filter(p => p.id !== id))
  const addAdminProduct = (p: Omit<AdminProduct, 'id'>) =>
    setAdminProducts(prev => [...prev, { ...p, id: Date.now() }])

  // Appointment management
  const updateAdminAppointment = (id: number, updates: Partial<AdminAppointment>) =>
    setAdminAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  const deleteAdminAppointment = (id: number) =>
    setAdminAppointments(prev => prev.filter(a => a.id !== id))

  const deleteFlaggedLog = (id: number) =>
    setAdminChatLogs(prev => prev.filter(l => l.id !== id))
  const setSiteAnnouncement = (a: SiteAnnouncement) => setSiteAnnouncementState(a)
  const updateHomepageAd = (id: number, updates: Partial<HomepageAd>) =>
    setHomepageAds(prev => prev.map(ad => ad.id === id ? { ...ad, ...updates } : ad))
  const togglePlatformSetting = (key: string) =>
    setPlatformSettings(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <AuthContext.Provider value={{
      user, login, loginAsAdmin, logout, updateProfile,
      chatHistory, addChatMsg, appointments, addAppointment,
      adminUsers, subAdmins, adminProducts, adminAppointments, adminChatLogs,
      siteAnnouncement, homepageAds, platformSettings,
      updateAdminUser, deleteAdminUser, addAdminUser,
      addSubAdmin, updateSubAdmin, deleteSubAdmin,
      updateAdminProduct, deleteAdminProduct, addAdminProduct,
      updateAdminAppointment, deleteAdminAppointment,
      deleteFlaggedLog, setSiteAnnouncement, updateHomepageAd, togglePlatformSetting,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
