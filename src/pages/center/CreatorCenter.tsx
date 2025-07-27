import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header/Header'
import styles from './CreatorCenter.module.css'
import Qanda from './qanda'
import Resource from './resource'
import MobileCreatorCenter from './MobileCreatorCenter'
type ContentType = 'qanda' | 'article' | 'team' | 'resource'
import Editor from '@/components/QuillEditor'

const CreatorCenter: React.FC = () => {
  const [activeType, setActiveType] = useState<ContentType>('qanda')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  // 内容类型配置
  const contentTypes = [
    { id: 'qanda', name: '问答', icon: '❓' },
    // { id: 'article', name: '文章', icon: '📝' }
    // { id: 'team', name: '组队', icon: '👥' },
    { id: 'resource', name: '资料', icon: '📚' }
  ]


  const handleTypeChange = (type: ContentType) => {
    setActiveType(type)
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {isMobile ? (
        <MobileCreatorCenter />
      ) : (
        <div className={styles.container}>
          {/* <Header /> */}
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
            {activeType === 'qanda' && <Qanda />}
            {activeType === 'resource' && <Resource />}
          </div>
        </div>
      )}
    </>
  )
}

export default CreatorCenter
