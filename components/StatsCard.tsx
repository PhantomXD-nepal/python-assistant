import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: ReactNode
  icon: ReactNode
}

const StatsCard = ({ title, value, icon }: StatsCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
            <div className="text-white">{icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
            <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard
