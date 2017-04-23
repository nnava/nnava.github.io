define([], function() {

    var avanzaBaseUrl = 'https://www.avanza.se';
    var bankTypeAvanza = "AZA";

    function createStockMarketLinkDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS StockMarketLinkData (  \
                ISIN NVARCHAR(100), \
                Link STRING,\
                BankTyp STRING); \
                \
                CREATE INDEX isinIndex ON StockMarketLinkData(ISIN); \
        ');
    }

    function loadDataFromFileToTable() {
        var resultCount = alasql('SELECT VALUE COUNT(*) FROM StockMarketLinkData');
        if(resultCount == 0) {
            alasql("SELECT * FROM JSON('stockmarketlinkdata.json')",[],function(jsonResult) {
                alasql('INSERT INTO StockMarketLinkData SELECT isin AS ISIN, link AS Link, btype AS BankTyp FROM ?', [jsonResult]);
            });
        }
    };

    function getBankUrlFromIsin(isin, banktype, isClickSell) {
        var link = alasql('SELECT VALUE Link FROM StockMarketLinkData WHERE ISIN = "' + isin + '" AND BankTyp = "' + banktype + '"');
        if(banktype == bankTypeAvanza) {
            if(isClickSell)
                link = link.replace("/kop/", "/salj/");
            return avanzaBaseUrl + link;
        }
            
    }

    return { 
        createStockMarketLinkDataTable: createStockMarketLinkDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getBankUrlFromIsin: getBankUrlFromIsin
    };
});