define([], function() {
    
    function createDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS NordnetData (  \
                [Affärsdag] DATE, \
                Antal DECIMAL, \
                Avgifter NVARCHAR(50), \
                Belopp NVARCHAR(50), \
                [Bokföringsdag] DATE, \
                ISIN NVARCHAR(50), \
                Instrumenttyp NVARCHAR(20), \
                Kurs DECIMAL, \
                Likviddag DATE, \
                Makuleringsdatum DATE, \
                Transaktionstyp NVARCHAR(100), \
                Valuta NVARCHAR(10), \
                [Värdepapper] NVARCHAR(100), \
                [Transaktionstext] NVARCHAR(100)); \
                \
                CREATE INDEX AffarsdagIndex ON NordnetData([Affärsdag]); \
                CREATE INDEX TransaktionstextIndex ON NordnetData([Transaktionstext]); \
                CREATE INDEX ISINIndex ON NordnetData(ISIN); \
                CREATE INDEX TransaktionstypIndex ON NordnetData([Transaktionstyp]); \
                CREATE INDEX VardepapperIndex ON NordnetData([Värdepapper]); \
                CREATE INDEX BeloppIndex ON NordnetData([Belopp]); \
        ');        
    }

    function getDividendMaxYear() {
        return alasql('SELECT MAX(YEAR([Bokföringsdag])) AS Year \
                       FROM NordnetData \
                       WHERE Transaktionstyp = "UTDELNING"');
    }

    function getDividendYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM NordnetData \
                       WHERE Transaktionstyp = "UTDELNING" \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1');
    }

    function getBuyTransactionYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM NordnetData \
                       WHERE Transaktionstyp = "KÖPT" \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1');
    }

    function getSellTransactionYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM NordnetData \
                       WHERE Transaktionstyp = "SÅLT" \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1');
    }

    function getTransactionYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                FROM NordnetData \
                WHERE (Transaktionstyp = "SÅLT" OR Transaktionstyp = "KÖPT") \
                GROUP BY YEAR([Bokföringsdag]) \
                ORDER BY 1');
    }

    function getDepositYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM NordnetData \
                       WHERE (Transaktionstyp = "KORR PREMIEINB." OR Transaktionstyp = "UTTAG" OR Transaktionstyp = "INSÄTTNING" OR Transaktionstyp = "PREMIEINBETALNING") \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1');
    }

    function getCourtageYears() {
        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year \
                       FROM NordnetData \
                       WHERE (Transaktionstyp = "KÖPT" OR Transaktionstyp = "SÅLT") \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1');
    }

    function getDividendAll(addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT" OR Transaktionstyp = "MAK UTL KUPSKATT"';

        return alasql('SELECT FIRST(YEAR([Bokföringsdag])) AS Year, SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE (Transaktionstyp = "UTDELNING" OR Transaktionstyp = "MAK UTDELNING"' + taxSqlWhere +') \
                       GROUP BY YEAR([Bokföringsdag]) \
                       ORDER BY 1');
    }

    function getDividendMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND (Transaktionstyp = "UTDELNING" OR Transaktionstyp = "MAK UTDELNING")');

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return Math.round(belopp["0"].Belopp);
    }

    function getTaxMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND (Transaktionstyp = "UTL KUPSKATT" OR Transaktionstyp = "MAK UTL KUPSKATT")');

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return Math.round(belopp["0"].Belopp);
    }

    function getDividendYearSumBelopp(year) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' \
                       AND (Transaktionstyp = "UTDELNING" OR Transaktionstyp = "MAK UTDELNING")');

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getTaxYearSumBelopp(year) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' \
                       AND (Transaktionstyp = "UTL KUPSKATT" OR Transaktionstyp = "MAK UTL KUPSKATT")');

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getDepositsYearSumBelopp(year) {

        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "KORR PREMIEINB." OR Transaktionstyp = "UTTAG" OR Transaktionstyp = "INSÄTTNING" OR Transaktionstyp = "PREMIEINBETALNING")');
        
        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getTotalDividend(year, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT" OR Transaktionstyp = "MAK UTL KUPSKATT"';
 
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "UTDELNING" OR Transaktionstyp = "MAK UTDELNING"'  + taxSqlWhere + ")");
                       
        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;               
    }

    function getVardepapperTotalDividend(year, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT" OR Transaktionstyp = "MAK UTL KUPSKATT"';

        var result = alasql('SELECT FIRST([ISIN]) AS [ISIN], FIRST([Värdepapper]) AS [name], SUM(REPLACE(Belopp, " ", "")::NUMBER) AS [belopp] \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "UTDELNING" OR Transaktionstyp = "MAK UTDELNING"' + taxSqlWhere + ') \
                       GROUP BY [ISIN]');

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
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND Transaktionstyp = "KÖPT"');

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount);
    }

    function getSellTransactionCount(year, month) {

        var result = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' \
                       AND Transaktionstyp = "SÅLT"');

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount);
    }

    function getVärdepapperForYear(year) {
        return alasql('SELECT DISTINCT [Värdepapper] AS Vardepapper, [ISIN] AS ISIN \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND (Transaktionstyp = "UTDELNING" OR Transaktionstyp = "MAK UTDELNING")');
    }

    function getVärdepapperDividend(year, month, isin, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT" OR Transaktionstyp = "MAK UTL KUPSKATT"';

        return alasql('SELECT FIRST([Värdepapper]) AS [name], SUM(REPLACE(Belopp, " ", "")::NUMBER) AS [value] \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND MONTH([Bokföringsdag]) = ' + month + ' AND [ISIN] = "' + isin + '" AND (Transaktionstyp = "UTDELNING" OR Transaktionstyp = "MAK UTDELNING"' + taxSqlWhere + ') \
                       GROUP BY [Värdepapper]');
    }

    function getCourtageSumSell(year) {
        var result = alasql('SELECT SUM(REPLACE(Avgifter, " ", "")::NUMBER) AS [value] \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND Transaktionstyp = "SÅLT"');

        var courtage = JSON.parse(JSON.stringify(result));
        if(courtage["0"].value == null) return 0;

        return courtage["0"].value;
    }

    function getCourtageSumBuy(year) {
        var result = alasql('SELECT SUM(REPLACE(Avgifter, " ", "")::NUMBER) AS [value] \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND Transaktionstyp = "KÖPT"');

        var courtage = JSON.parse(JSON.stringify(result));
        if(courtage["0"].value == null) return 0;

        return courtage["0"].value;
    }

    function getBuyTransactionSumBelopp(year) {
        return alasql('SELECT VALUE SUM(REPLACE(Belopp, " ", "")::NUMBER) AS [value] \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND Transaktionstyp = "KÖPT"');
    }

    function getSellTransactionSumBelopp(year) {
        return alasql('SELECT VALUE SUM(REPLACE(Belopp, " ", "")::NUMBER) AS [value] \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND Transaktionstyp = "SÅLT"');
    }

    function getReturnedTaxYearSumBelopp(year) {
        return alasql('SELECT VALUE SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM NordnetData \
                       WHERE YEAR([Bokföringsdag]) = ' + year + ' AND Transaktionstext = "UTL KUPSKATT ÅTER"');
    
    }

    return {
        createDataTable: createDataTable,
        getReturnedTaxYearSumBelopp: getReturnedTaxYearSumBelopp,
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
        getCourtageSumBuy: getCourtageSumBuy,
        getCourtageSumSell: getCourtageSumSell,
        getCourtageYears: getCourtageYears,
        getBuyTransactionSumBelopp: getBuyTransactionSumBelopp,
        getSellTransactionSumBelopp: getSellTransactionSumBelopp,
        getTransactionYears: getTransactionYears
    };
});