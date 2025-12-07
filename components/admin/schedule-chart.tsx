"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Interface para os dados do gráfico
interface ScheduleChartProps {
  data: {
    day: string;
    count: number;
  }[]
}

export function ScheduleChart({ data }: ScheduleChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Agendamentos por Dia da Semana</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="day" 
                type="category" 
                tickLine={false} 
                axisLine={false} 
                fontSize={12}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              {/* Cor primária do tema (Indigo/Roxo conforme imagem) */}
              <Bar dataKey="count" fill="currentColor" radius={[0, 4, 4, 0]} className="fill-primary" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}