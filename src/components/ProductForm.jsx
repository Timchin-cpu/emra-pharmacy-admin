import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { categoriesAPI, productsAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function ProductForm({ product, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    discountPercent: '',
    categoryId: '',
    variants: '',
    stock: '',
    tag: '',
    image: '',
    ingredients: '',
    usage: '',
    safety: '',
    isFeatured: false,
    isActive: true,
  })

  useEffect(() => {
    loadCategories()
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        discountPercent: product.discountPercent || '',
        categoryId: product.categoryId || '',
        variants: product.variants?.join(', ') || '',
        stock: product.stock || '',
        tag: product.tag || '',
        image: product.image || '',
        ingredients: product.ingredients || '',
        usage: product.usage || '',
        safety: product.safety || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive ?? true,
      })
    }
  }, [product])

  const loadCategories = async () => {
    try {
      const { data } = await categoriesAPI.getAll()
      setCategories(data.data || [])
    } catch (error) {
      toast.error('Ошибка загрузки категорий')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        discountPercent: formData.discountPercent ? parseInt(formData.discountPercent) : null,
        stock: parseInt(formData.stock),
        variants: formData.variants ? formData.variants.split(',').map(v => v.trim()).filter(Boolean) : [],
      }

      if (product) {
        // Update
        await productsAPI.update(product.id, data)
        toast.success('Товар обновлён!')
      } else {
        // Create
        await productsAPI.create(data)
        toast.success('Товар создан!')
      }

      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка сохранения товара')
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
        overflow: 'auto',
        position: 'relative'
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
          <h2>{product ? 'Редактировать товар' : 'Создать товар'}</h2>
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
          <div className="form-grid">
            {/* SKU */}
            <div className="form-group">
              <label>SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="VIT-C-1000"
              />
            </div>

            {/* Название */}
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Витамин C 1000мг"
              />
            </div>

            {/* Категория */}
            <div className="form-group">
              <label>Категория *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Цена */}
            <div className="form-group">
              <label>Цена *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="8.99"
              />
            </div>

            {/* Старая цена */}
            <div className="form-group">
              <label>Старая цена</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="12.99"
              />
            </div>

            {/* Скидка % */}
            <div className="form-group">
              <label>Скидка %</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="30"
              />
            </div>

            {/* Остаток */}
            <div className="form-group">
              <label>Остаток *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="100"
              />
            </div>

            {/* Тег */}
            <div className="form-group">
              <label>Тег</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Новинка, Хит продаж"
              />
            </div>
          </div>

          {/* Описание */}
          <div className="form-group">
            <label>Описание *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Подробное описание товара..."
            />
          </div>

          {/* Варианты */}
          <div className="form-group">
            <label>Варианты (через запятую)</label>
            <input
              type="text"
              name="variants"
              value={formData.variants}
              onChange={handleChange}
              placeholder="30 таблеток, 60 таблеток, 90 таблеток"
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Например: 30 таблеток, 60 таблеток, 90 таблеток
            </small>
          </div>

          {/* Изображение */}
          <div className="form-group">
            <label>URL изображения *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://images.unsplash.com/photo-..."
            />
            {formData.image && (
              <div style={{ marginTop: '12px' }}>
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
              </div>
            )}
          </div>

          {/* Состав */}
          <div className="form-group">
            <label>Состав</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows="2"
              placeholder="Аскорбиновая кислота 1000 мг, наполнители..."
            />
          </div>

          {/* Применение */}
          <div className="form-group">
            <label>Применение</label>
            <textarea
              name="usage"
              value={formData.usage}
              onChange={handleChange}
              rows="2"
              placeholder="По 1 таблетке в день во время еды"
            />
          </div>

          {/* Предостережения */}
          <div className="form-group">
            <label>Предостережения</label>
            <textarea
              name="safety"
              value={formData.safety}
              onChange={handleChange}
              rows="2"
              placeholder="Не превышать рекомендуемую дозу..."
            />
          </div>

          {/* Чекбоксы */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span>Рекомендуемый товар</span>
            </label>

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
              {loading ? 'Сохранение...' : (product ? 'Обновить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}