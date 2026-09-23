import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  const { t } = useTranslation()
  const label = t('common.search')
    return (
    <div className={cn('relative w-full min-w-[220px] max-w-md', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grotto-soft" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        aria-label={label}
        className="pl-9"
      />
    </div>
  )
}
