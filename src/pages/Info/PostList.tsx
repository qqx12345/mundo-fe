import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Spin,
  Empty,
  Card,
  Typography,
  Notification,
  Popconfirm
} from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { Post } from '@/interfaces/post'
import { get } from 'lodash'
import { deleteMyPost } from '@/router/api'
import styles from './post.module.css'

const PostList = ({
  data,
  loading,
  onRefresh
}: {
  data: Post[]
  loading: boolean
  onRefresh: () => void
}) => {
  const navigate = useNavigate()
  let longtoken = localStorage.getItem('longtoken')

  if (loading) return <Spin />
  if (data.length === 0) return <Empty description='暂无帖子' />

  const handleMessageClick = (messageId: number, statu: string) => {
    if (statu === 'rejected') {
      Notification.info({
        closable: true,
        title: '无法查看',
        content: '审核未通过的帖子会被作废，请遵循社区规则'
      })
      return
    }
    navigate(`/qanda/${messageId}`) //导航到帖子详情
  }

  const getStatusText = (statu: string) => {
    const statusMap: { [key: string]: string } = {
      approved: '已发布',
      pending: '审核中',
      rejected: '未通过审核'
    }
    return statusMap[statu] || '未知状态'
  }

  const handlePostDelete = async (id: number) => {
    try {
      await deleteMyPost(id)
      Notification.info({
        closable: true,
        title: '删除成功',
        content: '您的帖子已被删除！'
      })
      onRefresh && onRefresh() // 删除后刷新
    } catch (e) {
      Notification.info({
        closable: false,
        title: '删除失败',
        content: '删除失败，请稍后再试或联系开发人员'
      })
    }
  }

  return (
    <div className={styles.postListContainer}>
      {data.reverse().map(message => (
        <div
          key={message.id}
          className={styles.postItem}
          onClick={() => handleMessageClick(message.id, message.status)}
        >
          <div className={styles.postContainer}>
            <div className={styles.postContentContainer}>
              <div className={styles.textContainer}>
                <div className={styles.title}>
                  {message.title ? message.title : '无标题'}
                </div>
                <div className={styles.content}>
                  {message.content ? message.content : '无内容'}
                </div>
              </div>

              <div className={styles.statsContainer}>
                <div className={styles.stats}>
                  <span className={styles.statItem}>👁️ {message.view} 浏览</span>
                  <span className={styles.statItem}>💬 {message.answer_count} 回复</span>
                </div>
                <div className={styles.tagsContainer}>
                  {message.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {message.picture && message.picture.length > 0 && (
              <div className={styles.imageContainer}>
                <img
                  src={`data:image/jpeg;base64,${message.picture[0]}`}
                  alt='Message'
                  className={styles.image}
                  onError={() => {
                    console.error('图片加载失败:', message.picture[0])
                  }}
                />
              </div>
            )}
          </div>

          <div className={styles.manageContainer}>
            <div className={`${styles.statusContainer} ${styles[message.status]}`}>
              {getStatusText(message.status)}
            </div>

            <div
              className={styles.postDeleteIconContainer}
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <Popconfirm
                focusLock
                title='删除帖子'
                content='帖子删除后无法恢复，确认删除？'
                onOk={() => handlePostDelete(message.id)}
                onCancel={() => {}}
              >
                <IconDelete className={styles.postDeleteIcon} />
              </Popconfirm>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default PostList
