"use client";

import { Logos } from "@/components/logos";
import Image from "next/image";
import { IoLogoInstagram } from "react-icons/io";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { useHome } from "@/hooks/Home/useHome";
import { SelectInput } from "@/components/selectInput";
import { BarChartExample } from "@/components/graficoBarra";
import { useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import { GraficoProg } from "@/components/graficoProg";

export default function Dashboards() {
  const { errors, handleLogin, handleSubmit, isLoading, register } = useHome();

  const optionsFiliais = [
    { value: 'filial01', label: 'Filial 01' },
    { value: 'filial02', label: 'Filial 02' },
    { value: 'filial03', label: 'Filial 03' },
  ];

  const optionsMes = [
    { value: 'janeiro', label: 'Janeiro' },
    { value: 'fevereiro', label: 'Fevereiro' },
    { value: 'março', label: 'Março' },
    { value: 'abril', label: 'Abril' },
    { value: 'maio', label: 'Maio' },
    { value: 'junho', label: 'Junho' },
    { value: 'julho', label: 'Julho' },
    { value: 'agosto', label: 'Agosto' },
    { value: 'setembro', label: 'Setembro' },
    { value: 'outubro', label: 'Outubro' },
    { value: 'novembro', label: 'Novembro' },
    { value: 'dezembro', label: 'Dezembro' },
  ];

  // Estado para armazenar a filial selecionada
  const [selectedFilial, setSelectedFilial] = useState('filial01');


  // Estado para armazenar os dados do gráfico
  const [chartData, setChartData] = useState([
    { name: 'Vendas acumuladas 2024', valor: 1000 },
    { name: 'Vendas acumuladas atual', valor: 800 },
    { name: 'Meta de Vendas acumuladas', valor: 1200 },
    { name: 'Vendas 2024', valor: 500 },
    { name: 'Meta total do mês', valor: 300 },
    { name: 'Vendas do dia', valor: 50 },
  ]);

  // Função para mudar os dados do gráfico conforme a filial
  const handleFilialChange = (option: any) => {
    setSelectedFilial(option.value);

    switch (option.value) {
      case 'filial01':
        setChartData([
          { name: 'Vendas acumuladas 2024', valor: 1000 },
          { name: 'Vendas acumuladas atual', valor: 800 },
          { name: 'Meta de Vendas acumuladas', valor: 1200 },
          { name: 'Vendas 2024', valor: 500 },
          { name: 'Meta total do mês', valor: 300 },
          { name: 'Vendas do dia', valor: 50 },
        ]);
        break;
      case 'filial02':
        setChartData([
          { name: 'Vendas acumuladas 2024', valor: 1500 },
          { name: 'Vendas acumuladas atual', valor: 1100 },
          { name: 'Meta de Vendas acumuladas', valor: 1600 },
          { name: 'Vendas 2024', valor: 750 },
          { name: 'Meta total do mês', valor: 500 },
          { name: 'Vendas do dia', valor: 80 },
        ]);
        break;
      case 'filial03':
        setChartData([
          { name: 'Vendas acumuladas 2024', valor: 800 },
          { name: 'Vendas acumuladas atual', valor: 600 },
          { name: 'Meta de Vendas acumuladas', valor: 1000 },
          { name: 'Vendas 2024', valor: 300 },
          { name: 'Meta total do mês', valor: 400 },
          { name: 'Vendas do dia', valor: 40 },
        ]);
        break;
      default:
        setChartData([
          { name: 'Vendas acumuladas 2024', valor: 0 },
          { name: 'Vendas acumuladas atual', valor: 0 },
          { name: 'Meta de Vendas acumuladas', valor: 0 },
          { name: 'Vendas 2024', valor: 0 },
          { name: 'Meta total do mês', valor: 0 },
          { name: 'Vendas do dia', valor: 0 },
        ]);
        break;
    }
  };

  return (
    <div className="flex flex-col w-full h-full h-min-screen bg-[#F0F0F0]">
      <header className="bg-[#202124] py-[16px] px-[96px]">
        <Image
          src={Logos.logo_atos_branca}
          width={160}
          height={44}
          alt="Logo da ATOS"
        />
      </header>

      <main className="flex flex-col gap-[32px] justify-start w-full my-[32px] px-[96px] flex-1">
        <div className="flex flex-col w-full gap-[32px]">
          <div className="w-full flex justify-start text-[32px] font-medium">
            <p>EMPRESA LOREM IMPSUM LTDA</p>
          </div>
          <div className="bg-white p-4 rounded-[4px] border border-[#600000]">
            <p className="text-[#600000] font-medium text-[32px]">Relatório</p>
            <p className="text-[#333333] font-medium">
              Confira aqui os detalhes dos relatórios de vendas das filiais.
            </p>
          </div>
        </div>

        <div className="bg-white flex flex-col p-4 gap-4">
          <div>
            <p>TODAS AS FILIAIS</p>
          </div>
          <div className="flex flex-col gap-[28px] border p-4">
            <div className="flex gap-[32px] justify-between">
              <div>
                <p className="text-[20px]">Análise mensal</p>
              </div>
              <div className="w-[240px]">

                <SelectInput
                  isSearchable={false}
                  options={optionsFiliais}
                  label="Filiais"
                  onChange={handleFilialChange}
                />
              </div>
              <div className="w-[240px]">

                <SelectInput
                  isSearchable={false}
                  options={optionsMes}
                  label="Selecione a Data"
                />
              </div>
            </div>

            <div>
              <BarChartExample data={chartData} />
            </div>
          </div>
          <div className="flex flex-col gap-[28px] border p-4">
            <div className="flex gap-[32px] justify-between">
              <div>
                <p className="text-[20px]">Crescimento em relação ao mesmo mês do ano anterior</p>
              </div>
              <div className="w-[240px]">

                <SelectInput
                  isSearchable={false}
                  options={optionsFiliais}
                  label="Selecione a Filial"
                />
              </div>
            </div>

            <div>
              <GraficoProg/>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full flex justify-between bg-[#4D0303] py-[24px] px-[96px]">
        <div className="flex gap-5">
          <a href="">
            <IoLogoInstagram className="text-white h-[30px] w-[30px]" />
          </a>
          <a href="">
            <FaFacebookSquare className="text-white h-[30px] w-[30px]" />
          </a>
          <a href="">
            <FaLinkedin className="text-white h-[30px] w-[30px]" />
          </a>
        </div>
      </footer>
    </div>
  );
}
