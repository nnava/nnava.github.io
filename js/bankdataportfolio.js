define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    function getStocksInPortfolio() {

        var nordnetData = alasqlnordnet.getStocksInPortfolio();
        var avanzaData = alasqlavanza.getStocksInPortfolio();

        alasql('CREATE TABLE IF NOT EXISTS PortfolioBankData (  \
                [Värdepapper] NVARCHAR(100), \
                Valuta NVARCHAR(5), \
                Bransch NVARCHAR(100), \
                YahooSymbol NVARCHAR(10), \
                Antal INT \
            );');

        alasql('INSERT INTO PortfolioBankData SELECT [Värdepapper], Valuta, Bransch, YahooSymbol, Antal \
                FROM ?', [nordnetData]);

        alasql('INSERT INTO PortfolioBankData SELECT [Värdepapper], Valuta, Bransch, YahooSymbol, Antal \
                FROM ?', [avanzaData]);

        var resultPortfolio = alasql('SELECT [Värdepapper], Valuta, Bransch, YahooSymbol, SUM(Antal::NUMBER) AS Antal FROM PortfolioBankData GROUP BY [Värdepapper], Valuta, Bransch, YahooSymbol ORDER BY [Värdepapper]');
        alasql('TRUNCATE TABLE PortfolioBankData');
        return resultPortfolio;       
    }

    return {
        getStocksInPortfolio: getStocksInPortfolio
    };
});