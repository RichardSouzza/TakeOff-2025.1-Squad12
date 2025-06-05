from datetime import date

import pyodbc

from infrastructure.database import sql_connection_str


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
            DECLARE @Filial AS varchar(50) = ?;
            DECLARE @Data   AS date = ?;

            SELECT SUM(vlVenda) AS VendasTotaisMes
            FROM dbproinfo.dbo.tbVendasDashboard
            WHERE nmFilial = @Filial
              AND YEAR(dtVenda) = YEAR(@Data)
              AND MONTH(dtVenda) = MONTH(@Data)
            GROUP BY nmFilial, YEAR(dtVenda), MONTH(dtVenda);
        """
        return self.run_query(query, (filial, data))

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
            DECLARE @Data   AS date = ?;

            WITH VendasAnoAnterior AS (
                SELECT
                    MONTH(dtVenda) AS Mes,
                    SUM(vlVenda) AS TotalVendasMesAnoAnterior
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND YEAR(dtVenda) = YEAR(@Data) - 1
                  AND MONTH(dtVenda) < MONTH(@Data)
                GROUP BY MONTH(dtVenda)
            ),
            VendasAnoAtual AS (
                SELECT
                    MONTH(dtVenda) AS Mes,
                    SUM(vlVenda) AS TotalVendasMesAnoAtual
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND YEAR(dtVenda) = YEAR(@Data)
                  AND MONTH(dtVenda) < MONTH(@Data)
                GROUP BY MONTH(dtVenda)
            )
            SELECT
                CAST(
                    CAST(YEAR(@Data) AS varchar(4)) + '-' +
                    RIGHT('0' + CAST(COALESCE(a.Mes, b.Mes) AS varchar(2)), 2) + '-01'
                    AS date
                ) AS Data,
                ISNULL(b.TotalVendasMesAnoAnterior, 0) AS TotalVendasMesAnoAnterior,
                ISNULL(a.TotalVendasMesAnoAtual, 0) AS TotalVendasMesAnoAtual,
                CASE
                    WHEN ISNULL(b.TotalVendasMesAnoAnterior, 0) = 0 THEN 'N/A'
                    ELSE ROUND(
                        (((ISNULL(a.TotalVendasMesAnoAtual, 0) - b.TotalVendasMesAnoAnterior) * 100.0)
                        / b.TotalVendasMesAnoAnterior), 2
                    )
                END AS CrescimentoPercentual
            FROM VendasAnoAtual a
            FULL OUTER JOIN VendasAnoAnterior b ON a.Mes = b.Mes
            ORDER BY COALESCE(a.Mes, b.Mes);
        """
        return self.run_query(query, (filial, data))

    def get_crescimento_mensal_meta_por_filial_data(self, filial: str, data: date):
        query = """
            DECLARE @Filial AS varchar(50) = ?;
            DECLARE @Data    AS date = ?;

            WITH VendasAnoAnterior AS (
                SELECT
                    MONTH(dtVenda) AS Mes,
                    SUM(vlVenda) AS TotalVendasMesAnoAnterior
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND YEAR(dtVenda) = YEAR(@Data) - 1
                  AND MONTH(dtVenda) < MONTH(@Data)
                GROUP BY MONTH(dtVenda)
            ),
            VendasAnoAtual AS (
                SELECT
                    MONTH(dtVenda) AS Mes,
                    SUM(vlVenda) AS TotalVendasMesAnoAtual
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = @Filial
                  AND YEAR(dtVenda) = YEAR(@Data)
                  AND MONTH(dtVenda) < MONTH(@Data)
                GROUP BY MONTH(dtVenda)
            )
            SELECT
                CAST(
                    CAST(YEAR(@Data) AS varchar(4)) + '-' +
                    RIGHT('0' + CAST(COALESCE(a.Mes, b.Mes) AS varchar(2)), 2) + '-01'
                    AS date
                ) AS Data,
                ISNULL(b.TotalVendasMesAnoAnterior, 0) AS TotalVendasMesAnoAnterior,
                ISNULL(a.TotalVendasMesAnoAtual, 0) AS TotalVendasMesAnoAtual,
                ROUND(ISNULL(b.TotalVendasMesAnoAnterior, 0) * 1.05, 2) AS MetaMesAnoAtual,
                CASE
                    WHEN ROUND(ISNULL(b.TotalVendasMesAnoAnterior, 0) * 1.05, 2) = 0 THEN 'N/A'
                    ELSE CAST(ROUND(
                        ((ISNULL(a.TotalVendasMesAnoAtual, 0) - (ISNULL(b.TotalVendasMesAnoAnterior, 0) * 1.05)) * 100.0)
                        / (ISNULL(b.TotalVendasMesAnoAnterior, 0) * 1.05), 2) AS varchar)
                END AS CrescimentoPercentual
            FROM VendasAnoAtual a
            FULL OUTER JOIN VendasAnoAnterior b ON a.Mes = b.Mes
            ORDER BY COALESCE(a.Mes, b.Mes);
        """
        return self.run_query(query, (filial, data))
