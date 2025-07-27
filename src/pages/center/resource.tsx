import React, { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import styles from './CreatorCenter.module.css'
import { postResource } from '../../router/api'

interface ResourceForm {
  title: string
  id: number
  files: File[]
}

const Resource = () => {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<ResourceForm>({
    title: '',
    id: 0,
    files: []
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }))
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }


  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.files.length) {
      alert('请先选择要上传的文件')
      return
    }
    setLoading(true)

    try {
      const res = await postResource(formData.title, formData.id, formData.files)
      alert('上传成功！')
      setFormData({
        title: '',
        id: 0,
        files: []
      })
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.editorContainer}>
      <input
        type='text'
        name='title'
        value={formData.title}
        onChange={handleInputChange}
        placeholder='YYYYMMDD_描述.扩展名（必填）'
        className={styles.titleInput}
      />

      <div className={styles.fileUpload}>
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileChange}
          className={styles.fileInput}
          id='fileUpload'
        />
        <label htmlFor='fileUpload' className={styles.fileLabel}>
          <span className={styles.uploadIcon}>📎</span>
          上传文件
        </label>
      </div>

      {formData.files.length > 0 && (
        <div className={styles.filePreview}>
          {formData.files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              {file.type.startsWith('image/') ? (
                <div style={{ position: 'relative' }}>
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <span className={styles.fileName}>{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={loading || !formData.title.trim() || !formData.files.length}
      >
        {loading ? <div className={styles.loadingSpinner}></div> : '上传资料'}
      </button>
    </div>
  )
}

export default Resource
