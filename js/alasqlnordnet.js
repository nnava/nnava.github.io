define(['./alasql.min'], function(alasqlhelper) {
    
    var sourceData;

    function setSourceData(fieldValue) {
        if(fieldValue.length == 0)
            sourceData = [];
        else 
            sourceData = JSON.parse(fieldValue);
    }

    function getDividendMaxYear() {
        return alasql('SELECT MAX(YEAR(Bokforingsdag)) AS Ar \
                       FROM ? \
                       WHERE Transaktionstyp = "UTDELNING"', [sourceData]);
    }

    function getDividendYears() {
        return alasql('SELECT FIRST(YEAR(Bokforingsdag)) AS Ar \
                       FROM ? \
                       WHERE Transaktionstyp = "UTDELNING" \
                       GROUP BY YEAR(Bokforingsdag) \
                       ORDER BY 1', [sourceData]);
    }

    function getBuyTransactionYears() {
        return alasql('SELECT FIRST(YEAR(Bokforingsdag)) AS Year \
                       FROM ? \
                       WHERE Transaktionstyp = "KOPT" \
                       GROUP BY YEAR(Bokforingsdag) \
                       ORDER BY 1', [sourceData]);
    }

    function getSellTransactionYears() {
        return alasql('SELECT FIRST(YEAR(Bokforingsdag)) AS Year \
                       FROM ? \
                       WHERE Transaktionstyp = "SÅLT" \
                       GROUP BY YEAR(Bokforingsdag) \
                       ORDER BY 1', [sourceData]);
    }

    function getDepositYears() {
        return alasql('SELECT FIRST(YEAR(Bokforingsdag)) AS Ar \
                       FROM ? \
                       WHERE (Transaktionstyp = "KORR PREMIEINB." OR Transaktionstyp = "UTTAG" OR Transaktionstyp = "INSATTNING" OR Transaktionstyp = "PREMIEINBETALNING") \
                       GROUP BY YEAR(Bokforingsdag) \
                       ORDER BY 1', [sourceData]);
    }

    function getDividendAll(addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT"';

        return alasql('SELECT FIRST(YEAR(Bokforingsdag)) AS Year, SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE (Transaktionstyp = "UTDELNING"' + taxSqlWhere +') \
                       GROUP BY YEAR(Bokforingsdag) \
                       ORDER BY 1', [sourceData]);
    }

    function getDividendMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' AND MONTH(Bokforingsdag) = ' + month + ' \
                       AND Transaktionstyp = "UTDELNING" \
                       GROUP BY YEAR(Bokforingsdag), MONTH(Bokforingsdag)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return Math.round(belopp["0"].Belopp);
    }

    function getTaxMonthSumBelopp(year, month) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' AND MONTH(Bokforingsdag) = ' + month + ' \
                       AND Transaktionstyp = "UTL KUPSKATT" \
                       GROUP BY YEAR(Bokforingsdag), MONTH(Bokforingsdag)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return Math.round(belopp["0"].Belopp);
    }

    function getDividendYearSumBelopp(year) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' \
                       AND Transaktionstyp = "UTDELNING" \
                       GROUP BY YEAR(Bokforingsdag)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getTaxYearSumBelopp(year) {
        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' \
                       AND Transaktionstyp = "UTL KUPSKATT" \
                       GROUP BY YEAR(Bokforingsdag)', [sourceData]);

        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;
    }

    function getDepositsYearSumBelopp(year) {

        var result = alasql('SELECT SUM(REPLACE(Belopp, " ", "")::NUMBER) AS Belopp \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' AND (Transaktionstyp = "KORR PREMIEINB." OR Transaktionstyp = "UTTAG" OR Transaktionstyp = "INSATTNING" OR Transaktionstyp = "PREMIEINBETALNING")', [sourceData]);
        
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
                       WHERE YEAR(Bokforingsdag) = ' + year + ' AND (Transaktionstyp = "UTDELNING"'  + taxSqlWhere + ") \
                       GROUP BY YEAR(Bokforingsdag)", [sourceData]);
                       
        var belopp = JSON.parse(JSON.stringify(result));
        if(belopp["0"].Belopp == null) return 0;

        return belopp["0"].Belopp;               
    }

    function getVardepapperTotalDividend(year, addTaxToSum) {
        var taxSqlWhere = '';
        if(addTaxToSum)
            taxSqlWhere = ' OR Transaktionstyp = "UTL KUPSKATT"';

        return alasql('SELECT FIRST(Vardepapper) AS [name], SUM(REPLACE(Belopp, " ", "")::NUMBER) AS [value] \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' AND (Transaktionstyp = "UTDELNING"' + taxSqlWhere + ') \
                       GROUP BY Vardepapper', [sourceData]);
    }

    function getBuyTransactionCount(year, month) {

        var result = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' AND MONTH(Bokforingsdag) = ' + month + ' \
                       AND Transaktionstyp = "KOPT"', [sourceData]);

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount);
    }

    function getSellTransactionCount(year, month) {

        var result = alasql('SELECT COUNT(*) AS TransactionCount \
                       FROM ? \
                       WHERE YEAR(Bokforingsdag) = ' + year + ' AND MONTH(Bokforingsdag) = ' + month + ' \
                       AND Transaktionstyp = "SÅLT"', [sourceData]);

        var count = JSON.parse(JSON.stringify(result));
        if(count["0"].TransactionCount == null) return 0;

        return parseInt(count["0"].TransactionCount);
    }

    function SumValues(result) {
        var total = 0;

        result.forEach(function(value) {
            if(typeof value !== "undefined" && typeof value.Belopp !== "undefined")
                total += parseInt(value.Belopp.replace(/ /g,''));
        });

        return total;
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
        getDividendAll: getDividendAll
    };
});