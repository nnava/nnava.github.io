define(['./alasql.min'], function(alasqlhelper) {
    
    var sourceData;

    function setSourceData(fieldValue) {
        if(fieldValue.length == 0)
            sourceData = [];
        else 
            sourceData = JSON.parse(fieldValue);
    }

    function getDividendSumBelopp(year, month) {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' \
                       AND [Typ av transaktion] = "Utdelning" \
                       GROUP BY YEAR(Datum), MONTH(Datum)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return parseInt(belopp["0"].Belopp);
    }

    function getDividendMaxYear() {
        return alasql('SELECT MAX(YEAR(Datum)) AS Ar \
                       FROM ? \
                       WHERE [Typ av transaktion] = "Utdelning"', [sourceData]);
    }

    function getDividendYears() {
        return alasql('SELECT FIRST(YEAR(Datum)) AS Ar \
                       FROM ? \
                       WHERE [Typ av transaktion] = "Utdelning" \
                       GROUP BY YEAR(Datum) \
                       ORDER BY 1', [sourceData]);
    }

    function getDepositYears() {
        return alasql('SELECT FIRST(YEAR(Datum)) AS Ar \
                       FROM ? \
                       WHERE [Typ av transaktion] = "Insattning" OR [Typ av transaktion] = "Uttag" \
                       GROUP BY YEAR(Datum) \
                       ORDER BY 1', [sourceData]);
    }

    function getDividendMonthSumBelopp(year, month) {
        return alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' \
                       AND [Typ av transaktion] = "Utdelning" \
                       GROUP BY YEAR(Datum), MONTH(Datum)', [sourceData]);
    }

    function getDividendYearSumBelopp(year) {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Datum) = ' + year + ' \
                       AND [Typ av transaktion] = "Utdelning" \
                       GROUP BY YEAR(Datum)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));

        return parseInt(belopp["0"].Belopp);
    }

    function getTaxYearSumBelopp(year) {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Datum) = ' + year + ' \
                       AND [Vardepapperbeskrivning] = "Utlandsk kallskatt" \
                       GROUP BY YEAR(Datum)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));

        return parseInt(belopp["0"].Belopp);
    }

    function getDepositsYearSumBelopp(year) {
        var result = alasql('SELECT FIRST(YEAR(Datum)) AS Ar, SUM(Belopp::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Datum) = ' + year + ' AND ([Typ av transaktion] = "Insattning" OR [Typ av transaktion] = "Uttag") \
                       GROUP BY YEAR(Datum)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));

        return parseInt(belopp["0"].Belopp);
    }

    function getTotalDividend() {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE [Typ av transaktion] = "Utdelning"', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return parseInt(belopp["0"].Belopp); 
    }

    function getVardepapperTotalDividend() {
        return alasql('SELECT FIRST(Vardepapperbeskrivning) AS [name], ROUND(SUM(Belopp::NUMBER), 2) AS [value] \
                       FROM ? \
                       WHERE [Typ av transaktion] = "Utdelning" \
                       GROUP BY Vardepapperbeskrivning', [sourceData]);
    }

    return {
        setSourceData: setSourceData,
        getDividendSumBelopp: getDividendSumBelopp,
        getDividendMaxYear: getDividendMaxYear,
        getDividendYears: getDividendYears,
        getDividendMonthSumBelopp: getDividendMonthSumBelopp,
        getDividendYearSumBelopp: getDividendYearSumBelopp,
        getTotalDividend: getTotalDividend,
        getVardepapperTotalDividend: getVardepapperTotalDividend,
        getTaxYearSumBelopp: getTaxYearSumBelopp,
        getDepositsYearSumBelopp: getDepositsYearSumBelopp,
        getDepositYears: getDepositYears
    };
});