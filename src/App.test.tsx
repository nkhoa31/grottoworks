import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('chưa có phiên → chuyển hướng sang trang đăng nhập', async () => {
    render(<App />)
    expect(await screen.findByLabelText('Email')).toBeDefined()
    expect(screen.getByLabelText('Mật khẩu')).toBeDefined()
  })

  it('route lạ → trang 404', async () => {
    window.history.pushState({}, '', '/khong-ton-tai')
    render(<App />)
    expect(await screen.findByText('Không tìm thấy trang')).toBeDefined()
  })
})
