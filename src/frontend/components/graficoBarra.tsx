import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from 'recharts';

interface BarChartExampleProps {
  data: any[];
}

export function BarChartExample({ data }: BarChartExampleProps) {
  return (
    <ResponsiveContainer  width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#600000" fontSize={12} />
        <YAxis stroke="#600000" fontSize={12} />
        <Tooltip />
        <Bar dataKey="valor" fill="#600000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}