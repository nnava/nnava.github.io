define([], function() {

    function createPortfolioDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS PortfolioData (  \
                [Värdepapper] STRING, \
                Bransch STRING,\
                Antal INT, \
                SenastePris DECIMAL, \
                Valuta STRING,\
                [Marknadsvärde] DECIMAL); \
        ');
    }

    function saveDataToTable(data) {
        createPortfolioDataTable();
        alasql('TRUNCATE TABLE PortfolioData');
        alasql('INSERT INTO PortfolioData SELECT [Värdepapper], Bransch, Antal, SenastePris, Valuta, [Marknadsvärde] FROM ?', [data]);
    }

    function getPortfolioAllocation() {
        return alasql('SELECT [Värdepapper] AS [name], [Marknadsvärde] AS [value] FROM PortfolioData ORDER BY [Värdepapper]')
    }

    function getPortfolioCurrency() {
        return alasql('SELECT [Valuta] AS [name], SUM([Marknadsvärde]) AS [value] FROM PortfolioData GROUP BY [Valuta] ORDER BY [Valuta]')
    }  

    return { 
        createPortfolioDataTable: createPortfolioDataTable,
        saveDataToTable: saveDataToTable,
        getPortfolioAllocation: getPortfolioAllocation,
        getPortfolioCurrency: getPortfolioCurrency
    };
});