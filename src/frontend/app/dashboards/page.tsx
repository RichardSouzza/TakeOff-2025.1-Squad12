"use client";

import { Logos } from "@/components/logos";
import Image from "next/image";
import axios from "axios";
import { IoLogoInstagram } from "react-icons/io";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { SelectInput } from "@/components/selectInput";
import { BarChartExample } from "@/components/graficoBarra";
import { useEffect, useState } from "react";
import { GraficoProg } from "@/components/graficoProg";

export default function Dashboards() {
  const [filiais, setFiliais] = useState<any[]>([]);
  const [filialG1, setFilialG1] = useState<any>("FILIAL RECIFE");
  const [filialG2, setFilialG2] = useState<any>("FILIAL RECIFE");
  
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const diaAtual = String(dataAtual.getDate()).padStart(2, '0');;
  const [mes, setMes] = useState<string>("");
  
  // Dados dos gráficos 
  const [vendasAcumuladasMesDoAnoAtual, setVendasAcumuladasMesDoAnoAtual] = useState<number>(0);
  const [vendasAcumuladasMesDoAnoPassado, setVendasAcumuladasMesDoAnoPassado] = useState<number>(0);
  const [metaMes, setMetaMes] = useState<number>(0);
  const [vendasMesAnoPassado, setVendasMesAnoPassado] = useState<number>(0);
  const [metaVendas, setMetaVendas] = useState<number>(0);
  const [vendasDataSelecionada, setVendasDataSelecionada] = useState<number>(0);
  const [crescimento, setCrescimento] = useState<any[]>([]);
  const [vendaAnual, setVendaAnual] = useState(0);
  const [filialGeral, setFilialGeral] = useState(0);



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
      } catch (error) {
      }
    };
  
    validateDataRequest();

  }, []);

  const optionsFiliaisTeste = Array.isArray(filiais)
  ? filiais.map((filial) => ({
      value: filial.Nome,
      label: filial.Nome,
    }))
  : [];

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
  
  // Estado para armazenar os dados do gráfico
  const [chartData, setChartData] = useState([
    { name: `Vendas acumuladas ${anoAtual - 1}`, valor: 0 },
    { name: 'Vendas acumuladas atual', valor: 0 },
    { name: 'Meta de Vendas acumuladas', valor: 0 },
    { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: 0 },
    { name: 'Meta total do mês', valor: 0 },
  ]);

  const setChartData1 = async (mes: string, filial: string) => {
    const date = `2025-${mes}-${diaAtual}`;

    await _axios.get('/vendasAcumuladasMes', {
        params: {
          data: date,
          filial: filial,
        }
      }).then(({ data }) => {
        setVendasAcumuladasMesDoAnoAtual(data.data[0].VendasAcumuladasNoMes);
      });
    
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

    await _axios.get('/vendasMesFilial', {
        params: {
          data: date.replace(/^\d+/, (y: string) => String(Number(y) - 1)),
          filial: filial,
        }
      }).then(({ data }) => {
        const vendasMes = data.data[0].VendasTotaisMes;
        setVendasMesAnoPassado(vendasMes);
      });

    setChartData([
      { name: `Vendas acumuladas ${anoAtual - 1}`, valor: vendasAcumuladasMesDoAnoPassado },
      { name: 'Vendas acumuladas atual', valor: vendasAcumuladasMesDoAnoAtual },
      { name: 'Meta de Vendas acumuladas', valor: metaMes },
      { name: `Vendas totais do mês em ${anoAtual - 1}`, valor: vendasMesAnoPassado },
      { name: 'Meta total do mês', valor: 0 },
    ]);
  }

  // Função para mudar os dados do gráfico conforme a filial
  const handleFilial1Change = (option: any) => {
    const filial = option.value;
    setFilialG1(filial);
    setChartData1(mes, filial); 
  };

  const handleMonthChange = (option: any) => {
    const mes = option.value;
    setMes(mes);
    setChartData1(mes, filialG1);
  };

  const getDadosCrescimento = async (filial: string) => {
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

  const getDadosAnuais = async (filial: string, ano: Number) => {
    _axios.get('/vendasTotaisAnoFilial', {
        params: {
          filial: filial,
          ano: ano
        }
      }).then(({ data }) => {

        setVendaAnual(data.data[0].VendasTotaisAno);
        console.log(vendaAnual, "teste");
        
      });
  };

  const handleFilial3Change = (option: any) => {
    setFilialGeral(option.value);
    getDadosAnuais(option.value, 2025);
  };
  
  const handleFilial2Change = (option: any) => {
    setFilialG2(option.value);
    getDadosCrescimento(option.value);
  };

  function formatarParaBRL(valor:any) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
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
                options={optionsFiliaisTeste}
                label="Selecione uma filial"
                onChange={handleFilial3Change}
                />
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-2 border p-4 w-1/2">
              <p className="text-[20px]">Vendas totais do último dia com registro</p>
              <p className="text-[20px]">(10/05/2025)</p>
              <p className="text-[#4D0303] text-[32px]">{formatarParaBRL(vendaAnual)}</p>
            </div>
            <div className="flex flex-col gap-2 border p-4 w-1/2">
              <p className="text-[20px]">Venda totais do ano atual</p>
              <p className="text-[20px]">(2025)</p>
              <p className="text-[#4D0303] text-[32px]">{formatarParaBRL(vendaAnual)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-[28px] border p-4">
            <div className="flex gap-[32px] justify-between">
              <div>
                <p className="text-[20px]">Análise mensal</p>
              </div>
              <div className="w-[240px]">
                <SelectInput
                  id="nomeFilial-grafico1"
                  isSearchable={false}
                  options={optionsFiliaisTeste}
                  label="Filiais"
                  onChange={handleFilial1Change}
                />
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
                  options={optionsFiliaisTeste}
                  label="Selecione a Filial"
                  onChange={handleFilial2Change}
                />
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
