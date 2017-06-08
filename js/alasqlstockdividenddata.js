define([], function() {

    function createStockDividendDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS StockDividendData (  \
                ISIN NVARCHAR(100), \
                handlas STRING,\
                typ STRING, \
                utdelningaktiedecimal DECIMAL,\
                utd_handlasutanutdelning DATE, \
                utd_deklarerad STRING); \
                \
                CREATE INDEX isinIndex ON StockDividendData(ISIN); \
        ');
    }

    function loadDataFromFileToTable() {
        var resultCount = alasql('SELECT VALUE COUNT(*) FROM StockDividendData');
        if(resultCount == 0) {
            alasql("SELECT * FROM JSON('stockdividenddata.json')",[],function(jsonResult){
                alasql('INSERT INTO StockDividendData SELECT isin AS ISIN, cur AS handlas, typ, utddec AS utdelningaktiedecimal, utddat AS utd_handlasutanutdelning, utddek AS utd_deklarerad FROM ?', [jsonResult]);
            });
        }
    };

    function getUpcomingDividendsForYear(year, today, isin) {
        return alasql('SELECT typ, utdelningaktiedecimal, MONTH(utd_handlasutanutdelning) AS [Månad], utd_handlasutanutdelning, utd_deklarerad \
                       FROM StockDividendData \
                       WHERE YEAR(utd_handlasutanutdelning) = ' + year + ' AND utd_handlasutanutdelning >= "' + today + '" \
                       AND ISIN = "' + isin + '"');
    }

    function getDividendTyp(utd_handlasutanutdelning, isin) {
        return alasql('SELECT VALUE typ \
                       FROM StockDividendData \
                       WHERE utd_handlasutanutdelning = "' + utd_handlasutanutdelning + '" \
                       AND ISIN = "' + isin + '"');
    }

    return { 
        createStockDividendDataTable: createStockDividendDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getUpcomingDividendsForYear: getUpcomingDividendsForYear,
        getDividendTyp: getDividendTyp
    };
});