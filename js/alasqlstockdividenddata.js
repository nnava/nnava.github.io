define([], function() {

    function createStockDividendDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS StockDividendData (  \
                ISIN NVARCHAR(100), \
                handlas STRING,\
                typ STRING, \
                [utdelningaktiesträng] STRING,\
                utdelningaktiedecimal DECIMAL,\
                handlasutanutdelning DATE,\
                utdelningsdag DATE); \
                \
                CREATE INDEX isinIndex ON StockDividendData(ISIN); \
        ');
    }

    function loadDataFromFileToTable() {
        var resultCount = alasql('SELECT VALUE COUNT(*) FROM StockDividendData');
        if(resultCount == 0) {
            alasql("SELECT * FROM JSON('stockdividenddata.json')",[],function(jsonResult){
                alasql('INSERT INTO StockDividendData SELECT isin AS ISIN, handlas, typ, [utdelningaktiesträng], utdelningaktiedecimal, handlasutanutdelning, utdelningsdag FROM ?', [jsonResult]);
            });
        }
    };

    function getUpcomingDividendsForYear(year, today, isin) {
        return alasql('SELECT typ, utdelningaktiedecimal, MONTH(utdelningsdag) AS [Månad], utdelningsdag \
                       FROM StockDividendData \
                       WHERE YEAR(utdelningsdag) = ' + year + ' AND utdelningsdag >= "' + today + '" \
                       AND ISIN = "' + isin + '"');
    }

    function getDividendTyp(utdelningsdag, isin) {
        return alasql('SELECT VALUE typ \
                       FROM StockDividendData \
                       WHERE utdelningsdag = "' + utdelningsdag + '" \
                       AND ISIN = "' + isin + '"');
    }

    return { 
        createStockDividendDataTable: createStockDividendDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getUpcomingDividendsForYear: getUpcomingDividendsForYear,
        getDividendTyp: getDividendTyp
    };
});