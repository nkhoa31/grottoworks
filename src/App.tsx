import type { CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const d = (n: number) => ({ '--d': n }) as CSSProperties

export default function App() {
  return (
    <main className="stagger mx-auto min-h-screen max-w-2xl p-10">
      <h1 className="text-4xl font-extrabold tracking-tight" style={d(0)}>
        GrottoWorks
      </h1>
      <p className="lbl-mono mt-2" style={d(1)}>
        Xưởng thủ công · Hang Đá &amp; Rơm
      </p>
      <div className="mt-6 flex gap-3" style={d(2)}>
        <Button>Vào xưởng</Button>
        <Button variant="outline">Xem demo</Button>
      </div>
      <Card className="mt-6 max-w-sm" style={d(3)}>
        <CardHeader>
          <CardTitle>Chu kỳ men Terra</CardTitle>
          <CardDescription>Lô #042 · đang nung</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="tabular text-3xl font-bold">1.280.000 ₫</p>
        </CardContent>
      </Card>
    </main>
  )
}
