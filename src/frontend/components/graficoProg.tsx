"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DataPoint {
  Data: string; // ISO date string (ex: "2025-01-01")
  Valor: number;
}

interface GraficoProgProps {
  linha1: DataPoint[];
  linha2: DataPoint[];
}

const chartConfig = {
  linha1: {
    label: "Crescimento em relação ao mesmo mês no ano passado",
    color: "#C30505", // vermelho
  },
  linha2: {
    label: "Crescimento em relação à meta estabelecida",
    color: "#0572C3", // azul
  },
} satisfies ChartConfig

// Função para mesclar as duas séries em uma estrutura comum para o gráfico
function mergeData(l1: DataPoint[], l2: DataPoint[]) {
  // Cria um map com as datas e valores
  const map = new Map<string, { linha1?: number; linha2?: number }>()

  for (const item of l1) {
    map.set(item.Data, { ...(map.get(item.Data) ?? {}), linha1: item.Valor })
  }

  for (const item of l2) {
    map.set(item.Data, { ...(map.get(item.Data) ?? {}), linha2: item.Valor })
  }

  // Ordena por data
  const sortedKeys = Array.from(map.keys()).sort()

  // Retorna array formatado para o gráfico
  return sortedKeys.map((data) => ({
    Data: data,
    linha1: map.get(data)?.linha1 ?? null,
    linha2: map.get(data)?.linha2 ?? null,
  }))
}

export function GraficoProg({ linha1, linha2 }: GraficoProgProps) {
  const dataMerged = mergeData(linha1, linha2)

  return (
    <Card className="flex justify-center">
      <CardHeader>
        {/* Você pode ativar títulos aqui */}
        {/* <CardTitle>Gráfico com Duas Linhas</CardTitle> */}
        {/* <CardDescription>Comparação mensal das duas séries</CardDescription> */}
      </CardHeader>
      <CardContent className="h-[420px] flex justify-center">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={dataMerged}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="Data"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value: string) => {
                // Formata ISO para mês abreviado (ex: "2025-01-01" -> "Jan")
                const date = new Date(value)
                return date.toLocaleString("pt-BR", { month: "short" })
              }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingBottom: 20 }}
              formatter={(value: string) =>
                chartConfig[value as keyof typeof chartConfig].label
              }
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  className="font-semibold"
                  hideLabel
                  formatter={(value: any, name: any) =>
                    `${chartConfig[name as keyof typeof chartConfig].label}: ${parseFloat(value).toFixed(2).replace('.', ',')}%`
                  }
                />
              }
            />
            <Line
              dataKey="linha1"
              type="linear"
              stroke={chartConfig.linha1.color}
              strokeWidth={2}
              dot={true}
              name="linha1"
            />
            <Line
              dataKey="linha2"
              type="linear"
              stroke={chartConfig.linha2.color}
              strokeWidth={2}
              dot={true}
              name="linha2"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <p>Aqui você poderá verificar a taxa de crescimento de determinada filial</p>
      </CardFooter>
    </Card>
  )
}
