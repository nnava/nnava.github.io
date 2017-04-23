define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    function getStocksInPortfolio() {
        var nordnetData = alasqlnordnet.getStocksInPortfolio();
        var avanzaData = alasqlavanza.getStocksInPortfolio();
        var result = avanzaData.concat(nordnetData);

        return alasql('SELECT [Värdepapper], Valuta, Bransch, YahooSymbol, SUM(Antal::NUMBER) AS Antal FROM ? GROUP BY [Värdepapper], Valuta, Bransch, YahooSymbol ORDER BY UPPER([Värdepapper])', [result]);    
    }

    return {
        getStocksInPortfolio: getStocksInPortfolio
    };
});