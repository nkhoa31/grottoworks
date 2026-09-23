import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { Snowfall } from '@/components/shared/Snowfall'
import type { Role } from '@/types'

const schema = z.object({
  email: z.string().min(1, 'login.emailRequired'),
  password: z.string().min(1, 'login.passwordRequired'),
})
type FormData = z.infer<typeof schema>

const DEMO: { role: Role; email: string }[] = [
  { role: 'ADMIN', email: 'admin@grottoworks.vn' },
  { role: 'COMMITTEE', email: 'committee@grottoworks.vn' },
  { role: 'LEADER', email: 'leader@grottoworks.vn' },
  { role: 'OFFICER', email: 'officer@grottoworks.vn' },
]

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const fillDemo = (email: string) => {
    setValue('email', email)
    setValue('password', 'grotto')
    setServerError('')
  }

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      const user = await login(data.email, data.password)
      navigate(`/${user.role.toLowerCase()}`)
    } catch {
      // ponytail: mock chỉ có 2 dạng lỗi — 401 sai tài khoản; còn lại hiển thị
      // chung thông điệp tương tự, log để debug.
      const msg = t('login.invalid')
      setServerError(msg)
      toast(msg, 'alert')
    }
  }

    return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-grotto-ground p-4">
      {/* Nền ảnh mùa Giáng sinh (Unsplash) + lớp phủ tối để card nổi bật. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn2.fptshop.com.vn/unsafe/800x0/Hinh_nen_Power_Point_Giang_sinh_2_f5da9b6b32.jpg')",
        }}
      />
            <div
        aria-hidden
        className="absolute inset-0 z-0 bg-gradient-to-b from-grotto-ink/30 via-grotto-ink/50 to-grotto-ink/80"
      />

      {/* Tuyết rơi: lớp phủ trên nền, dưới card. */}
      <Snowfall count={70} />

      <Card className="g-item relative z-10 w-full max-w-sm overflow-hidden">
        {/* Vòm hang đá: dải terra với mái vòm panel cắt lên trên. */}
        <div className="relative h-28 bg-grotto-terra">
          <div className="absolute inset-x-0 bottom-0 mx-auto h-8 w-24 rounded-t-full bg-grotto-panel" />
          <div className="grid h-full place-items-center">
            <div className="grid size-12 place-items-center rounded-[14px_14px_4px_4px] bg-grotto-terraDark text-xl font-extrabold text-grotto-panel">
              G
            </div>
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-xl font-extrabold tracking-tight text-grotto-ink">
            {t('app.name')}
          </h1>
          <p className="mt-0.5 text-sm text-grotto-soft">{t('login.subtitle')}</p>

          <p className="lbl mt-5">{t('login.demoAccounts')}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {DEMO.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => fillDemo(d.email)}
                title={d.email}
                className="rounded-md border border-grotto-hair bg-grotto-ground px-3 py-2 text-left text-xs font-semibold text-grotto-soft transition-colors hover:border-grotto-terra hover:text-grotto-terra"
              >
                <span className="block truncate">{t(`role.${d.role}`)}</span>
                <span className="block truncate font-mono text-[10px]">
                  {d.email.split('@')[0]}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
            <div>
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-grotto-brick">
                  {t(errors.email.message ?? '')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs font-semibold text-grotto-brick">
                  {t(errors.password.message ?? '')}
                </p>
              )}
            </div>
            {serverError && (
              <p role="alert" className="text-xs font-semibold text-grotto-brick">
                {serverError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('login.loggingIn') : t('login.submit')}
            </Button>
          </form>
        </div>
      </Card>
    </main>
  )
}
