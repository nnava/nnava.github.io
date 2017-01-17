define([], function() {

    function createStockDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS StockData (  \
                namn STRING, \
                kortnamn STRING,\
                isin STRING,\
                marknad STRING,\
                bransch STRING,\
                handlas STRING); \
        ');
    }

    function loadDataFromFileToTable() {
        alasql('TRUNCATE TABLE StockData');
        alasql("SELECT * FROM JSON('stockdata.json')",[],function(jsonResult){
            alasql('INSERT INTO StockData SELECT namn, kortnamn, isin, marknad, bransch, handlas FROM ?', [jsonResult]);
        });
    };

    function getVärdepapperNamn(isin) {
        return alasql('SELECT namn FROM StockData WHERE isin ="' + isin + '"');
    }

    return { 
        createStockDataTable: createStockDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getVärdepapperNamn: getVärdepapperNamn
    };
});