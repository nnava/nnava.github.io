define([], function() {

    function createStockDividendDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS StockDividendData (  \
                ISIN NVARCHAR(100), \
                handlas STRING,\
                typ STRING, \
                utdelningaktiedecimal DECIMAL,\
                utd_handlasutanutdelning DATE, \
                utd_deklarerad STRING, \
                utv DECIMAL); \
                \
                CREATE INDEX isinIndex ON StockDividendData(ISIN); \
        ');
    }

    function loadDataFromFileToTable() {
        var resultCount = alasql('SELECT VALUE COUNT(*) FROM StockDividendData');
        if(resultCount == 0) {
            alasql("SELECT * FROM JSON('stockdividenddata.json')",[],function(jsonResult){
                alasql('INSERT INTO StockDividendData SELECT I AS ISIN, C AS handlas, T as typ, U1 AS utdelningaktiedecimal, U2 AS utd_handlasutanutdelning, U3 AS utd_deklarerad, U4 AS utv FROM ?', [jsonResult]);
            });
        }
    };

    function getUpcomingDividendsForYear(year, today, isin) {
        return alasql('SELECT typ, utdelningaktiedecimal, MONTH(utd_handlasutanutdelning) AS [Månad], utd_handlasutanutdelning, utd_deklarerad, utv \
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

    function getUtv(utd_handlasutanutdelning, year, isin) {
        var utv = alasql('SELECT VALUE utv \
                       FROM StockDividendData \
                       WHERE MONTH(utd_handlasutanutdelning) = ' + utd_handlasutanutdelning + ' AND YEAR(utd_handlasutanutdelning) = ' + year + ' \
                       AND ISIN = "' + isin + '"');

        if(utv == 0 || utv == null)
            return 0;

        return parseFloat(utv.replace(',', '.')).toFixed(2);
    }

    function getDividendSumForYear(isin, year) {
        return alasql('SELECT VALUE SUM(utdelningaktiedecimal::NUMBER) \
                       FROM StockDividendData \
                       WHERE YEAR(utd_handlasutanutdelning) = ' + year + ' \
                       AND ISIN = "' + isin + '"');
    }

    return { 
        createStockDividendDataTable: createStockDividendDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getUpcomingDividendsForYear: getUpcomingDividendsForYear,
        getDividendTyp: getDividendTyp,
        getDividendSumForYear: getDividendSumForYear,
        getUtv: getUtv
    };
});