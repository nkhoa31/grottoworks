import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './lib/auth.tsx'
import { worker } from './mocks/browser.ts'

async function bootstrap() {
  // Bật MSW ở dev và ở preview build, trừ khi VITE_ENABLE_MSW=off.
  if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== 'off') {
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
}

void bootstrap()
