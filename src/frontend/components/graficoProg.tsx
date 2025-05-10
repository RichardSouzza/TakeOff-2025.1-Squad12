"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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


interface ChartData {
  month: string;
  crescimento: string;
}

interface GraficoProgProps {
  chartData: Array<ChartData>;
}

const chartDataEx = [
  { month: "Janeiro", crescimento: 1.4 },
  { month: "Fevereiro", crescimento: 7.89 },
  { month: "Março", crescimento: 3.22 },
  { month: "Abril", crescimento: 8.76 },
  { month: "Maio", crescimento: 15.55 },
  { month: "Junho", crescimento: -2.33 },
  { month: "Julho", crescimento: -22.33 },
  { month: "Agosto", crescimento: 0.33 },
  { month: "Setembro", crescimento: 44.33 },
  { month: "Outubro", crescimento: 1.33 },
  { month: "Novembro", crescimento: 23.33 },
  { month: "Dezembro", crescimento: 12.33 },


]

const chartConfig = {
  crescimento: {
    label: "Crescimento",
    color: "#C30505",
  },
} satisfies ChartConfig

export function GraficoProg({ chartData }: GraficoProgProps) {
  console.log(chartData);
  return (
    <Card className="flex justify-center">
      <CardHeader>
        {/* <CardTitle>Line Chart - Linear</CardTitle>
        <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="h-[420px] flex justify-center">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="crescimento"
              type="linear"
              stroke="#C30505"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
            <p>Teste teste teste teste teste</p>
      </CardFooter>
    </Card>
  )
}
