define([], function() {

    function createPortfolioDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS PortfolioData (  \
                [Värdepapper] STRING, \
                ISIN NVARCHAR(100), \
                Bransch STRING, \
                Antal INT, \
                SenastePris DECIMAL, \
                Valuta STRING, \
                [Marknadsvärde] DECIMAL); \
                CREATE INDEX isinIndex ON PortfolioData(ISIN); \
        ');
    }

    function saveDataToTable(data) {
        createPortfolioDataTable();
        alasql('TRUNCATE TABLE PortfolioData');
        alasql('INSERT INTO PortfolioData SELECT [Värdepapper], ISIN, Bransch, Antal, SenastePris, Valuta, [Marknadsvärde] FROM ?', [data]);
    }

    function getPortfolioAllocation(sort) {
        var sortExpression = " ORDER BY [Värdepapper]";
        if(sort == "size")
            sortExpression = " ORDER BY CAST([Marknadsvärde] AS NUMBER) DESC";

        return alasql('SELECT [Värdepapper] AS [name], [Marknadsvärde] AS [value], Antal, SenastePris FROM PortfolioData' + sortExpression)
    }

    function getPortfolioData() {
        return alasql('SELECT [Värdepapper], ISIN, Bransch, Antal, SenastePris, Valuta, [Marknadsvärde] FROM PortfolioData');
    }

    function getPortfolioCurrency() {
        return alasql('SELECT Valuta AS [name], SUM([Marknadsvärde]::NUMBER) AS [value] FROM PortfolioData GROUP BY Valuta ORDER BY Valuta')
    }

    function getPortfolioCurrencyStocks(currency) {
        return alasql('SELECT [Värdepapper] AS [name], SUM([Marknadsvärde]::NUMBER) AS [value] FROM PortfolioData WHERE Valuta = "' + currency + '" GROUP BY [Värdepapper] ORDER BY [Värdepapper]')
    }

    function getPortfolioIndustry() {
        return alasql('SELECT [Bransch] AS [name], SUM([Marknadsvärde]::NUMBER) AS [value] FROM PortfolioData GROUP BY [Bransch] ORDER BY SUM([Marknadsvärde]::NUMBER)')
    }

    function getPortfolioIndustrySort(sort) {
        var sortExpression = " ORDER BY [Bransch] DESC";
        if(sort == "size")
            sortExpression = " ORDER BY SUM([Marknadsvärde]::NUMBER) DESC";
            
        return alasql('SELECT [Bransch] AS [name], SUM([Marknadsvärde]::NUMBER) AS [value] FROM PortfolioData GROUP BY [Bransch]' + sortExpression);
    }

    return { 
        createPortfolioDataTable: createPortfolioDataTable,
        saveDataToTable: saveDataToTable,
        getPortfolioData: getPortfolioData,
        getPortfolioAllocation: getPortfolioAllocation,
        getPortfolioCurrency: getPortfolioCurrency,
        getPortfolioIndustry: getPortfolioIndustry,
        getPortfolioIndustrySort: getPortfolioIndustrySort,
        getPortfolioCurrencyStocks: getPortfolioCurrencyStocks
    };
});