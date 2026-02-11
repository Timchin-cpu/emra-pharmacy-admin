import { X, Package, User, MapPin, Phone, CreditCard, Tag } from 'lucide-react'
import { format } from 'date-fns'

const statusColors = {
  PENDING: { bg: '#fef3c7', text: '#92400e', label: 'Ожидает' },
  CONFIRMED: { bg: '#dbeafe', text: '#1e40af', label: 'Подтверждён' },
  PROCESSING: { bg: '#e0e7ff', text: '#3730a3', label: 'Обрабатывается' },
  READY: { bg: '#d1fae5', text: '#065f46', label: 'Готов' },
  IN_DELIVERY: { bg: '#fce7f3', text: '#831843', label: 'В доставке' },
  COMPLETED: { bg: '#d1fae5', text: '#065f46', label: 'Завершён' },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b', label: 'Отменён' },
}

const paymentStatusColors = {
  PENDING: { bg: '#fef3c7', text: '#92400e', label: 'Ожидает' },
  PROCESSING: { bg: '#dbeafe', text: '#1e40af', label: 'Обработка' },
  PAID: { bg: '#d1fae5', text: '#065f46', label: 'Оплачено' },
  FAILED: { bg: '#fee2e2', text: '#991b1b', label: 'Ошибка' },
  REFUNDED: { bg: '#f3f4f6', text: '#374151', label: 'Возврат' },
}

export default function OrderDetails({ order, onClose }) {
  if (!order) return null

  const status = statusColors[order.status]
  const paymentStatus = paymentStatusColors[order.paymentStatus]

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 1
        }}>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Заказ #{order.orderNumber}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Статусы */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Статус заказа</p>
              <span style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                background: status.bg,
                color: status.text,
                display: 'inline-block'
              }}>
                {status.label}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Статус оплаты</p>
              <span style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                background: paymentStatus.bg,
                color: paymentStatus.text,
                display: 'inline-block'
              }}>
                {paymentStatus.label}
              </span>
            </div>
          </div>

          {/* Информация о клиенте */}
          <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} />
              Информация о клиенте
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Имя</p>
                <p style={{ fontWeight: '500' }}>{order.customerName || '—'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Телефон</p>
                <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} />
                  {order.customerPhone || '—'}
                </p>
              </div>
              {order.deliveryAddress && (
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>Адрес доставки</p>
                  <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} />
                    {order.deliveryAddress}
                  </p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Тип доставки</p>
                <p style={{ fontWeight: '500' }}>{order.deliveryType || 'Самовывоз'}</p>
              </div>
            </div>
          </div>

          {/* Товары */}
          <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} />
              Товары ({order.items?.length || 0})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '500', marginBottom: '4px' }}>{item.product?.name || item.name}</p>
                    {item.variant && (
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.variant}</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.quantity} шт</p>
                    <p style={{ fontWeight: '500' }}>{item.price} ₸</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Промокод */}
          {order.promoCode && (
            <div className="card" style={{ marginBottom: '24px', padding: '20px', background: '#fef3c7' }}>
              <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={20} />
                Промокод
              </h3>
              <p style={{ fontWeight: '500' }}>{order.promoCode.code}</p>
              <p style={{ fontSize: '14px', color: '#92400e' }}>
                Скидка: {order.discount} ₸
              </p>
            </div>
          )}

          {/* Итого */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} />
              Итого
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Сумма товаров:</span>
                <span style={{ fontWeight: '500' }}>{order.subtotal} ₸</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Скидка:</span>
                  <span style={{ fontWeight: '500' }}>-{order.discount} ₸</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Доставка:</span>
                <span style={{ fontWeight: '500' }}>{order.deliveryFee} ₸</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '2px solid #e5e7eb',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                <span>Итого:</span>
                <span style={{ color: '#10b981' }}>{order.total} ₸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}