import { useState, useEffect } from 'react'
import { bannersAPI } from '../services/api'
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import BannerForm from '../components/BannerForm'

export default function Banners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      const { data } = await bannersAPI.getAll()
      setBanners(data.data || [])
    } catch (error) {
      toast.error('Ошибка загрузки баннеров')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBanner(null)
    setShowForm(true)
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setShowForm(true)
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить баннер "${title}"?`)) return

    try {
      await bannersAPI.delete(id)
      toast.success('Баннер удалён')
      loadBanners()
    } catch (error) {
      toast.error('Ошибка удаления баннера')
    }
  }

  const handleMoveUp = async (banner, index) => {
    if (index === 0) return

    const prevBanner = banners[index - 1]
    
    try {
      await bannersAPI.update(banner.id, { position: prevBanner.position })
      await bannersAPI.update(prevBanner.id, { position: banner.position })
      toast.success('Позиция изменена')
      loadBanners()
    } catch (error) {
      toast.error('Ошибка изменения позиции')
    }
  }

  const handleMoveDown = async (banner, index) => {
    if (index === banners.length - 1) return

    const nextBanner = banners[index + 1]
    
    try {
      await bannersAPI.update(banner.id, { position: nextBanner.position })
      await bannersAPI.update(nextBanner.id, { position: banner.position })
      toast.success('Позиция изменена')
      loadBanners()
    } catch (error) {
      toast.error('Ошибка изменения позиции')
    }
  }

  const handleToggleActive = async (banner) => {
    try {
      await bannersAPI.update(banner.id, { isActive: !banner.isActive })
      toast.success(banner.isActive ? 'Баннер деактивирован' : 'Баннер активирован')
      loadBanners()
    } catch (error) {
      toast.error('Ошибка изменения статуса')
    }
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Баннеры</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Всего: {banners.length} баннеров • Активных: {banners.filter(b => b.isActive).length}
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={20} />
          Добавить баннер
        </button>
      </div>

      {/* Banners Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {banners.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <p>Нет баннеров. Создайте первый!</p>
            </div>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                opacity: banner.isActive ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              {/* Banner Image */}
              <div style={{ position: 'relative' }}>
                <img
                  src={banner.image}
                  alt={banner.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
                  }}
                />
                
                {/* Position Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  #{banner.position}
                </div>

                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}>
                  <span
                    className={`badge ${banner.isActive ? 'badge-success' : 'badge-danger'}`}
                  >
                    {banner.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                </div>
              </div>

              {/* Banner Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>
                  {banner.title}
                </h3>
                
          {banner.linkType !== 'NONE' && banner.linkValue && (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px'
  }}>
    <ExternalLink size={14} />
    <span style={{
      padding: '2px 6px',
      background: '#dbeafe',
      color: '#1e40af',
      borderRadius: '3px',
      fontSize: '11px',
      fontWeight: '500'
    }}>
      {banner.linkType}
    </span>
    <code style={{
      padding: '2px 6px',
      background: '#f3f4f6',
      borderRadius: '3px'
    }}>
      {banner.linkValue}
    </code>
  </div>
)}

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  {/* Move Buttons */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleMoveUp(banner, index)}
                      disabled={index === 0}
                      className="btn btn-outline"
                      style={{
                        padding: '6px 10px',
                        fontSize: '12px',
                        opacity: index === 0 ? 0.3 : 1
                      }}
                      title="Переместить вверх"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(banner, index)}
                      disabled={index === banners.length - 1}
                      className="btn btn-outline"
                      style={{
                        padding: '6px 10px',
                        fontSize: '12px',
                        opacity: index === banners.length - 1 ? 0.3 : 1
                      }}
                      title="Переместить вниз"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div style={{ flex: 1 }} />

                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    {banner.isActive ? 'Деактивировать' : 'Активировать'}
                  </button>

                  {/* Edit */}
                  <button
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => handleDelete(banner.id, banner.title)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => {
            setShowForm(false)
            setEditingBanner(null)
          }}
          onSuccess={loadBanners}
        />
      )}
    </div>
  )
}