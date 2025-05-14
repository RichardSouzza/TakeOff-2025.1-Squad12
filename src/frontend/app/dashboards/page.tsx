"use client";

import { Logos } from "@/components/logos";
import Image from "next/image";
import axios from "axios";
import { IoLogoInstagram } from "react-icons/io";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { SelectInput } from "@/components/selectInput";
import { BarChartExample } from "@/components/graficoBarra";
import { useEffect, useMemo, useState } from "react";
import { GraficoProg } from "@/components/graficoProg";

export default function Dashboards() {
  const [filiais, setFiliais] = useState<any[]>([]);
  const [filial, setFilial] = useState<any>("FILIAL RECIFE");
  const [selectedFilial, setSelectedFilial] = useState<any>(null);
  
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const diaAtual = String(dataAtual.getDate()).padStart(2, '0');;
  const [mes, setMes] = useState<string>("");
  
  // Dados dos gráficos 
  const [vendasAcumuladasMesDoAnoAtual, setVendasAcumuladasMesDoAnoAtual] = useState<number>(0);
  const [vendasAcumuladasMesDoAnoPassado, setVendasAcumuladasMesDoAnoPassado] = useState<number>(0);
  const [metaMes, setMetaMes] = useState<number>(0);
  const [vendasMesAnoPassado, setVendasMesAnoPassado] = useState<number>(0);
  const [vendasMesAnoAtual, setVendasMesAnoAtual] = useState<number>(0);
  const [vendasTotaisAnoAtual, setVendasTotaisAnoAtual] = useState<number>(0);
  const [metaVendas, setMetaVendas] = useState<number>(0);
  const [vendasUltimaDataComRegistro, setVendasUltimaDataComRegistro] = useState<number>(0);
  const [ultimaDataComRegistro, setUltimaDataComRegistro] = useState<string>("");
  const [previsaoMes, setPrevisaoMes] = useState<number>(0);
  const [crescimento, setCrescimento] = useState<any[]>([]);
  const [vendaAnual, setVendaAnual] = useState(0);

  const _axios = axios.create({
    baseURL: "http://localhost:8000",
    headers: {"Access-Control-Allow-Origin": "http://localhost:8000"},
    timeout: 10000,
  });

  useEffect(() => {
    const validateDataRequest = async () => {
      try {
        const response = await _axios.get("/filiais");
        setFiliais(response.data.data);
      } catch (error) {}
    };
  
    validateDataRequest();
  }, []);

  useEffect(() => {
    if (selectedFilial?.value != null) {
    _axios.get('/vendasUltimoDiaComRegistro', {
      params: {
        filial: selectedFilial?.value,
      }
    }).then(({ data }) => {
      const ultimaDataComRegistro = data.data[0].UltimaDataComRegistro;
      const vendasUltimoDiaComRegistro = data.data[0].TotalDeVendas;
      const previsao = projetarVendas(ultimaDataComRegistro, vendasUltimoDiaComRegistro);
      // const vendasTotaisAnoAtual = getVendasTotaisAnoAtual(ultimaDataComRegistro, selectedFilial?.value);

      getVendasTotaisAnoAtual(ultimaDataComRegistro, selectedFilial?.value);
      setUltimaDataComRegistro(ultimaDataComRegistro);
      setVendasUltimaDataComRegistro(vendasUltimoDiaComRegistro);
      // getVendasTotaisAnoAtual(vendasTotaisAnoAtual);
      setPrevisaoMes(previsao);
      setNewChartData1(ultimaDataComRegistro);
    });
    } 
  }, [selectedFilial]);

  const optionsFiliais = useMemo(() => {
    return Array.isArray(filiais)
      ? filiais.map((filial) => ({
          value: filial.Nome,
          label: filial.Nome,
        }))
      : [];
  }, [filiais]);

  useEffect(() => {
    if (optionsFiliais.length > 0) {
      setSelectedFilial(optionsFiliais[0]);
      setFilial(optionsFiliais[0].value);
    }
  }, [optionsFiliais]);

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
    {
      value: '05',
      label: 'Maio',
    },
  ];

  const projetarVendas = (dataUltimoDiaComRegistro: string, vendasAcumuladas: number) => {
    const data = new Date(dataUltimoDiaComRegistro);
    const diaDoMes = data.getDate();
    const ultimoDiaMes = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();

    const projecaoFinal = (vendasAcumuladas * ultimoDiaMes) / diaDoMes;

    return Math.round(projecaoFinal);
  }
  
  // Estado para armazenar os dados do gráfico
  const [chartData1, setChartData1] = useState([
    { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: 0 },
    { name: `Vendas acumuladas ${anoAtual - 1}`, valor: 0 },
    { name: 'Meta de Vendas acumuladas', valor: 0 },
    { name: 'Vendas acumuladas atual', valor: 0 },
    { name: 'Meta total do mês', valor: 0 },
    { name: 'Previsão Mensal', valor: 0 },
  ]);
  
  const [chartData2, setChartData2] = useState([
    { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: 0 },
    { name: `Vendas totais do mês em ${anoAtual}`, valor: 0 },
    { name: 'Meta total do mês', valor: 0 },
  ]);

  // Função para mudar os dados do gráfico conforme a filial
  const handleFilialChange = (option: any) => {
    const filial = option.value;
    setFilial(filial);
    setNewChartData1(ultimaDataComRegistro); 
    setChartDataCrescimento(filial);
  };

  const handleMonthChange = (option: any) => {
    const mes = option.value;
    setMes(mes);
    setNewChartData2(mes, filial);
  };

  const getVendasAcumuladasMesDoAnoAtual = async (date: string, filial: string) => {
    await _axios.get('/vendasAcumuladasMes', {
        params: {
          data: date,
          filial: filial,
        }
    }).then(({ data }) => {
        setVendasAcumuladasMesDoAnoAtual(data.data[0].VendasAcumuladasNoMes);
    });
  };
  
  const getVendasAcumuladasMesDoAnoPassado = async (date: string, filial: string) => {
    await _axios.get('/vendasAcumuladasMes', {
        params: {
          data: date.replace(/^\d+/, (y: string) => String(Number(y) - 1)),
          filial: filial,
        }
    }).then(({ data }) => {
        const vendasAcumuladas = data.data[0].VendasAcumuladasNoMes;
        setVendasAcumuladasMesDoAnoPassado(vendasAcumuladas);
        setMetaMes(vendasAcumuladas + vendasAcumuladas * 0.05);
    });
  };
  
  const getVendasMesAnoPassado = async (date: string, filial: string) => {
    await _axios.get('/vendasMesFilial', {
        params: {
          data: date.replace(/^\d+/, (y: string) => String(Number(y) - 1)),
          filial: filial,
        }
    }).then(({ data }) => {
        const vendasMes = data.data[0].VendasTotaisMes;
        setVendasMesAnoPassado(vendasMes);
        setMetaVendas(vendasMes + vendasMes * 0.05);
    });
  };
  
  const getVendasMesAnoAtual = async (date: string, filial: string) => {
    await _axios.get('/vendasMesFilial', {
        params: {
          data: date.replace(/^\d+/, (y: string) => String(Number(y))),
          filial: filial,
        }
    }).then(({ data }) => {
        const vendasMes = data.data[0].VendasTotaisMes;
        setVendasMesAnoAtual(vendasMes);
    });
  };

  const getVendasTotaisAnoAtual = async (date: string, filial: string) => {
    await _axios.get('/vendasAcumuladasAno', {
        params: {
          data: date.replace(/^\d+/, (y: string) => String(Number(y))),
          filial: filial,
        }
    }).then(({ data }) => {
        const vendasTotais = data.data[0].VendasTotaisAno;
        setVendasTotaisAnoAtual(vendasTotais);
    });
  };


  const setNewChartData1 = async (date: string) => {
    const filial = selectedFilial?.value;
    
    console.log(date);
    if (filial != null) {
      getVendasMesAnoPassado(date, filial);
      getVendasAcumuladasMesDoAnoPassado(date, filial);
      getVendasAcumuladasMesDoAnoAtual(date, filial);
      getVendasMesAnoAtual(date, filial);
    }

    setChartData1([
      { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: vendasMesAnoPassado },
      { name: `Vendas acumuladas ${anoAtual - 1}`, valor: vendasAcumuladasMesDoAnoPassado },
      { name: 'Meta de Vendas acumuladas', valor: metaMes },
      { name: 'Vendas acumuladas atual', valor: vendasAcumuladasMesDoAnoAtual },
      { name: 'Meta total do mês', valor: metaVendas },
      { name: 'Previsão Mensal', valor: previsaoMes },
    ]);
  };

  const setNewChartData2 = async (filial: string, data: string) => {
    setChartData2([
      { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: vendasMesAnoPassado },
      { name: `Vendas totais do mês em ${anoAtual}`, valor: vendasMesAnoAtual },
      { name: 'Meta total do mês', valor: metaVendas },
    ]);
  };

  const setChartDataCrescimento = async (filial: string) => {
    _axios.get('/crescimentoMensalPorFilialData', {
      params: {
        filial: filial
      }
    }).then(({ data }) => {
      let dadosCrescimento = [];

      for (let row of data.data) {
        dadosCrescimento.push({ month: row.MesAno, crescimento: row.TaxaCrescimento });
      }
      setCrescimento(dadosCrescimento);
    });
  };

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
              setSelectedFilial(option);
              setFilial(option?.value);
              setChartDataCrescimento(filial);
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
              <GraficoProg chartData={crescimento} />
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
