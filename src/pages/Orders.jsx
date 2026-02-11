import { useState, useEffect } from 'react'
import { ordersAPI } from '../services/api'
import { Search, Eye, Filter } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import OrderDetails from '../components/OrderDetails'

const statusColors = {
  PENDING: { bg: '#fef3c7', text: '#92400e', label: 'Ожидает' },
  CONFIRMED: { bg: '#dbeafe', text: '#1e40af', label: 'Подтверждён' },
  PROCESSING: { bg: '#e0e7ff', text: '#3730a3', label: 'Обрабатывается' },
  READY: { bg: '#d1fae5', text: '#065f46', label: 'Готов' },
  IN_DELIVERY: { bg: '#fce7f3', text: '#831843', label: 'В доставке' },
  COMPLETED: { bg: '#d1fae5', text: '#065f46', label: 'Завершён' },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b', label: 'Отменён' },
}

const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'PENDING', label: 'Ожидает' },
  { value: 'CONFIRMED', label: 'Подтверждён' },
  { value: 'PROCESSING', label: 'Обрабатывается' },
  { value: 'READY', label: 'Готов' },
  { value: 'IN_DELIVERY', label: 'В доставке' },
  { value: 'COMPLETED', label: 'Завершён' },
  { value: 'CANCELLED', label: 'Отменён' },
]

const nextStatus = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PROCESSING',
  PROCESSING: 'READY',
  READY: 'IN_DELIVERY',
  IN_DELIVERY: 'COMPLETED',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
  try {
    const { data } = await ordersAPI.getAll()
    // Проверяем что data.data это массив
    const ordersArray = Array.isArray(data.data) ? data.data : []
    setOrders(ordersArray)
  } catch (error) {
    console.error('Load orders error:', error)
    toast.error('Ошибка загрузки заказов')
    setOrders([]) // Устанавливаем пустой массив при ошибке
  } finally {
    setLoading(false)
  }
}

  const handleViewDetails = async (orderId) => {
    try {
      const { data } = await ordersAPI.getById(orderId)
      setSelectedOrder(data.data)
    } catch (error) {
      toast.error('Ошибка загрузки деталей заказа')
    }
  }

  const handleChangeStatus = async (orderId, currentStatus) => {
    const newStatus = nextStatus[currentStatus]
    if (!newStatus) {
      toast.error('Невозможно изменить статус')
      return
    }

    const statusLabel = statusColors[newStatus]?.label || newStatus

    if (!window.confirm(`Изменить статус на "${statusLabel}"?`)) return

    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus })
      toast.success(`Статус изменён на "${statusLabel}"`)
      loadOrders()
    } catch (error) {
      toast.error('Ошибка изменения статуса')
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Отменить заказ?')) return

    try {
      await ordersAPI.updateStatus(orderId, { status: 'CANCELLED' })
      toast.success('Заказ отменён')
      loadOrders()
    } catch (error) {
      toast.error('Ошибка отмены заказа')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toString().includes(searchTerm) ||
                         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone?.includes(searchTerm)
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => ['CONFIRMED', 'PROCESSING', 'READY', 'IN_DELIVERY'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px' }}>Заказы</h1>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Всего: <strong>{stats.total}</strong>
          </span>
          <span style={{ fontSize: '14px', color: '#92400e' }}>
            Ожидают: <strong>{stats.pending}</strong>
          </span>
          <span style={{ fontSize: '14px', color: '#3730a3' }}>
            В работе: <strong>{stats.processing}</strong>
          </span>
          <span style={{ fontSize: '14px', color: '#065f46' }}>
            Завершены: <strong>{stats.completed}</strong>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }}
            />
            <input
              type="text"
              placeholder="Поиск по номеру, имени, телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px', marginBottom: 0 }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ position: 'relative' }}>
            <Filter
              size={20}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ paddingLeft: '44px', marginBottom: 0 }}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>{searchTerm || statusFilter ? 'Заказы не найдены' : 'Нет заказов'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>№ Заказа</th>
                  <th>Клиент</th>
                  <th style={{ width: '150px' }}>Дата</th>
                  <th style={{ width: '100px' }}>Сумма</th>
                  <th style={{ width: '120px' }}>Статус</th>
                  <th style={{ width: '180px', textAlign: 'right' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const status = statusColors[order.status]
                  return (
                    <tr key={order.id}>
                      <td>
                        <code style={{
                          padding: '4px 8px',
                          background: '#f3f4f6',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          #{order.orderNumber}
                        </code>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: '500' }}>
                            {order.customerName || 'Не указано'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {order.customerPhone || '—'}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: '#6b7280' }}>
                        {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                      </td>
                      <td>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>
                          {order.total} ₸
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: status.bg,
                            color: status.text,
                            cursor: 'default'
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'flex-end',
                          flexWrap: 'wrap'
                        }}>
                          {/* View Details */}
                          <button
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                            onClick={() => handleViewDetails(order.id)}
                            title="Просмотр"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Next Status */}
                          {nextStatus[order.status] && (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '13px' }}
                              onClick={() => handleChangeStatus(order.id, order.status)}
                              title={`Изменить на "${statusColors[nextStatus[order.status]]?.label}"`}
                            >
                              {statusColors[nextStatus[order.status]]?.label}
                            </button>
                          )}

                          {/* Cancel */}
                          {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                            <button
                              className="btn btn-danger"
                              style={{ padding: '6px 12px', fontSize: '13px' }}
                              onClick={() => handleCancelOrder(order.id)}
                              title="Отменить"
                            >
                              Отменить
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}