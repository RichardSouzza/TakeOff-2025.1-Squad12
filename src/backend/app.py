from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from routers import auth_router, vendas_router
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


app.include_router(auth_router)
app.include_router(vendas_router)
