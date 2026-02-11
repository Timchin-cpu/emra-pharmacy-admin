import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { categoriesAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function CategoryForm({ category, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    position: 0,
    isActive: true,
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        position: category.position || 0,
        isActive: category.isActive ?? true,
      })
    }
  }, [category])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Auto-generate slug from name
    if (name === 'name' && !category) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        position: parseInt(formData.position) || 0,
      }

      if (category) {
        await categoriesAPI.update(category.id, data)
        toast.success('Категория обновлена!')
      } else {
        await categoriesAPI.create(data)
        toast.success('Категория создана!')
      }

      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка сохранения категории')
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
        maxWidth: '600px',
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
          <h2>{category ? 'Редактировать категорию' : 'Создать категорию'}</h2>
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
          {/* Название */}
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Витамины и БАДы"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="form-group">
            <label>Slug (URL) *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="vitaminy-i-bady"
              pattern="[a-z0-9-]+"
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Только строчные латинские буквы, цифры и дефисы
            </small>
          </div>

          {/* Описание */}
          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Краткое описание категории..."
            />
          </div>

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

          {/* Активна */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Активна</span>
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
              {loading ? 'Сохранение...' : (category ? 'Обновить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}