define([], function() {
    
    function createDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS AvanzaData (  \
                Antal INT, \
                Belopp DECIMAL, \
                Datum DATE, \
                ISIN NVARCHAR(50), \
                Konto NVARCHAR(100), \
                Kurs DECIMAL, \
                [Typ av transaktion] NVARCHAR(100), \
                Valuta NVARCHAR(10), \
                [Värdepapperbeskrivning] NVARCHAR(100)); \
                \
                CREATE INDEX DatumIndex ON AvanzaData(Datum); \
                CREATE INDEX ISINIndex ON AvanzaData(ISIN); \
                CREATE INDEX TypAvTransaktionIndex ON AvanzaData([Typ av transaktion]); \
                CREATE INDEX VardepapperIndex ON AvanzaData([Värdepapperbeskrivning]); \
                CREATE INDEX BeloppIndex ON AvanzaData([Belopp]); \
        ');
    }

    function getDividendMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' \
                       AND [Typ av transaktion] = "Utdelning" \
                       GROUP BY YEAR(Datum), MONTH(Datum)');

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getTaxMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' \
                       AND [Värdepapperbeskrivning] = "Utländsk källskatt" \
                       GROUP BY YEAR(Datum), MONTH(Datum)');

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getDividendMaxYear() {
        return alasql('SELECT MAX(YEAR(Datum)) AS Year \
                       FROM AvanzaData \
                       WHERE [Typ av transaktion] = "Utdelning"');
    }

    function getDividendYears() {
        return alasql('SELECT FIRST(YEAR(Datum)) AS Year \
                       FROM AvanzaData \
                       WHERE [Typ av transaktion] = "Utdelning" \
                       GROUP BY YEAR(Datum) \
                       ORDER BY 1');
    }

    function getBuyTransactionYears() {
        return alasql('SELECT FIRST(YEAR(Datum)) AS Year \
                FROM AvanzaData \
                WHERE [Typ av transaktion] = "Köp" \
                GROUP BY YEAR(Datum) \
                ORDER BY 1');
    }

    function getSellTransactionYears() {
        return alasql('SELECT FIRST(YEAR(Datum)) AS Year \
                FROM AvanzaData \
                WHERE [Typ av transaktion] = "Sälj" \
                GROUP BY YEAR(Datum) \
                ORDER BY 1');
    }

    function getDepositYears() {
        return alasql('SELECT FIRST(YEAR(Datum)) AS Year \
                       FROM AvanzaData \
                       WHERE ([Typ av transaktion] = "Insättning" OR [Typ av transaktion] = "Uttag") \
                       GROUP BY YEAR(Datum) \
                       ORDER BY 1');
    }

    function getDividendAll(addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR [Värdepapperbeskrivning] = "Utländsk källskatt"';
            
        return alasql('SELECT FIRST(YEAR(Datum)) AS Year, SUM(Belopp::NUMBER) AS Belopp \
                       FROM AvanzaData \
                       WHERE ([Typ av transaktion] = "Utdelning"' + taxSqlWhere + ') \
                       GROUP BY YEAR(Datum) \
                       ORDER BY 1');
    }

    function getDividendYearSumBelopp(year) {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' \
                       AND [Typ av transaktion] = "Utdelning" \
                       GROUP BY YEAR(Datum)');

        var belopp = JSON.parse(JSON.stringify(result));

        return belopp["0"].Belopp;
    }

    function getTaxYearSumBelopp(year) {
        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' \
                       AND [Värdepapperbeskrivning] = "Utländsk källskatt" \
                       GROUP BY YEAR(Datum)');

        var belopp = JSON.parse(JSON.stringify(result));

        return belopp["0"].Belopp;
    }

    function getDepositsYearSumBelopp(year) {
        var result = alasql('SELECT FIRST(YEAR(Datum)) AS Ar, SUM(Belopp::NUMBER) AS Belopp \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND ([Typ av transaktion] = "Insättning" OR [Typ av transaktion] = "Uttag") \
                       GROUP BY YEAR(Datum)');

        var belopp = JSON.parse(JSON.stringify(result));

        return belopp["0"].Belopp;
    }

    function getTotalDividend(year, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR [Värdepapperbeskrivning] = "Utländsk källskatt"';

        var result = alasql('SELECT SUM(Belopp::NUMBER) AS Belopp \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND ([Typ av transaktion] = "Utdelning"' + taxSqlWhere + ")");

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return Math.round(belopp["0"].Belopp); 
    }

    function getVärdepapperForYear(year) {
        return alasql('SELECT DISTINCT [Värdepapperbeskrivning] AS Vardepapper, [ISIN] AS ISIN \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND [Typ av transaktion] = "Utdelning"');
    }

    function getVärdepapperDividend(year, month, isin, addTaxToSum) {

        var result = alasql('SELECT FIRST(ISIN) AS [ISIN], SUM(Belopp::NUMBER) AS [value] \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' AND [ISIN] = "' + isin + '" AND [Typ av transaktion] = "Utdelning" \
                       GROUP BY ISIN');
                
        var resultForReturn = [];
        result.forEach(function(object) {

            if(object == null) return;
            if(object.ISIN == null) return;

            var newVardepapperObject = new Object();

            var resultName = alasql('SELECT DISTINCT [Värdepapperbeskrivning] \
                       FROM AvanzaData \
                       WHERE [ISIN] = "' + object.ISIN + '" AND [Värdepapperbeskrivning] != "Utländsk källskatt"');

            var taxValue = 0;
            if(addTaxToSum) {
                var resultTax = alasql('SELECT SUM(Belopp::NUMBER) AS [value] \
                                     FROM AvanzaData \
                                     WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' AND [ISIN] = "' + object.ISIN + '" AND [Värdepapperbeskrivning] = "Utländsk källskatt" \
                                     GROUP BY ISIN');
                
                taxValue = resultTax["0"].value;
            }

            newVardepapperObject.name = resultName["0"].Värdepapperbeskrivning;
            newVardepapperObject.value = (object.value + taxValue);

            resultForReturn.push(newVardepapperObject);
        });

        return resultForReturn;
    }

    function getVardepapperTotalDividend(year, addTaxToSum) {

        var result = alasql('SELECT FIRST(ISIN) AS [name], SUM(Belopp::NUMBER) AS [value] \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND [Typ av transaktion] = "Utdelning" \
                       GROUP BY ISIN');
                
        var resultForReturn = [];
        result.forEach(function(object) {

            if(object == null) return;
            if(object.name == null) return;

            var newVardepapperObject = new Object();

            var resultName = alasql('SELECT DISTINCT [Värdepapperbeskrivning] \
                       FROM AvanzaData \
                       WHERE [ISIN] = "' + object.name + '" AND [Värdepapperbeskrivning] != "Utländsk källskatt"');

            var taxValue = 0;
            if(addTaxToSum) {
                var resultTax = alasql('SELECT SUM(Belopp::NUMBER) AS [value] \
                                     FROM AvanzaData \
                                     WHERE YEAR(Datum) = ' + year + ' AND [ISIN] = "' + object.name + '" AND [Värdepapperbeskrivning] = "Utländsk källskatt" \
                                     GROUP BY ISIN');
                
                taxValue = resultTax["0"].value;
            }

            newVardepapperObject.name = resultName["0"].Värdepapperbeskrivning;
            newVardepapperObject.value = (object.value + taxValue);

            resultForReturn.push(newVardepapperObject);
        });

        return resultForReturn;
    }

    function getBuyTransactionCount(year, month) {
        var result = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' \
                       AND [Typ av transaktion] = "Köp"');

        var resultMinus = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' \
                       AND [Typ av transaktion] = "Köp, rättelse"');

        var countMinusValue = 0;
        var countMinus = JSON.parse(JSON.stringify(resultMinus));
        if(countMinus["0"].TransactionCount == null) 
            countMinusValue = 0
        else
            countMinusValue = countMinus["0"].TransactionCount;

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount) - parseInt(countMinusValue);
    }

    function getSellTransactionCount(year, month) {
        var result = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM AvanzaData \
                       WHERE YEAR(Datum) = ' + year + ' AND MONTH(Datum) = ' + month + ' \
                       AND [Typ av transaktion] = "Sälj"');

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount);
    }

    return {
        createDataTable: createDataTable,
        getDividendMaxYear: getDividendMaxYear,
        getDividendYears: getDividendYears,
        getDividendMonthSumBelopp: getDividendMonthSumBelopp,
        getTaxMonthSumBelopp: getTaxMonthSumBelopp,
        getDividendYearSumBelopp: getDividendYearSumBelopp,
        getTotalDividend: getTotalDividend,
        getVardepapperTotalDividend: getVardepapperTotalDividend,
        getTaxYearSumBelopp: getTaxYearSumBelopp,
        getDepositsYearSumBelopp: getDepositsYearSumBelopp,
        getDepositYears: getDepositYears,
        getBuyTransactionYears: getBuyTransactionYears,
        getBuyTransactionCount: getBuyTransactionCount,
        getSellTransactionYears: getSellTransactionYears,
        getSellTransactionCount: getSellTransactionCount,
        getDividendAll: getDividendAll,
        getVärdepapperDividend: getVärdepapperDividend,
        getVärdepapperForYear: getVärdepapperForYear
    };
});