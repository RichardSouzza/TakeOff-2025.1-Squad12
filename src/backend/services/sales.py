from datetime import date

import pyodbc

from backend.infrastructure.database import sql_connection_str

class VendasService:
    def run_query(self, query: str, params: tuple = ()):
        with pyodbc.connect(sql_connection_str) as connection:
            cursor = connection.cursor()
            cursor.execute(query, params)
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def get_filiais(self):
        query = "SELECT DISTINCT nmFilial as Nome FROM dbproinfo.dbo.tbVendasDashboard ORDER BY nmFilial;"
        return self.run_query(query)

    def get_vendas_dia(self, data, filial):
        query = """
            SELECT SUM(vlVenda) AS VendasTotaisDia
            FROM dbproinfo.dbo.tbVendasDashboard
            WHERE dtVenda = ?
              AND (? IS NULL OR nmFilial = ?);
        """
        return self.run_query(query, (data, filial, filial))

    def get_vendas_mes(self, data, filial):
        query = """
            SELECT SUM(vlVenda) AS VendasTotaisMes
            FROM dbproinfo.dbo.tbVendasDashboard
            WHERE nmFilial = ?
              AND YEAR(dtVenda) = YEAR(?)
              AND MONTH(dtVenda) = MONTH(?)
            GROUP BY nmFilial, YEAR(dtVenda), MONTH(dtVenda);
        """
        return self.run_query(query, (filial, data, data))

    def get_vendas_acumuladas_mes(self, data, filial):
        first_day = data.replace(day=1)
        query = """
            SELECT ISNULL(SUM(vlVenda), 0) AS VendasAcumuladasNoMes
            FROM dbproinfo.dbo.tbVendasDashboard
            WHERE dtVenda BETWEEN ? AND ?
              AND (? IS NULL OR nmFilial = ?);
        """
        return self.run_query(query, (first_day, data, filial, filial))

    def get_vendas_acumuladas_ano(self, data):
        query = """
            SELECT SUM(vlVenda) AS VendasAcumuladas
            FROM dbproinfo.dbo.tbVendasDashboard
            WHERE dtVenda >= CAST(YEAR(?) AS VARCHAR) + '-01-01'
              AND dtVenda <= ?;
        """
        return self.run_query(query, (data, data))

    def get_vendas_ultimo_dia_com_registro(self, filial: str):
        query = """
            SELECT dtVenda as UltimaDataComRegistro,
                   SUM(vlVenda) AS TotalDeVendas
            FROM dbproinfo.dbo.tbVendasDashboard
            WHERE nmFilial = ?
              AND vlVenda > 0
              AND dtVenda = (
                  SELECT MAX(dtVenda)
                  FROM dbproinfo.dbo.tbVendasDashboard
                  WHERE nmFilial = ?
                    AND vlVenda > 0
              )
            GROUP BY dtVenda;
        """
        return self.run_query(query, (filial, filial))

    def get_vendas_totais_por_ano_filial(self, ano, filial):
        query = """
            SELECT ISNULL(SUM(vlVenda), 0) AS VendasTotaisAno
            FROM dbproinfo.dbo.tbVendasDashboard
            WHERE YEAR(dtVenda) = ?
              AND (? IS NULL OR nmFilial = ?);
        """
        return self.run_query(query, (ano, filial, filial))

    def get_crescimento_mensal_total_por_filial_data(self, filial: str, data: date):
        query = """
            DECLARE @Filial AS varchar(50) = ?;
            DECLARE @DataInicio AS date = '2025-01-01';
            DECLARE @DataFim    AS date = ?;

            WITH VendasAtuais AS (
                SELECT
                    CAST(CONVERT(char(6), dtVenda, 112) + '01' AS date) AS MesAno,
                    SUM(vlVenda) AS TotalVendasMes
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND dtVenda >= @DataInicio
                  AND dtVenda < @DataFim
                GROUP BY CAST(CONVERT(char(6), dtVenda, 112) + '01' AS date)
            ),

            VendasAnoAnterior AS (
                SELECT
                    CAST(CONVERT(char(6), DATEADD(year, 1, dtVenda), 112) + '01' AS date) AS MesAno,
                    SUM(vlVenda) AS TotalVendasMesAnoAnterior
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND dtVenda >= DATEADD(year, -1, @DataInicio)
                  AND dtVenda < DATEADD(year, -1, @DataFim)
                GROUP BY CAST(CONVERT(char(6), DATEADD(year, 1, dtVenda), 112) + '01' AS date)
            )

            SELECT
                VA.MesAno,
                VA.TotalVendasMes,
                VAA.TotalVendasMesAnoAnterior,

                CASE
                    WHEN VAA.TotalVendasMesAnoAnterior = 0 OR VAA.TotalVendasMesAnoAnterior IS NULL THEN NULL
                    ELSE (VA.TotalVendasMes * 100.0) / VAA.TotalVendasMesAnoAnterior - 100.0
                END AS DiferencaPercentual
            FROM VendasAtuais VA
            LEFT JOIN VendasAnoAnterior VAA ON VA.MesAno = VAA.MesAno
            ORDER BY VA.MesAno;
        """
        return self.run_query(query, (filial, data))

    def get_crescimento_mensal_meta_por_filial_data(self, filial: str, data: date):
        query = """
            DECLARE @Filial AS varchar(50) = ?;
            DECLARE @DataInicio AS date = '2025-01-01';
            DECLARE @DataFim    AS date = ?;

            WITH VendasAtuais AS (
                SELECT
                    CAST(CONVERT(char(6), dtVenda, 112) + '01' AS date) AS MesAno,
                    SUM(vlVenda) AS TotalVendasMes
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND dtVenda >= @DataInicio
                  AND dtVenda < @DataFim
                GROUP BY CAST(CONVERT(char(6), dtVenda, 112) + '01' AS date)
            ),

            VendasAnoAnterior AS (
                SELECT
                    CAST(CONVERT(char(6), DATEADD(year, 1, dtVenda), 112) + '01' AS date) AS MesAno,
                    SUM(vlVenda) AS TotalVendasMesAnoAnterior
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND dtVenda >= DATEADD(year, -1, @DataInicio)
                  AND dtVenda < DATEADD(year, -1, @DataFim)
                GROUP BY CAST(CONVERT(char(6), DATEADD(year, 1, dtVenda), 112) + '01' AS date)
            )

            SELECT
                VA.MesAno,
                VA.TotalVendasMes,
                VA.TotalVendasMes * 1.05 AS MetaVendasAtual,
                VAA.TotalVendasMesAnoAnterior,
                VAA.TotalVendasMesAnoAnterior * 1.05 AS MetaAnoAnterior,

                CASE
                    WHEN VAA.TotalVendasMesAnoAnterior * 1.05 = 0 OR VAA.TotalVendasMesAnoAnterior IS NULL THEN NULL
                    ELSE (VA.TotalVendasMes * 100.0) / (VAA.TotalVendasMesAnoAnterior * 1.05) - 100.0
                END AS DiferencaPercentual
            FROM VendasAtuais VA
            LEFT JOIN VendasAnoAnterior VAA ON VA.MesAno = VAA.MesAno
            ORDER BY VA.MesAno;
        """
        return self.run_query(query, (filial, data))

