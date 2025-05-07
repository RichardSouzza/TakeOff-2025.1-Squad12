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
  
  const [dateG1, setDateG1] = useState<any[]>([]);
  
  // Dados dos gráficos 
  const [vendasAcumuladasMes, setVendasAcumuladasMes] = useState<any[]>([]);
  const [] = useState<any[]>([]);
  const [] = useState<any[]>([]);
  const [] = useState<any[]>([]);
  const [] = useState<any[]>([]);
  const [] = useState<any[]>([]);
  const [crescimento, setCrescimento] = useState<any[]>([]);


  const _axios = axios.create({
    baseURL: "http://localhost:8000",
    headers: {"Access-Control-Allow-Origin": "http://localhost:8000"},
    timeout: 10000,
  });


  useEffect(() => {
    const validateDataRequest = async () => {
      try {
        const response = await _axios.get("/filiais");
        console.log("Resposta da API:", response.data);
        setFiliais(response.data.data);
      } catch (error) {
        console.log("Erro ao buscar filiais:", error);
      }
    };
  
    validateDataRequest();

    const getVendasAcumuladas = async () => {
      const response = await _axios
        .get("/vendasAcumuladasMes", {
          params: {
            data: dateG1
          }
        });
      
      setVendasAcumuladasMes(response.data.data)
    }
  }, []);

  const optionsFiliaisTeste = Array.isArray(filiais)
  ? filiais.map((filial) => ({
      value: filial.Nome,
      label: filial.Nome,
    }))
  : [];
  
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
    setFilialG1(option.value);

    switch (option.value) {
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
  
  const handleFilial2Change = (option: any) => {
    setFilialG2(option.value);

    getDadosCrescimento(option.value);

    switch (option.value) {
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
                  id="nomeFilial-grafico1"
                  isSearchable={false}
                  options={optionsFiliaisTeste}
                  label="Filiais"
                  onChange={handleFilialChange}
                />
              </div>
              <div className="w-[240px]">
                <input id="date" type="date" onChange={(e) => setDateG1(e)} />
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
