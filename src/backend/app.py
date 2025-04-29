from datetime import date
from os import getenv

from fastapi import FastAPI

from services import VendasService


app = FastAPI(title="API Atos Capital")

vendasService = VendasService()


@app.get("/filiais", summary="Obter todas as filiais")
def getFiliais():
    filiais = vendasService.getFiliais()
    return {"data": filiais}


@app.get("/vendasAcumuladas", summary="Obter vendas acumuladas até determinada data")
def getVendasAcumuladas(data: date):
    result = vendasService.getVendasAcumuladas(data)
    return {"data": result}


@app.get("/crescimentoMensalPorFilialData", summary="Obter crescimento mensal por filial e data")
def getCrescimentoMensalPorFilialData(filial: str, data: date):
    result = vendasService.getCrescimentoMensalPorFilialData(filial, data)
    return {"data": result}

