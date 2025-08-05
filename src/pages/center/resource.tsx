import React, { useState, useRef } from 'react'
import styles from './CreatorCenter.module.css'
import { postResource } from '../../router/api'
import { Button, Message, Input } from '@arco-design/web-react'

interface ResourceForm {
  title: string
  id: number
  files: File[]
}

// 默认表单数据
const DEFAULT_FORM_DATA: ResourceForm = {
  title: '',
  id: 0,
  files: []
}

const Resource = () => {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<ResourceForm>(DEFAULT_FORM_DATA)

  const handleInputChange = (
    value: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }))
    }
  }


  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!formData.files.length) {
      Message.error('请先选择要上传的文件')
      return
    }
    setLoading(true)

    try {
      const res = await postResource(formData.title, formData.id, formData.files)
      Message.success('上传成功！')
      setFormData(DEFAULT_FORM_DATA)
    } catch (err) {
      Message.error("上传失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.editorContainer}>
      <Input
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
                  <Button
                    onClick={() => handleRemoveFile(index)}
                    shape='circle'
                    className={styles.removeButton}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <span className={styles.fileName}>{file.name}</span>
                  <Button
                    onClick={() => handleRemoveFile(index)}
                    shape='circle'
                    className={styles.removeButton}
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Button
        type="primary"
        className={styles.submitButton}
        size="large"
        onClick={handleSubmit}
        disabled={loading || !formData.title.trim() || !formData.files.length}
      >
        {loading ? <div className={styles.loadingSpinner}></div> : '上传资料'}
      </Button>
    </div>
  )
}

export default Resource
