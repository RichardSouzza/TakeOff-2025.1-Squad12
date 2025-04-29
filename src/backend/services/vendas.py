from datetime import date

from core import cursor


class VendasService:
    def getFiliais(self):
        query = "SELECT DISTINCT nmFilial as Nome FROM dbproinfo.dbo.tbVendasDashboard;"
        cursor.execute(query)
        return list(cursor)

    def getVendasAcumuladas(self, data):
        query = """
            SELECT 
                SUM(vlVenda) AS VendasAcumuladas
            FROM 
                dbproinfo.dbo.tbVendasDashboard
            WHERE 
                dtVenda >= CAST(YEAR(%s) AS VARCHAR) + '-01-01' 
                AND dtVenda <= %s;
        """

        cursor.execute(query, (data, data))
 
        return list(cursor)

    def getCrescimentoMensalPorFilialData(self, filial: str, data: date):
        query = """
            WITH VendasMensais AS (
                SELECT
                    YEAR(dtVenda) AS Ano,
                    MONTH(dtVenda) AS Mes,
                    nmFilial,
                    SUM(vlVenda) AS TotalVendas
                FROM
                    dbproinfo.dbo.tbVendasDashboard tvd
                WHERE
                    nmFilial = %s
                    AND (YEAR(dtVenda) = 2024 OR YEAR(dtVenda) = 2025)
                GROUP BY
                    YEAR(dtVenda), MONTH(dtVenda), nmFilial
            )
            SELECT
                v25.nmFilial as Filial,
                RIGHT('0' + CAST(v25.Mes AS VARCHAR), 2) + '/' + CAST(v25.Ano AS VARCHAR) AS MesAno,
                v24.TotalVendas AS Vendas2024,
                v25.TotalVendas AS Vendas2025,
                (v25.TotalVendas - v24.TotalVendas) * 100.0 / NULLIF(v24.TotalVendas, 0) AS TaxaCrescimento
            FROM
                VendasMensais v25
            INNER JOIN
                VendasMensais v24
                ON v25.Mes = v24.Mes
                AND v25.nmFilial = v24.nmFilial
                AND v25.Ano = 2025
                AND v24.Ano = 2024
            WHERE
                v25.Mes <= MONTH(GETDATE())
            ORDER BY
                v25.Mes;
        """

        cursor.execute(query, filial, data)
        
        data = [row for row in cursor]

        return data

