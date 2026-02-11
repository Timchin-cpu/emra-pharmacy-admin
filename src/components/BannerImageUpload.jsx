import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Link as LinkIcon } from 'lucide-react'

export default function BannerImageUpload({ image, onChange }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        onChange(reader.result)
      }
      reader.readAsDataURL(acceptedFiles[0])
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: false
  })

  const removeImage = () => {
    onChange('')
  }

  const addImageByUrl = () => {
    const url = prompt('Введите URL изображения баннера:')
    if (url && url.trim()) {
      onChange(url.trim())
    }
  }

  return (
    <div>
      {!image ? (
        <>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #e5e7eb',
              borderRadius: '8px',
              padding: '48px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragActive ? '#f0fdf4' : '#fafafa',
              transition: 'all 0.2s',
              marginBottom: '16px'
            }}
          >
            <input {...getInputProps()} />
            <Upload size={48} style={{ margin: '0 auto 16px', color: '#6b7280' }} />
            {isDragActive ? (
              <p style={{ color: '#10b981', fontWeight: '500', fontSize: '16px' }}>
                Отпустите изображение здесь...
              </p>
            ) : (
              <>
                <p style={{ marginBottom: '8px', fontWeight: '500', fontSize: '16px' }}>
                  Перетащите изображение баннера сюда
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  или кликните для выбора файла
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  PNG, JPG, GIF до 10MB • Рекомендуемый размер: 1200x400 пикселей
                </p>
              </>
            )}
          </div>

          {/* Add by URL Button */}
          <button
            type="button"
            onClick={addImageByUrl}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            <LinkIcon size={16} />
            Или добавить по URL
          </button>
        </>
      ) : (
        /* Image Preview */
        <div style={{ position: 'relative' }}>
          <img
            src={image}
            alt="Banner preview"
            style={{
              width: '100%',
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x400?text=Error+Loading+Image'
            }}
          />
          
          {/* Remove Button */}
          <button
            type="button"
            onClick={removeImage}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            <X size={16} />
            Удалить
          </button>

          {/* Change Image Button */}
          <div style={{
            marginTop: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              type="button"
              onClick={() => removeImage()}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              <Upload size={16} />
              Изменить изображение
            </button>
            <button
              type="button"
              onClick={addImageByUrl}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              <LinkIcon size={16} />
              Изменить URL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}