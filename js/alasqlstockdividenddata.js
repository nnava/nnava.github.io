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
        return alasql('SELECT typ, utdelningaktiedecimal, MONTH(handlasutanutdelning) AS [Månad], handlasutanutdelning \
                       FROM StockDividendData \
                       WHERE YEAR(handlasutanutdelning) = ' + year + ' AND handlasutanutdelning >= "' + today + '" \
                       AND ISIN = "' + isin + '"');
    }

    function getDividendTyp(handlasutanutdelning, isin) {
        return alasql('SELECT VALUE typ \
                       FROM StockDividendData \
                       WHERE handlasutanutdelning = "' + handlasutanutdelning + '" \
                       AND ISIN = "' + isin + '"');
    }

    return { 
        createStockDividendDataTable: createStockDividendDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getUpcomingDividendsForYear: getUpcomingDividendsForYear,
        getDividendTyp: getDividendTyp
    };
});