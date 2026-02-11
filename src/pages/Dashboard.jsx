import { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { data } = await dashboardAPI.getStats()
      setStats(data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  const cards = [
    { title: 'Заказы', value: stats.totalOrders, icon: ShoppingCart, color: '#10b981' },
    { title: 'Выручка', value: `${stats.totalRevenue} ₸`, icon: DollarSign, color: '#6366f1' },
    { title: 'Товары', value: stats.totalProducts, icon: Package, color: '#f59e0b' },
    { title: 'Пользователи', value: stats.totalUsers, icon: Users, color: '#ec4899' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: '32px' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        {cards.map(card => (
          <div key={card.title} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>{card.title}</p>
                <h2 style={{ marginTop: '8px', fontSize: '32px' }}>{card.value}</h2>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: card.color + '20' }}>
                <card.icon size={24} color={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}