define(['./alasqlavanza', './alasqlnordnet', './alasqlstockdata'], function(alasqlavanza, alasqlnordnet, alasqlstockdata) {

    function getVärdepapperTotalDividend(year, sort, addTaxToSum) {

        var resultNordnetDividend = alasqlnordnet.getVardepapperTotalDividend(year, addTaxToSum);
        var resultAvanzaDividend = alasqlavanza.getVardepapperTotalDividend(year, addTaxToSum);

        alasql('CREATE TABLE IF NOT EXISTS VardepapperTotalDividend \
                (name STRING, [value] NUMBER);');

        alasql('INSERT INTO VardepapperTotalDividend SELECT name, [value] \
                FROM ?', [resultNordnetDividend]);

        alasql('INSERT INTO VardepapperTotalDividend SELECT name, [value] \
                FROM ?', [resultAvanzaDividend]);

        var sortExpression = " ORDER BY name";
        if(sort == "size")
            sortExpression = " ORDER BY SUM([value]) DESC";

        var result = alasql('SELECT FIRST(name) AS name, SUM([value]) AS [value] FROM VardepapperTotalDividend GROUP BY name' + sortExpression);
        alasql('TRUNCATE TABLE VardepapperTotalDividend');

        return result;
    }

    function getVärdepapperForYear(year) {

        alasqlavanza.getBuyTransactionSumBelopp(year);
        alasqlavanza.getSellTransactionSumBelopp(year);
        
        var avanzaData = alasqlavanza.getVärdepapperForYear(year);
        var nordnetData = alasqlnordnet.getVärdepapperForYear(year);

        alasql('CREATE TABLE IF NOT EXISTS DivStackedCumulativeVardepapper \
                (Vardepapper NVARCHAR(100), ISIN NVARCHAR(100));');

        alasql('INSERT INTO DivStackedCumulativeVardepapper SELECT Vardepapper, ISIN \
                FROM ?', [avanzaData]);
                
        alasql('INSERT INTO DivStackedCumulativeVardepapper SELECT Vardepapper, ISIN \
                FROM ?', [nordnetData]);

        var resultVärdepapper = alasql('SELECT FIRST(Vardepapper) AS Vardepapper, FIRST(ISIN) AS ISIN FROM DivStackedCumulativeVardepapper GROUP BY ISIN ORDER BY Vardepapper');
        alasql('TRUNCATE TABLE DivStackedCumulativeVardepapper');

        return resultVärdepapper;
    }
    
    function getVärdepapperDividendData(year, resultVärdepapper, isTaxChecked) {
        var värdepapperDividendDataValues = [];
        resultVärdepapper.forEach(function(entry) {
            if (entry.Vardepapper == null) { return; }
            var värdepapper = entry.Vardepapper;
            var isin = entry.ISIN;

            var monthNumber = 11;
            var monthDividendDataValues = [];
            for(var i=0; i <= monthNumber; i++)
            {
                var month = i + 1;

                var resultAvanza = alasqlavanza.getVärdepapperDividend(year, month, isin, isTaxChecked);
                var resultNordnet = alasqlnordnet.getVärdepapperDividend(year, month, isin, isTaxChecked);

                var nordnetBelopp = resultNordnet[0].value;
                if(isNaN(nordnetBelopp))
                    nordnetBelopp = 0;

                var avanzaBelopp = 0;
                if(resultAvanza.length != 0)
                    avanzaBelopp = resultAvanza[0].value;

                if(isNaN(avanzaBelopp))
                    avanzaBelopp = 0;

                var totalBelopp = nordnetBelopp + avanzaBelopp;

                monthDividendDataValues.push(totalBelopp);
            }

            var värdepapperNamnStockData = alasqlstockdata.getVärdepapperNamn(isin);
            if(värdepapperNamnStockData.length != 0)
                värdepapper = värdepapperNamnStockData[0].namn;

            värdepapperDividendDataValues.push({
                name: värdepapper,
                data: monthDividendDataValues
            });

        });

        return värdepapperDividendDataValues;
    }

    return { 
        getVärdepapperTotalDividend: getVärdepapperTotalDividend,
        getVärdepapperForYear: getVärdepapperForYear,
        getVärdepapperDividendData: getVärdepapperDividendData
    };
});