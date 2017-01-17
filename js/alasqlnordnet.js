define([], function() {
    
    var sourceData;

    function setSourceData(fieldValue) {
        if(fieldValue.length == 0)
            sourceData = [];
        else 
            sourceData = JSON.parse(fieldValue);
    }

    function getDividendMaxYear() {
        return alasql('SELECT MAX(YEAR([Bokföringsdag])) AS Year \
                       FROM ? \
                       WHERE Transaktionstyp = "UTDELNING"', [sourceData]);
    }

    function getDividendYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM ? \
                       WHERE Transaktionstyp = "UTDELNING" \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1', [sourceData]);
    }

    function getBuyTransactionYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM ? \
                       WHERE Transaktionstyp = "KÖPT" \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1', [sourceData]);
    }

    function getSellTransactionYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM ? \
                       WHERE Transaktionstyp = "SÅLT" \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1', [sourceData]);
    }

    function getDepositYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM ? \
                       WHERE (Transaktionstyp = "KORR PREMIEINB." OR Transaktionstyp = "UTTAG" OR Transaktionstyp = "INSÄTTNING" OR Transaktionstyp = "PREMIEINBETALNING") \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1', [sourceData]);
    }

    function getCourtageYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM ? \
                       WHERE (Transaktionstyp = "KÖPT" OR Transaktionstyp = "SÅLT") \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1', [sourceData]);
    }

    function getDividendAll(addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT"';

        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year, SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE (Transaktionstyp = "UTDELNING"' + taxSqlWhere +') \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1', [sourceData]);
    }

    function getDividendMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND Transaktionstyp = "UTDELNING" \
                       GROUP BY YEAR([Bokföringsdag]), MONTH([Bokföringsdag])', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return Math.round(belopp["0"].Belopp);
    }

    function getTaxMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND Transaktionstyp = "UTL KUPSKATT" \
                       GROUP BY YEAR([Bokföringsdag]), MONTH([Bokföringsdag])', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return Math.round(belopp["0"].Belopp);
    }

    function getDividendYearSumBelopp(year) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' \
                       AND Transaktionstyp = "UTDELNING" \
                       GROUP BY YEAR([Bokföringsdag])', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getTaxYearSumBelopp(year) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' \
                       AND Transaktionstyp = "UTL KUPSKATT" \
                       GROUP BY YEAR([Bokföringsdag])', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getDepositsYearSumBelopp(year) {

        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "KORR PREMIEINB." OR Transaktionstyp = "UTTAG" OR Transaktionstyp = "INSÄTTNING" OR Transaktionstyp = "PREMIEINBETALNING")', [sourceData]);
        
        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getTotalDividend(year, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT"';
 
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "UTDELNING"'  + taxSqlWhere + ") \
                       GROUP BY YEAR([Bokföringsdag])", [sourceData]);
                       
        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;               
    }

    function getVardepapperTotalDividend(year, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT"';

        var result = alasql('SELECT FIRST([ISIN]) AS [ISIN], FIRST([Värdepapper]) AS [name], SUM(REPLACE(Belopp, " ", "")::NUMBER) AS [belopp] \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "UTDELNING"' + taxSqlWhere + ') \
                       GROUP BY [ISIN]', [sourceData]);

        var resultForReturn = [];
        result.forEach(function(object) {
            if(object == null) return;
            if(object.name == null) return;

            var newVardepapperObject = new Object();

            var resultName = alasql('SELECT DISTINCT namn \
                       FROM StockData \
                       WHERE [isin] = "' + object.ISIN + '"');

            var name = object.name;
            if(resultName.length != 0)
                name = resultName["0"].namn;

            newVardepapperObject.name = name;
            newVardepapperObject.value = object.belopp;

            resultForReturn.push(newVardepapperObject);
        });

        return resultForReturn;
    }

    function getBuyTransactionCount(year, month) {

        var result = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND Transaktionstyp = "KÖPT"', [sourceData]);

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount);
    }

    function getSellTransactionCount(year, month) {

        var result = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND Transaktionstyp = "SÅLT"', [sourceData]);

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount);
    }

    function getVärdepapperForYear(year) {
        return alasql('SELECT DISTINCT [Värdepapper] AS Vardepapper, [ISIN] AS ISIN \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND Transaktionstyp = "UTDELNING"', [sourceData]);
    }

    function getVärdepapperDividend(year, month, isin, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT"';

        return alasql('SELECT FIRST([Värdepapper]) AS [name], SUM(REPLACE(Belopp, " ", "")::NUMBER) AS [value] \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' AND [ISIN] = "' + isin + '" AND (Transaktionstyp = "UTDELNING"' + taxSqlWhere + ') \
                       GROUP BY [Värdepapper]', [sourceData]);
    }

    function getCourtageSumAvgifter(year) {
        var result = alasql('SELECT SUM(REPLACE(Avgifter, " ", "")::NUMBER) AS [value] \
                       FROM ? \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "KÖPT" OR Transaktionstyp = "SÅLT")', [sourceData]);

        var courtage = JSON.parse(JSON.stringify(result));
        if(courtage["0"].value == null) return 0;

        return courtage["0"].value;
    }

    return {
        setSourceData: setSourceData,
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
        getVärdepapperForYear: getVärdepapperForYear,
        getCourtageSumAvgifter: getCourtageSumAvgifter,
        getCourtageYears: getCourtageYears
    };
});