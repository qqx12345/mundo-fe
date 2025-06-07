import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.split('/').pop()

  const categories = [
    { path: 'math1', label: '高数上' },
    { path: 'math2', label: '高数下' },
    { path: 'physics1', label: '大物上' },
    { path: 'physics2', label: '大物下' },
    { path: 'c-language', label: 'C语言' },
    { path: 'others', label: '其他' }
  ]

  return (
    <div className={styles.navbar}>
      {categories.map(({ path, label }) => (
        <div
          key={path}
          className={`${styles.navItem} ${currentPath === path ? styles.active : ''}`}
          onClick={() => navigate(`/datastation/${path}`)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

const itemStyle: React.CSSProperties = {
  padding: '13px',
  cursor: 'pointer',
  borderBottom: '1px solid #ddd',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  borderRadius: '4px',
  margin: '5px 0'
}

// 修改 CSS 样式表
const styleSheet = document.createElement('style')
styleSheet.textContent = `
    .nav-item {
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
        text-align: center;
        transition: all 0.3s ease !important;
        border-radius: 4px;
        margin: 5px 0;
    }
    
    .nav-item:hover:not([style*="background-color: rgb(24, 144, 255)"]) {
        background-color: #00a6ffa5 !important;
    }
`
document.head.appendChild(styleSheet)

export default Navbar
