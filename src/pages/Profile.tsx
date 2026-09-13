import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'

// Route tồn tại từ Task 3; nội dung thật (hồ sơ, điểm, kỹ năng) thuộc Task 13.
export default function Profile() {
  const { t } = useTranslation()
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title={user?.name ?? t('shell.profile')}
        sub={user ? `${user.email} · ${t(`role.${user.role}`)}` : undefined}
      />
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name ?? ''} hue={user?.avatarHue} size="lg" />
          <p className="text-sm text-grotto-soft">{t('profile.placeholder')}</p>
        </div>
      </Card>
    </div>
  )
}
