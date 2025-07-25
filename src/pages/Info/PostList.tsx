import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Post.css'
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
    if (!longtoken) {
      Notification.info({
        closable: false,
        title: '请先登录',
        content: '请先登录后再进行操作。'
      })
      return
    }
    navigate(`/qanda/${messageId}`) //导航到帖子详情
  }

  const getStatusText = (statu: string) => {
    if (statu === 'approved') return '已发布'
    else if (statu === 'pending') return '审核中'
    else if (statu === 'rejected') return '未通过审核'
    else return '未知状态'
  }

  const handlePostDelete = async (id: number) => {
    try {
      await deleteMyPost(longtoken, id)
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
    <div className='flex flex-col px-[1.2rem] postListContainer'>
      {data.reverse().map(message => (
        <>
          <div
            key={message.id}
            className='w-full h-[100px]  py-[8px] flex gap-[1rem] border-b border-white/10 postItem'
            onClick={() => handleMessageClick(message.id, message.status)}
          >
            <div
              className='postDeleteIconContainer'
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <Popconfirm
                focusLock
                title='删除帖子'
                content='帖子删除后无法恢复，确认删除？'
                onOk={() => {
                  handlePostDelete(message.id)
                }}
                onCancel={() => {}}
              >
                <IconDelete className='postDeleteIcon' />
              </Popconfirm>
            </div>

            <div className={`statusContainer ${message.status}`}>
              {getStatusText(message.status)}
            </div>
            <div className='w-full flex flex-1 flex-col gap-[10px]'>
              <div className='flex flex-col gap-[6px]'>
                <div className='font-semibold text-[18px]  text-[--color-text-1] text-left overflow-hidden text-ellipsis whitespace-nowrap'>
                  {message.title ? message.title : '无标题'}
                </div>
                <div className='font-medium text-[15px] leading-[22px] text-[--color-text-2] text-left overflow-hidden text-ellipsis whitespace-nowrap'>
                  {message.content ? message.content : '无内容'}
                </div>
              </div>

              <div className='flex w-full justify-between'>
                <div className='flex gap-[20px] text-[--color-text-3]'>
                  <span className='text-[12px] font-base'>👁️ {message.view} 浏览</span>
                  <span className='text-[12px] font-base'>
                    💬 {message.answer_count} 回复
                  </span>
                  {/* <span>🕒 {new Date(message.created_at).toLocaleDateString()}</span> */}
                </div>
                <div className='flex gap-[5px] max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap'>
                  {message.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='flex items-center justify-center px-[6px] rounded-[4px] text-[--color-text-1] text-[12px] font-base bg-[#030329]'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {message.picture && message.picture.length > 0 && (
              <div className='flex w-[108px] h-[72px]'>
                <img
                  src={`data:image/jpeg;base64,${message.picture[0]}`}
                  alt='Message'
                  className='w-full h-full object-cover'
                  onError={() => {
                    console.error('图片加载失败:', message.picture[0])
                  }}
                />
              </div>
            )}
          </div>
        </>
      ))}
    </div>
  )
}
export default PostList
