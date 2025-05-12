import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from 'recharts';

interface BarChartExampleProps {
  data: any[];
}

export function BarChartExample({ data }: BarChartExampleProps) {

  function formatarParaBRL(valor:any) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
  
  return (
    <ResponsiveContainer  width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#600000" fontSize={12} />
        <YAxis stroke="#600000" fontSize={12} />
        <Tooltip
          formatter={(value: any) => formatarParaBRL(value)} // Formata o valor no tooltip
        />
        <Bar dataKey="valor" fill="#600000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}