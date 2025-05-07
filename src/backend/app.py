from datetime import date
from os import getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services import VendasService


app = FastAPI(title="API Atos Capital")

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vendasService = VendasService()


@app.get("/filiais", summary="Obter todas as filiais")
def get_filiais():
    filiais = vendasService.get_filiais()
    return {"data": filiais}


@app.get("/vendasDiaFilial", summary="Obter vendas totais de uma filial em determinado dia")
def get_vendas_dia(data: date, filial: str = ""):
    result = vendasService.get_vendas_dia(data, filial)
    return {"data": result}


@app.get("/vendasMesFilial", summary="Obter vendas totais de uma filial em determinado mês")
def get_vendas_mes(data: date, filial: str = ""):
    result = vendasService.get_vendas_mes(data, filial)
    return {"data": result}


@app.get("/vendasAcumuladasMes", summary="Obter vendas acumuladas de um mês até determinada data")
def get_vendas_acumuladas_mes(data: date):
    result = vendasService.get_vendas_acumuladas_mes(data)
    return {"data": result}


@app.get("/vendasAcumuladasAno", summary="Obter vendas acumuladas de um ano até determinada data")
def get_vendas_acumuladas_ano(data: date):
    result = vendasService.get_vendas_acumuladas_ano(data)
    return {"data": result}


@app.get("/vendasTotaisAnoFilial", summary="Obter vendas totais de uma filial em determinado ano")
def get_vendas_totais_por_ano_filial(ano: int, filial: str = ""):
    result = vendasService.get_vendas_totais_por_ano_filial(ano, filial)
    return {"data": result}


@app.get("/crescimentoMensalPorFilialData", summary="Obter crescimento mensal por filial e data")
def get_crescimento_mensal_por_filial_data(filial: str, data: date = "2024-01-01"):
    result = vendasService.get_crescimento_mensal_por_filial_data(filial, data)
    return {"data": result}

