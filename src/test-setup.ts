// Setup chung cho vitest: i18n (useTranslation cần instance đã init) + cleanup RTL.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@/lib/i18n'

afterEach(() => cleanup())
