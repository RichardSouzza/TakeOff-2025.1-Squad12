from contextlib import asynccontextmanager
from datetime import date
from os import getenv

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from services import VendasService


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.vendas_service = VendasService()    
    yield


app = FastAPI(
    title="API Atos Capital",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/filiais", summary="Obter todas as filiais")
def get_filiais(request: Request):
    filiais = request.app.state.vendas_service.get_filiais()
    return {"data": filiais}


@app.get("/vendasDiaFilial", summary="Obter vendas totais de uma filial em determinado dia")
def get_vendas_dia(request: Request, data: date, filial: str = ""):
    result = request.app.state.vendas_service.get_vendas_dia(data, filial)
    return {"data": result}


@app.get("/vendasMesFilial", summary="Obter vendas totais de uma filial em determinado mês")
def get_vendas_mes(request: Request, data: date, filial: str = ""):
    result = request.app.state.vendas_service.get_vendas_mes(data, filial)
    return {"data": result}


@app.get("/vendasAcumuladasMes", summary="Obter vendas acumuladas de um mês até determinada data")
def get_vendas_acumuladas_mes(request: Request, data: date, filial: str):
    result = request.app.state.vendas_service.get_vendas_acumuladas_mes(data, filial)
    return {"data": result}


@app.get("/vendasAcumuladasAno", summary="Obter vendas acumuladas de um ano até determinada data")
def get_vendas_acumuladas_ano(request: Request, data: date):
    result = request.app.state.vendas_service.get_vendas_acumuladas_ano(data)
    return {"data": result}


@app.get("/vendasUltimoDiaComRegistro", summary="Obter vendas do último dia com registro")
def get_vendas_ultimo_dia_com_registro(request: Request, filial: str):
    result = request.app.state.vendas_service.get_vendas_ultimo_dia_com_registro(filial)
    return {"data": result}


@app.get("/vendasTotaisAnoFilial", summary="Obter vendas totais de uma filial em determinado ano")
def get_vendas_totais_por_ano_filial(request: Request, ano: int, filial: str = ""):
    result = request.app.state.vendas_service.get_vendas_totais_por_ano_filial(ano, filial)
    return {"data": result}


@app.get("/crescimentoMensalTotalPorFilialData", summary="Obter crescimento de vendas mensais por filial e data")
def get_crescimento_mensal_total_por_filial_data(request: Request, filial: str, data: date = "2025-05-01"):
    result = request.app.state.vendas_service.get_crescimento_mensal_total_por_filial_data(filial, data)
    return {"data": result}


@app.get("/crescimentoMensalMetaPorFilialData", summary="Obter crescimento mensal em relação à meta por filial e data")
def get_crescimento_mensal_meta_por_filial_data(request: Request, filial: str, data: date = "2025-05-01"):
    result = request.app.state.vendas_service.get_crescimento_mensal_meta_por_filial_data(filial, data)
    return {"data": result}

