import { useState, useEffect } from 'react'
import { categoriesAPI } from '../services/api'
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import CategoryForm from '../components/CategoryForm'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data } = await categoriesAPI.getAll()
      setCategories(data.data || [])
    } catch (error) {
      toast.error('Ошибка загрузки категорий')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDelete = async (id, name, productsCount) => {
    if (productsCount > 0) {
      toast.error(`Невозможно удалить. В категории "${name}" есть ${productsCount} товаров`)
      return
    }

    if (!window.confirm(`Удалить категорию "${name}"?`)) return

    try {
      await categoriesAPI.delete(id)
      toast.success('Категория удалена')
      loadCategories()
    } catch (error) {
      toast.error('Ошибка удаления категории')
    }
  }

  const handleMoveUp = async (category, index) => {
    if (index === 0) return

    const prevCategory = categories[index - 1]
    
    try {
      await categoriesAPI.update(category.id, { position: prevCategory.position })
      await categoriesAPI.update(prevCategory.id, { position: category.position })
      toast.success('Позиция изменена')
      loadCategories()
    } catch (error) {
      toast.error('Ошибка изменения позиции')
    }
  }

  const handleMoveDown = async (category, index) => {
    if (index === categories.length - 1) return

    const nextCategory = categories[index + 1]
    
    try {
      await categoriesAPI.update(category.id, { position: nextCategory.position })
      await categoriesAPI.update(nextCategory.id, { position: category.position })
      toast.success('Позиция изменена')
      loadCategories()
    } catch (error) {
      toast.error('Ошибка изменения позиции')
    }
  }

  const handleToggleActive = async (category) => {
    try {
      await categoriesAPI.update(category.id, { isActive: !category.isActive })
      toast.success(category.isActive ? 'Категория деактивирована' : 'Категория активирована')
      loadCategories()
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
          <h1 style={{ marginBottom: '4px' }}>Категории</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Всего: {categories.length} категорий
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={20} />
          Добавить категорию
        </button>
      </div>

      {/* Categories List */}
      <div className="card">
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>Нет категорий. Создайте первую!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map((category, index) => (
              <div
                key={category.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: category.isActive ? 'white' : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
              >
                {/* Position Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => handleMoveUp(category, index)}
                    disabled={index === 0}
                    style={{
                      background: 'transparent',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      opacity: index === 0 ? 0.3 : 1
                    }}
                    title="Переместить вверх"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(category, index)}
                    disabled={index === categories.length - 1}
                    style={{
                      background: 'transparent',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      padding: '4px',
                      cursor: index === categories.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: index === categories.length - 1 ? 0.3 : 1
                    }}
                    title="Переместить вниз"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>

                {/* Position Number */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  {category.position}
                </div>

                {/* Category Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    marginBottom: '4px',
                    opacity: category.isActive ? 1 : 0.5
                  }}>
                    {category.name}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <code style={{
                      padding: '2px 8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      /{category.slug}
                    </code>
                    {category.description && (
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {category.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Products Count */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <Package size={16} />
                  <span>{category._count?.products || 0}</span>
                </div>

                {/* Status */}
                <button
                  onClick={() => handleToggleActive(category)}
                  className={`badge ${category.isActive ? 'badge-success' : 'badge-danger'}`}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {category.isActive ? 'Активна' : 'Неактивна'}
                </button>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '8px 12px' }}
                    onClick={() => handleEdit(category)}
                    title="Редактировать"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '8px 12px' }}
                    onClick={() => handleDelete(category.id, category.name, category._count?.products || 0)}
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowForm(false)
            setEditingCategory(null)
          }}
          onSuccess={loadCategories}
        />
      )}
    </div>
  )
}