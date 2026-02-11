import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function ImageUpload({ images, onChange, maxImages = 5 }) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const imageUrl = reader.result
        onChange([...images, imageUrl])
      }
      reader.readAsDataURL(file)
    })
  }, [images, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages
  })

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const addImageByUrl = () => {
    const url = prompt('Введите URL изображения:')
    if (url && url.trim()) {
      onChange([...images, url.trim()])
    }
  }

  return (
    <div>
      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed #e5e7eb',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? '#f0fdf4' : '#fafafa',
            transition: 'all 0.2s',
            marginBottom: '16px'
          }}
        >
          <input {...getInputProps()} />
          <Upload size={40} style={{ margin: '0 auto 12px', color: '#6b7280' }} />
          {isDragActive ? (
            <p style={{ color: '#10b981', fontWeight: '500' }}>
              Отпустите файлы здесь...
            </p>
          ) : (
            <>
              <p style={{ marginBottom: '8px', fontWeight: '500' }}>
                Перетащите изображения сюда или кликните для выбора
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                PNG, JPG, GIF до 5MB (максимум {maxImages} изображений)
              </p>
            </>
          )}
        </div>
      )}

      {/* Add by URL Button */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={addImageByUrl}
          className="btn btn-outline"
          style={{ width: '100%', marginBottom: '16px' }}
        >
          <ImageIcon size={16} />
          Добавить по URL
        </button>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '12px'
        }}>
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                aspectRatio: '1',
              }}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/120?text=Error'
                }}
              />
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
              {/* Primary Badge */}
              {index === 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '4px',
                  background: '#10b981',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  Главное
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <small style={{ display: 'block', marginTop: '12px', color: '#6b7280', fontSize: '12px' }}>
          Первое изображение будет использоваться как главное
        </small>
      )}
    </div>
  )
}