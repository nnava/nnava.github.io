define([], function() {

    function createStockDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS StockData (  \
                namn STRING, \
                kortnamn STRING,\
                yahoosymbol STRING, \
                isin STRING,\
                marknad STRING,\
                bransch STRING,\
                handlas STRING); \
                \
                CREATE INDEX isinIndex ON StockData(isin); \
                CREATE INDEX namnIndex ON StockData(namn); \
        ');
    }

    function loadDataFromFileToTable() {
        alasql('TRUNCATE TABLE StockData');
        alasql("SELECT * FROM JSON('stockdata.json')",[],function(jsonResult){
            alasql('INSERT INTO StockData SELECT namn, kortnamn, yahoosymbol, isin, marknad, bransch, handlas FROM ?', [jsonResult]);
        });
    };

    function getISINFromNamn(namn) {
        return alasql('SELECT VALUE isin FROM StockData WHERE namn ="' + namn + '"');
    }

    function getVärdepapperNamn(isin) {
        return alasql('SELECT namn FROM StockData WHERE isin ="' + isin + '"');
    }

    function getVärdepapperHandlas(isin) {
        return alasql('SELECT VALUE DISTINCT handlas FROM StockData WHERE isin ="' + isin + '"');
    }

    function getYahooSymbol(isin) {
        return alasql('SELECT VALUE DISTINCT yahoosymbol FROM StockData WHERE isin ="' + isin + '"');
    }

    return { 
        createStockDataTable: createStockDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getVärdepapperNamn: getVärdepapperNamn,
        getVärdepapperHandlas: getVärdepapperHandlas,
        getYahooSymbol: getYahooSymbol,
        getISINFromNamn: getISINFromNamn
    };
});