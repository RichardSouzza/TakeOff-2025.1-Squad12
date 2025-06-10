import axios from "axios";


const _axios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/vendas`,
  timeout: 60000, // 60 seconds
});


export const getFiliais = async () => {
  return await _axios.get('/filiais').then(response => response.data.data);
};

export const getVendasAcumuladasMesDoAnoAtual = async (date: string, filial: string) => {
  return await _axios.get('/vendasAcumuladasMes', {
      params: {
        data: date,
        filial: filial,
      }
  }).then(response => response.data.data[0].VendasAcumuladasNoMes);
};

export const getVendasAcumuladasMesDoAnoPassado = async (date: string, filial: string) => {
  return await _axios.get('/vendasAcumuladasMes', {
      params: {
        data: date.replace(/^\d+/, (y: string) => String(Number(y) - 1)),
        filial: filial,
      }
  }).then(response => response.data.data[0].VendasAcumuladasNoMes);
};

export const getVendasMesAnoPassado = async (date: string, filial: string) => {
  return await _axios.get('/vendasMesFilial', {
      params: {
        data: date.replace(/^\d+/, (y: string) => String(Number(y) - 1)),
        filial: filial,
      }
  }).then(response => response.data.data[0].VendasTotaisMes);
};

export const getVendasMesAnoAtual = async (date: string, filial: string) => {
  return await _axios.get('/vendasMesFilial', {
      params: {
        data: date.replace(/^\d+/, (y: string) => String(Number(y))),
        filial: filial,
      }
  }).then(response => response.data.data[0].VendasTotaisMes);
};

export const getVendasTotaisAnoAtual = async (date: string, filial: string) => {
  return await _axios.get('/vendasTotaisAnoFilial', {
      params: {
        ano: new Date(date).getFullYear(),
        filial: filial,
      }
  }).then(response => response.data.data[0].VendasTotaisAno);
};

export const getVendasUltimoDiaComRegistro = async (filial: string) => {
  const response = await _axios.get('/vendasUltimoDiaComRegistro', {
    params: { filial }
  });

  return {
    UltimaDataComRegistro: response.data.data[0].UltimaDataComRegistro,
    TotalDeVendas: response.data.data[0].TotalDeVendas,
  };
};



interface CrescimentoMensalResponse {
  data: CrescimentoMensalRaw[];
}

interface CrescimentoMensalRaw {
  Data: string;
  TotalVendasMesAnoAnterior: number;
  TotalVendasMesAnoAtual: number;
  CrescimentoPercentual: number;
  MetaVendasAtual?: number;
  MetaMesAnoAtual?: number;
}

interface CrescimentoMensalFormatado {
  Data: string;
  Valor: number;
}


const decrementarMes = (date: string) => new Date(new Date(date).setMonth(new Date(date).getMonth() - 1)).toISOString().slice(0, 10);


export const getCrescimentoMensalTotalPorFilialData = async (
  date: string,
  filial: string
): Promise<CrescimentoMensalFormatado[]> => {
  const response = await _axios.get<CrescimentoMensalResponse>('/crescimentoMensalTotalPorFilialData', {
    params: {
      data: decrementarMes(date),
      filial: filial
    }
  });

  return response.data.data.map((item): CrescimentoMensalFormatado => ({
    Data: item.Data,
    Valor: item.CrescimentoPercentual
  }));
};


export const getCrescimentoMensalMetaPorFilialData = async (
  date: string,
  filial: string
): Promise<CrescimentoMensalFormatado[]> => {
  const response = await _axios.get<CrescimentoMensalResponse>('/crescimentoMensalMetaPorFilialData', {
    params: {
      data: decrementarMes(date),
      filial: filial
    }
  });

  return response.data.data.map((item): CrescimentoMensalFormatado => ({
    Data: item.Data,
    Valor: item.CrescimentoPercentual
  }));
};
