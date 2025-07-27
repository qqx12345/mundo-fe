import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header/Header'
import styles from './CreatorCenter.module.css'
import { fetchTags, post } from '../../router/api'
type ContentType = 'qanda' | 'article' | 'team' | 'resource'
import Editor from '@/components/QuillEditor'

interface ContentForm {
  title: string
  content: string
  type: ContentType
  tags: Tag[]
  files: File[]
}

type Tag = {
  id: number
  name: string
  category: string
  description: string
}

const Qanda = () => {
  const { longtoken } = useAuth()
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ContentForm>({
    title: '',
    content: '',
    type: 'qanda',
    tags: [],
    files: []
  })

  useEffect(() => {
    fetchTags().then(res => {
      setTags(res.data.data.tags)
    })
  }, [longtoken])

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
  }

  const handleTagToggle = (tag: Tag) => {
    setFormData(prev => {
      const isSelected = prev.tags.some(t => t.id === tag.id)
      return {
        ...prev,
        tags: isSelected ? prev.tags.filter(t => t.id !== tag.id) : [...prev.tags, tag]
      }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('content', formData.content)
    formDataToSend.append('type', formData.type)
    formData.tags.forEach(tag => {
      formDataToSend.append('tags', tag.name)
    })
    formData.files.forEach(file => {
      formDataToSend.append(`picture`, file)
    })
    post(formDataToSend)
      .then(res => {
        if (res.data.code == 200) {
          alert('发布成功！')
        }
        setFormData({
          title: '',
          content: '',
          type: 'qanda',
          tags: [],
          files: []
        })
        setLoading(false)
      })
      .catch(err => {
        alert('发布失败！')
        setLoading(false)
      })
  }

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className={styles.editorContainer}>
      <input
        type='text'
        name='title'
        value={formData.title}
        onChange={handleInputChange}
        placeholder='输入标题（必填）'
        className={styles.titleInput}
      />

      <div className={styles.tagContainer}>
        {tags.map(tag => (
          <span
            key={tag.id}
            className={`${styles.tag} ${formData.tags.some(t => t.id === tag.id) ? styles.tagActive : ''}`}
            onClick={() => handleTagToggle(tag)}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <textarea
        name='content'
        value={formData.content}
        onChange={handleInputChange}
        placeholder='输入内容（必填）'
        className={styles.contentInput}
      />

      <div className={styles.fileUpload}>
        <input
          type='file'
          accept='image/*'
          multiple
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
                <span className={styles.fileName}>{file.name}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={loading || !formData.title.trim() || !formData.content.trim()}
      >
        {loading ? <div className={styles.loadingSpinner}></div> : '发布内容'}
      </button>
    </div>
  )
}

export default Qanda