define([], function() {

    var avanzaBaseUrl = 'https://www.avanza.se';
    var nordnetBaseUrl = 'https://www.nordnet.se/mux/web/handla';
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
        var baseUrl = banktype === bankTypeAvanza ? avanzaBaseUrl : nordnetBaseUrl;
        if(isClickSell) {
            if(banktype === bankTypeAvanza)
                link = link.replace("/kop/", "/salj/");
            else
                link = link.replace("/kopAktier", "/saljAktier");
        }
        return baseUrl + link; 
    }

    return { 
        createStockMarketLinkDataTable: createStockMarketLinkDataTable,
        loadDataFromFileToTable: loadDataFromFileToTable,
        getBankUrlFromIsin: getBankUrlFromIsin
    };
});