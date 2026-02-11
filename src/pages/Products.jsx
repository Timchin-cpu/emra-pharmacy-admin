import { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'
import { Plus, Edit, Trash2, Search, Download, CheckSquare, Square } from 'lucide-react'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import ProductFormEnhanced from '../components/ProductFormEnhanced'

export default function ProductsEnhanced() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data } = await productsAPI.getAll()
      setProducts(data.data.products || [])
    } catch (error) {
      toast.error('Ошибка загрузки товаров')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Удалить товар "${name}"?`)) return

    try {
      await productsAPI.delete(id)
      toast.success('Товар удалён')
      loadProducts()
    } catch (error) {
      toast.error('Ошибка удаления товара')
    }
  }

  const handleToggleActive = async (product) => {
    try {
      await productsAPI.toggle(product.id)
      toast.success(product.isActive ? 'Товар деактивирован' : 'Товар активирован')
      loadProducts()
    } catch (error) {
      toast.error('Ошибка изменения статуса')
    }
  }

  // Selection
  const toggleSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (!window.confirm(`Удалить ${selectedProducts.length} товаров?`)) return

    try {
      await Promise.all(selectedProducts.map(id => productsAPI.delete(id)))
      toast.success(`Удалено ${selectedProducts.length} товаров`)
      setSelectedProducts([])
      loadProducts()
    } catch (error) {
      toast.error('Ошибка массового удаления')
    }
  }

  const handleBulkActivate = async (active) => {
    try {
      await Promise.all(
        selectedProducts.map(id => {
          const product = products.find(p => p.id === id)
          if (product && product.isActive !== active) {
            return productsAPI.toggle(id)
          }
          return Promise.resolve()
        })
      )
      toast.success(`${selectedProducts.length} товаров ${active ? 'активировано' : 'деактивировано'}`)
      setSelectedProducts([])
      loadProducts()
    } catch (error) {
      toast.error('Ошибка массового изменения')
    }
  }

  const handleBulkUpdateCategory = async () => {
    const categoryId = prompt('Введите ID новой категории:')
    if (!categoryId) return

    try {
      await Promise.all(
        selectedProducts.map(id =>
          productsAPI.update(id, { categoryId })
        )
      )
      toast.success(`Категория изменена для ${selectedProducts.length} товаров`)
      setSelectedProducts([])
      loadProducts()
    } catch (error) {
      toast.error('Ошибка изменения категории')
    }
  }

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredProducts.map(p => ({
      'SKU': p.sku,
      'Название': p.name,
      'Категория': p.category?.name || '',
      'Цена': p.price,
      'Старая цена': p.oldPrice || '',
      'Скидка %': p.discountPercent || '',
      'Остаток': p.stock,
      'Тег': p.tag || '',
      'Активен': p.isActive ? 'Да' : 'Нет',
      'Рекомендуемый': p.isFeatured ? 'Да' : 'Нет',
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Товары')
    
    // Auto-width columns
    const maxWidth = exportData.reduce((w, r) => {
      return Object.keys(r).map((k, i) => 
        Math.max(w[i] || 10, String(r[k]).length)
      )
    }, [])
    ws['!cols'] = maxWidth.map(w => ({ width: w + 2 }))

    XLSX.writeFile(wb, `products_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel файл загружен!')
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 style={{ marginBottom: '4px' }}>Товары</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Всего: {products.length} • Выбрано: {selectedProducts.length}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={handleExportExcel}>
            <Download size={20} />
            Экспорт Excel
          </button>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={20} />
            Добавить товар
          </button>
        </div>
      </div>

      {/* Search & Bulk Actions */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
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
              placeholder="Поиск по названию или SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px', marginBottom: 0 }}
            />
          </div>

          {selectedProducts.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline"
                onClick={() => handleBulkActivate(true)}
                style={{ fontSize: '13px' }}
              >
                Активировать ({selectedProducts.length})
              </button>
              <button
                className="btn btn-outline"
                onClick={() => handleBulkActivate(false)}
                style={{ fontSize: '13px' }}
              >
                Деактивировать ({selectedProducts.length})
              </button>
              <button
                className="btn btn-outline"
                onClick={handleBulkUpdateCategory}
                style={{ fontSize: '13px' }}
              >
                Изменить категорию
              </button>
              <button
                className="btn btn-danger"
                onClick={handleBulkDelete}
                style={{ fontSize: '13px' }}
              >
                Удалить ({selectedProducts.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>{searchTerm ? 'Товары не найдены' : 'Нет товаров. Создайте первый!'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <button
                      onClick={toggleSelectAll}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {selectedProducts.length === filteredProducts.length ? (
                        <CheckSquare size={20} color="#10b981" />
                      ) : (
                        <Square size={20} color="#6b7280" />
                      )}
                    </button>
                  </th>
                  <th style={{ width: '80px' }}>Фото</th>
                  <th>Название</th>
                  <th style={{ width: '120px' }}>SKU</th>
                  <th style={{ width: '100px' }}>Цена</th>
                  <th style={{ width: '80px' }}>Остаток</th>
                  <th style={{ width: '100px' }}>Категория</th>
                  <th style={{ width: '100px' }}>Статус</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} style={{ background: selectedProducts.includes(product.id) ? '#f0fdf4' : 'white' }}>
                    <td>
                      <button
                        onClick={() => toggleSelection(product.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        {selectedProducts.includes(product.id) ? (
                          <CheckSquare size={20} color="#10b981" />
                        ) : (
                          <Square size={20} color="#6b7280" />
                        )}
                      </button>
                    </td>
                    <td>
  <div style={{ position: 'relative' }}>
    <img
      src={product.image}
      alt={product.name}
      style={{
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}
    />
    {product.images && product.images.length > 0 && (
      <div style={{
        position: 'absolute',
        bottom: '2px',
        right: '2px',
        background: '#10b981',
        color: 'white',
        fontSize: '10px',
        fontWeight: '600',
        padding: '2px 5px',
        borderRadius: '3px',
        lineHeight: 1
      }}>
        +{product.images.length}
      </div>
    )}
  </div>
</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{product.name}</div>
                        {product.tag && (
                          <span className="badge badge-info" style={{ marginTop: '4px', display: 'inline-block' }}>
                            {product.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <code style={{ padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '12px' }}>
                        {product.sku}
                      </code>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{product.price} ₸</div>
                        {product.oldPrice && (
                          <div style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through' }}>
                            {product.oldPrice} ₸
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: product.stock < 10 ? '#ef4444' : '#10b981', fontWeight: '500' }}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {product.category?.name || '—'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none', transition: 'opacity 0.2s' }}
                      >
                        {product.isActive ? 'Активен' : 'Неактивен'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '8px 12px' }}
                          onClick={() => handleEdit(product)}
                          title="Редактировать"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '8px 12px' }}
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProductFormEnhanced
          product={editingProduct}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
          onSuccess={loadProducts}
        />
      )}
    </div>
  )
}