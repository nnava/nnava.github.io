define([], function() {

    function createStockDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS StockData (  \
                namn STRING, \
                kortnamn STRING,\
                yahoosymbol STRING, \
                azalink STRING, \
                isin STRING,\
                marknad STRING,\
                bransch STRING,\
                handlas STRING,\
                land STRING); \
                \
                CREATE INDEX isinIndex ON StockData(isin); \
                CREATE INDEX namnIndex ON StockData(namn); \
        ');
    }

    function loadDataFromFileToTable() {
        alasql('TRUNCATE TABLE StockData');
        alasql("SELECT * FROM JSON('stockdata.json')",[],function(jsonResult){
            alasql('INSERT INTO StockData SELECT N AS namn, K AS kortnamn, Y AS yahoosymbol, LI AS azalink, I AS isin, M AS marknad, CA AS bransch, CU AS handlas, LA = land FROM ?', [jsonResult]);
        });
    };

    function getVärdepapperNamnFromYahooSymbol(yahoosymbol) {
        return alasql('SELECT VALUE namn FROM StockData WHERE yahoosymbol ="' + yahoosymbol + '"');
    }

    function getAzaLinkFromYahooSymbol(yahoosymbol) {
        return alasql('SELECT VALUE azalink FROM StockData WHERE yahoosymbol ="' + yahoosymbol + '"');
    }

    function getLandFromISIN(isin) {
        return alasql('SELECT VALUE land FROM StockData WHERE isin ="' + isin + '"');
    }

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

    function getSymbol(isin) {
        return alasql('SELECT VALUE DISTINCT kortnamn FROM StockData WHERE isin ="' + isin + '"');
    }

    return { 
        createStockDataTable: createStockDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getVärdepapperNamn: getVärdepapperNamn,
        getVärdepapperNamnFromYahooSymbol: getVärdepapperNamnFromYahooSymbol,
        getVärdepapperHandlas: getVärdepapperHandlas,
        getYahooSymbol: getYahooSymbol,
        getISINFromNamn: getISINFromNamn,
        getLandFromISIN: getLandFromISIN,
        getAzaLinkFromYahooSymbol: getAzaLinkFromYahooSymbol,
        getSymbol: getSymbol
    };
});