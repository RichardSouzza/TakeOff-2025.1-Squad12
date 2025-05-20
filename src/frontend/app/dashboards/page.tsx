"use client";

import { Logos } from "@/components/logos";
import Image from "next/image";
import { IoLogoInstagram } from "react-icons/io";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import * as api from "@/api/dashboard";
import { SelectInput } from "@/components/selectInput";
import { BarChartExample } from "@/components/graficoBarra";
import { useEffect, useMemo, useState } from "react";
import { GraficoProg } from "@/components/graficoProg";


const optionsMeses = [
  {
    value: '01',
    label: 'Janeiro',
  },
  {
    value: '02',
    label: 'Fevereiro',
  },
  {
    value: '03',
    label: 'Março',
  },
  {
    value: '04',
    label: 'Abril',
  },
];

export default function Dashboards() {
  const [filial, setFilial] = useState<any>("");
  const [filiais, setFiliais] = useState<any[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<any>(null);
  const [selectedMes, setSelectedMes] = useState<any>(optionsMeses.findLast(mes => mes));

  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const [mes, setMes] = useState<string>("");
  
  // Dados dos gráficos 
  const [ultimaDataComRegistro, setUltimaDataComRegistro] = useState<string>("");
  const [vendasUltimaDataComRegistro, setVendasUltimaDataComRegistro] = useState<number>(0);
  const [vendasTotaisAnoAtual, setVendasTotaisAnoAtual] = useState<number>(0);

  const [vendasMesAnoPassado, setVendasMesAnoPassado] = useState<number>(0);
  const [vendasAcumuladasMesDoAnoPassado, setVendasAcumuladasMesDoAnoPassado] = useState<number>(0);
  const [vendasAcumuladasMesDoAnoAtual, setVendasAcumuladasMesDoAnoAtual] = useState<number>(0);
  const [metaMesAcumulado, setMetaMes] = useState<number>(0);
  const [vendasMesAnoAtual, setVendasMesAnoAtual] = useState<number>(0);
  const [metaVendas, setMetaVendas] = useState<number>(0);
  const [previsaoMes, setPrevisaoMes] = useState<number>(0);
  
  const [crescimentoMensalTotal, setCrescimentoMensalTotal] = useState<any[]>([]);
  const [crescimentoMensalMeta, setCrescimentoMensalMeta] = useState<any[]>([]);
  const [vendaAnual, setVendaAnual] = useState(0);

  const [chartData1, setChartData1] = useState([
    { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: 0 },
    { name: `Vendas acumuladas do mês em ${anoAtual - 1}`, valor: 0 },
    { name: 'Meta de vendas acumuladas', valor: 0 },
    { name: 'Vendas acumuladas atual', valor: 0 },
    { name: 'Meta total do mês', valor: 0 },
    { name: 'Previsão mensal', valor: 0 },
  ]);
  
  const [chartData2, setChartData2] = useState([
    { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: 0 },
    { name: 'Meta total do mês', valor: 0 },
    { name: `Vendas totais do mês em ${anoAtual}`, valor: 0 },
  ]);

  const optionsFiliais = useMemo(() => {
    return Array.isArray(filiais)
      ? filiais.map((filial) => ({
          value: filial.Nome,
          label: filial.Nome,
        }))
      : [];
  }, [filiais]);


  
  // Carregar filiais ao acessar a página
  useEffect(() => {
    const getFiliais = async () => {
      const filiais = await api.getFiliais();
      const filial = filiais.findLast((f: any) => f).Nome;
      setFiliais(filiais);

      // Carregar segundo gŕafico
      setNewChartData2(`${anoAtual}-${selectedMes.value}-01`, filial);
    };
    getFiliais();
  }, []);

  const getVendasUltimo = async (filial: string) => {
    const vendasUltimo = await api.getVendasUltimoDiaComRegistro(filial);
    const ultimaDataComRegistro = vendasUltimo.UltimaDataComRegistro;
    const vendasUltimoDiaComRegistro = vendasUltimo.TotalDeVendas;
    const vendasTotaisAnoAtual = await api.getVendasTotaisAnoAtual(ultimaDataComRegistro, filial);

    setUltimaDataComRegistro(ultimaDataComRegistro);
    setVendasUltimaDataComRegistro(vendasUltimoDiaComRegistro);
    setVendasTotaisAnoAtual(vendasTotaisAnoAtual);
    setNewChartData1(ultimaDataComRegistro, filial);
    setChartDataCrescimento(ultimaDataComRegistro, filial);
  };

  useEffect(() => {
    if (optionsFiliais.length > 0) {
      const filial = optionsFiliais[0];
      setSelectedFilial(filial);
      setFilial(filial.value);
      
      // Carregar cards ao acessar a página
      getVendasUltimo(filial.value);
    }
  }, [optionsFiliais]);



  // Handlers
  const handleFilialChange = (option: any) => {
    const filial = option.value;
    setFilial(filial);
    setSelectedFilial(option);

    getVendasUltimo(filial);
    setChartDataCrescimento(ultimaDataComRegistro, filial);
  };

  const handleMonthChange = (option: any) => {
    const mes = option.value;
    setMes(mes);
    setSelectedMes(option);
    setNewChartData2(`${anoAtual}-${mes}-01`, filial);
  };



  // Atualizar primeiro gráfico
  const setNewChartData1 = async (date: string, filial: string) => {
    if (filial != null) {
      const vendasMesAnoPassado = await api.getVendasMesAnoPassado(date, filial);
      const vendasAcumuladasMesDoAnoPassado = await api.getVendasAcumuladasMesDoAnoPassado(date, filial);
      const metaMesAcumulado = vendasAcumuladasMesDoAnoPassado + vendasAcumuladasMesDoAnoPassado * 0.05;
      const vendasAcumuladasMesDoAnoAtual = await api.getVendasAcumuladasMesDoAnoAtual(date, filial);
      const metaVendas = vendasMesAnoPassado + vendasAcumuladasMesDoAnoAtual * 0.05;
      const previsaoMes = projetarVendas(date, vendasAcumuladasMesDoAnoAtual);

      setVendasMesAnoPassado(vendasMesAnoPassado);
      setVendasAcumuladasMesDoAnoPassado(vendasAcumuladasMesDoAnoPassado);
      setMetaMes(metaMesAcumulado);
      setVendasAcumuladasMesDoAnoAtual(vendasAcumuladasMesDoAnoAtual);
      setMetaVendas(metaVendas);

      setChartData1([
        { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: vendasMesAnoPassado },
        { name: `Vendas acumuladas do mês em ${anoAtual - 1}`, valor: vendasAcumuladasMesDoAnoPassado },
        { name: 'Meta de vendas acumuladas', valor: metaMesAcumulado },
        { name: 'Vendas acumuladas atual', valor: vendasAcumuladasMesDoAnoAtual },
        { name: 'Meta total do mês', valor: metaVendas },
        { name: 'Previsão mensal', valor: previsaoMes },
      ]);
    }
  };



  // Atualizar segundo gráfico
  const setNewChartData2 = async (date: string, filial: string) => {
    const vendasMesAnoPassado = await api.getVendasMesAnoPassado(date, filial);
    const vendasMesAnoAtual = await api.getVendasMesAnoAtual(date, filial);
    const metaVendas = vendasMesAnoPassado + vendasMesAnoPassado * 0.05;

    setVendasMesAnoPassado(vendasMesAnoPassado);
    setVendasMesAnoAtual(vendasMesAnoAtual)
    setMetaVendas(metaVendas);

    setChartData2([
      { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: vendasMesAnoPassado },
      { name: 'Meta total do mês', valor: metaVendas },
      { name: `Vendas totais do mês em ${anoAtual}`, valor: vendasMesAnoAtual },
    ]);
  };

  

  // Atualizar terceiro gráfico
  const setChartDataCrescimento = async (date: string, filial: string) => {
    const dadosCrescimentoMensalTotal = await api.getCrescimentoMensalTotalPorFilialData(date, filial);
    const dadosCrescimentoMensalMeta = await api.getCrescimentoMensalMetaPorFilialData(date, filial);

    setCrescimentoMensalTotal(dadosCrescimentoMensalTotal);
    setCrescimentoMensalMeta(dadosCrescimentoMensalMeta);
  };
  
  

  // Métodos auxiliares
  const projetarVendas = (dataUltimoDiaComRegistro: string, vendasAcumuladas: number) => {
    const data = new Date(dataUltimoDiaComRegistro);
    const diaDoMes = data.getDate();
    const ultimoDiaMes = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();

    const projecaoFinal = (vendasAcumuladas * ultimoDiaMes) / diaDoMes;

    return Math.round(projecaoFinal);
  }

  function formatarParaBRL(valor: number) {
    return (valor != undefined)
      ? valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
      : 'R$ 0,00';
  }


  
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
              Confira aqui os detalhes dos relatórios de vendas das filiais de sua empresa.
            </p>
          </div>
        </div>

        <div className="bg-white flex flex-col p-4 gap-4">
          <SelectInput
            id="nomeFilial-grafico3"
            isSearchable={false}
            options={optionsFiliais}
            value={selectedFilial}
            label="Selecione uma filial"
            onChange={(option: any) => {
              handleFilialChange(option);
            }}
          />
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-2 border p-4 w-1/2">
              <p className="text-[20px]">Vendas totais do último dia com registro</p>
              <p className="text-[20px]">({ultimaDataComRegistro})</p>
              <p className="text-[#4D0303] text-[32px]">{formatarParaBRL(vendasUltimaDataComRegistro)}</p>
            </div>
            <div className="flex flex-col gap-2 border p-4 w-1/2">
              <p className="text-[20px]">Venda totais do ano atual</p>
              <p className="text-[20px]">(2025)</p>
              <p className="text-[#4D0303] text-[32px]">{formatarParaBRL(vendasTotaisAnoAtual)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-[28px] border p-4">
            <div className="flex gap-[32px] justify-between">
              <div>
                <p className="text-[20px]">Análise atual</p>
              </div>
            </div>

            <div>
              <BarChartExample data={chartData1} />
            </div>
          </div>

          <div className="flex flex-col gap-[28px] border p-4">
            <div className="flex gap-[32px] justify-between">
              <div>
                <p className="text-[20px]">Histórico mensal</p>
              </div>
              <div className="w-[240px]">
                <SelectInput
                  id="date"
                  isSearchable={false}
                  options={optionsMeses}
                  value={selectedMes}
                  label="Mês"
                  onChange={handleMonthChange}
                />
              </div>
            </div>

            <div>
              <BarChartExample data={chartData2} />
            </div>
          </div>
          <div className="flex flex-col gap-[28px] border p-4">
            <div className="flex gap-[32px] justify-between">
              <div>
                <p className="text-[20px]">Crescimento em relação ao mesmo mês do ano anterior</p>
              </div>
            </div>

            <div>
              <GraficoProg linha1={crescimentoMensalTotal} linha2={crescimentoMensalMeta} />
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
