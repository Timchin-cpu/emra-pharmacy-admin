import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { bannersAPI } from '../services/api'
import toast from 'react-hot-toast'
import BannerImageUpload from './BannerImageUpload'

export default function BannerFormEnhanced({ banner, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    linkType: 'NONE',
    linkValue: '',
    position: 0,
    isActive: true,
  })

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        image: banner.image || '',
        linkType: banner.linkType || 'NONE',
        linkValue: banner.linkValue || '',
        position: banner.position || 0,
        isActive: banner.isActive ?? true,
      })
    }
  }, [banner])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (newImage) => {
    setFormData(prev => ({ ...prev, image: newImage }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const imageUrl = formData.image && formData.image.trim() !== '' 
        ? formData.image 
        : 'https://via.placeholder.com/1200x400?text=Banner'

      const data = {
        title: formData.title,
        image: imageUrl,
        linkType: formData.linkType,
        linkValue: formData.linkType === 'NONE' ? null : (formData.linkValue || null),
        position: parseInt(formData.position) || 0,
        isActive: formData.isActive,
      }

      if (banner) {
        await bannersAPI.update(banner.id, data)
        toast.success('Баннер обновлён!')
      } else {
        await bannersAPI.create(data)
        toast.success('Баннер создан!')
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Banner save error:', error)
      toast.error(error.response?.data?.message || 'Ошибка сохранения баннера')
    } finally {
      setLoading(false)
    }
  }

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
          <h2>{banner ? 'Редактировать баннер' : 'Создать баннер'}</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Заголовок */}
          <div className="form-group">
            <label>Заголовок *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Скидка 50% на все витамины!"
              autoFocus
            />
          </div>

          {/* Изображение с Drag & Drop */}
          <div className="form-group">
            <label>Изображение баннера</label>
            <BannerImageUpload
              image={formData.image}
              onChange={handleImageChange}
            />
          </div>

          {/* Тип ссылки */}
          <div className="form-group">
            <label>Тип ссылки</label>
            <select
              name="linkType"
              value={formData.linkType}
              onChange={handleChange}
              required
            >
              <option value="NONE">Без ссылки</option>
              <option value="CATEGORY">Категория</option>
              <option value="PRODUCT">Товар</option>
              <option value="URL">Произвольная ссылка</option>
            </select>
          </div>

          {/* Значение ссылки */}
          {formData.linkType !== 'NONE' && (
            <div className="form-group">
              <label>
                {formData.linkType === 'CATEGORY' && 'ID категории'}
                {formData.linkType === 'PRODUCT' && 'ID товара'}
                {formData.linkType === 'URL' && 'URL ссылки'}
              </label>
              <input
                type="text"
                name="linkValue"
                value={formData.linkValue}
                onChange={handleChange}
                placeholder={
                  formData.linkType === 'CATEGORY' ? 'abc123-def456...' :
                  formData.linkType === 'PRODUCT' ? 'xyz789-ghi012...' :
                  '/products?sale=true'
                }
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                {formData.linkType === 'CATEGORY' && 'UUID категории из списка категорий'}
                {formData.linkType === 'PRODUCT' && 'UUID товара из списка товаров'}
                {formData.linkType === 'URL' && 'Любая ссылка (например, /products?sale=true)'}
              </small>
            </div>
          )}

          {/* Позиция */}
          <div className="form-group">
            <label>Позиция (порядок отображения)</label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Меньшее число = выше в списке
            </small>
          </div>

          {/* Активен */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Активен</span>
            </label>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : (banner ? 'Обновить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}