import React, { useState, useEffect } from 'react'
import styles from './MobileCreatorCenter.module.css'
import Qanda from './qanda'
import Resource from './resource'
type ContentType = 'qanda' | 'article' | 'team' | 'resource'

const CreatorCenter: React.FC = () => {
  const [activeType, setActiveType] = useState<ContentType>('qanda')
  // 内容类型配置
  const contentTypes = [
    { id: 'qanda', name: '问答', icon: '❓' },
    { id: 'resource', name: '资料', icon: '📚' }
  ]

  const handleTypeChange = (type: ContentType) => {
    setActiveType(type)
  }

  return (
    <div className={styles.container}>
      <div className={styles.creatorCenter}>
        <div className={styles.contentTypeSelector}>
          {contentTypes.map(type => (
            <button
              key={type.id}
              className={`${styles.typeButton} ${activeType === type.id ? styles.active : ''}`}
              onClick={() => handleTypeChange(type.id as ContentType)}
            >
              <span className={styles.typeIcon}>{type.icon}</span>
              <span className={styles.typeName}>{type.name}</span>
            </button>
          ))}
        </div>
        {/* 内容区条件渲染 */}
        <div className={styles.editorContainer}>
          {activeType === 'qanda' && <Qanda />}
          {activeType === 'resource' && <Resource />}
        </div>
      </div>
    </div>
  )
}

export default CreatorCenter
