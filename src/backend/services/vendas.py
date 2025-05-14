from datetime import date

import pyodbc

from infra.database import conn_str

class VendasService:
    def run_query(self, query: str, params: tuple = ()):
        with pyodbc.connect(conn_str) as connection:
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

    def get_crescimento_mensal_por_filial_data(self, filial: str, data: date):
        query = """
            WITH VendasMensais AS (
                SELECT YEAR(dtVenda) AS Ano,
                       MONTH(dtVenda) AS Mes,
                       nmFilial,
                       SUM(vlVenda) AS TotalVendas
                FROM dbproinfo.dbo.tbVendasDashboard
                WHERE nmFilial = ?
                  AND (YEAR(dtVenda) = 2024 OR YEAR(dtVenda) = 2025)
                GROUP BY YEAR(dtVenda), MONTH(dtVenda), nmFilial
            )
            SELECT v25.nmFilial as Filial,
                   RIGHT('0' + CAST(v25.Mes AS VARCHAR), 2) + '/' + CAST(v25.Ano AS VARCHAR) AS MesAno,
                   v24.TotalVendas AS Vendas2024,
                   v25.TotalVendas AS Vendas2025,
                   (v25.TotalVendas - v24.TotalVendas) * 100.0 / NULLIF(v24.TotalVendas, 0) AS TaxaCrescimento
            FROM VendasMensais v25
            INNER JOIN VendasMensais v24
                    ON v25.Mes = v24.Mes
                   AND v25.nmFilial = v24.nmFilial
                   AND v25.Ano = 2025
                   AND v24.Ano = 2024
            WHERE v25.Mes <= MONTH(GETDATE())
            ORDER BY v25.Mes;
        """
        return self.run_query(query, (filial,))

