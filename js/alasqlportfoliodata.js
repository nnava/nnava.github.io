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

    function createPortfolioDistributionDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS PortfolioDistributionData (  \
            [ID] INT AUTO_INCREMENT, \
            [Värdepapper] STRING, \
            ISIN NVARCHAR(100), \
            Bransch STRING, \
            Antal INT, \
            SenastePris DECIMAL, \
            Valuta STRING, \
            [Marknadsvärde] DECIMAL,\
            [AktuellFördelning] DECIMAL, \
            [NyFördelning] DECIMAL, \
            [NyMarknadsvärde] DECIMAL, \
            [DiffAntal] NUMBER); \
            CREATE INDEX isinIndex ON PortfolioData(ISIN); \
        ');
    }

    function truncatePortfolioDistributionDataTable() {
        alasql('TRUNCATE TABLE PortfolioDistributionData');
    }

    function setAlasqlCustomFunctions() {
        alasql.fn.portfolioNewTradeCount = function(price, count, desiredWeight, totalPortfolioValue) { 
            var currentMarketValue = price * count;
            var currentValueInPercentage = (currentMarketValue/totalPortfolioValue)*100;
            var desiredValue = (totalPortfolioValue * (desiredWeight/100));
            var priceDesiredValueCount = (desiredValue/price);
            return Math.round(priceDesiredValueCount - count);
        }

        alasql.fn.portfolioMarketValue = function(price, count, currentMarketValue) { 
            return (parseFloat(currentMarketValue) + parseFloat(price) * parseInt(count));
        }

        alasql.fn.portfolioWeightPercentage = function(price, count, diffCount, totalPortfolioValue) { 
            count = count + diffCount;
            var marketValue = price * count;
            return ((marketValue/totalPortfolioValue)*100).toFixed(2);
        }
    }

    function saveDistributionDataToTable() {
        setAlasqlCustomFunctions();
        createPortfolioDistributionDataTable();
        truncatePortfolioDistributionDataTable();

        var portfolioData = getPortfolioData();
        var portfolioSumValue = getPortfolioDistributionSumMarknadsvärde();
        var standardWeight = (100/portfolioData.length);

        alasql('INSERT INTO PortfolioDistributionData SELECT [Värdepapper], ISIN, Bransch, Antal, SenastePris, Valuta, [Marknadsvärde], \
                portfolioWeightPercentage(SenastePris, Antal, 0, ' + portfolioSumValue + ') AS [AktuellFördelning], \
                portfolioWeightPercentage(SenastePris, Antal, portfolioNewTradeCount(SenastePris, Antal, ' + standardWeight + ',' + portfolioSumValue + '), ' + portfolioSumValue + ') AS [NyFördelning], \
                portfolioMarketValue(SenastePris, portfolioNewTradeCount(SenastePris, Antal, ' + standardWeight + ',' + portfolioSumValue + '), [Marknadsvärde]) AS [NyMarknadsvärde], \
                portfolioNewTradeCount(SenastePris, Antal, ' + standardWeight + ',' + portfolioSumValue + ') AS DiffAntal FROM ?', [portfolioData]);
    }

    function saveDataToTable(data) {
        createPortfolioDataTable();
        alasql('TRUNCATE TABLE PortfolioData');
        alasql('INSERT INTO PortfolioData SELECT [Värdepapper], ISIN, Bransch, Antal, SenastePris, Valuta, [Marknadsvärde] FROM ?', [data]);
    }

    function updatePortfolioDistributionRow(ID, newWeightPercentage) {
        alasql('UPDATE PortfolioDistributionData SET [NyFördelning] = ? WHERE ID = ?', [newWeightPercentage, ID]);
    }

    function getPortfolioDistributionData() {
        return alasql('SELECT [ID], [Värdepapper], ISIN, Antal, SenastePris, [Marknadsvärde], [AktuellFördelning], \
                       [NyFördelning], [NyMarknadsvärde], DiffAntal FROM PortfolioDistributionData');
    }

    function getPortfolioDistributionDataNewWeight() {
        var portfolioSumValue = getPortfolioDistributionSumMarknadsvärde();

        return alasql('SELECT [ID], [Värdepapper], ISIN, Antal, SenastePris, [Marknadsvärde], [AktuellFördelning], \
                      [NyFördelning], portfolioMarketValue(SenastePris, portfolioNewTradeCount(SenastePris, Antal, [NyFördelning],' + portfolioSumValue + '), [Marknadsvärde]) AS [NyMarknadsvärde], \
                      portfolioNewTradeCount(SenastePris, Antal, [NyFördelning],' + portfolioSumValue + ') AS DiffAntal FROM PortfolioDistributionData');
    }

    function getPortfolioDistributionSumMarknadsvärde() {
        return alasql('SELECT VALUE SUM([Marknadsvärde]::NUMBER) FROM PortfolioData');
    }

    function getPortfolioAllocation(sort) {
        var sortExpression = " ORDER BY UPPER([Värdepapper])";
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
        return alasql('SELECT [Värdepapper] AS [name], SUM([Marknadsvärde]::NUMBER) AS [value] FROM PortfolioData WHERE Valuta = "' + currency + '" GROUP BY [Värdepapper] ORDER BY UPPER([Värdepapper])')
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
        getPortfolioCurrencyStocks: getPortfolioCurrencyStocks,
        saveDistributionDataToTable: saveDistributionDataToTable,
        getPortfolioDistributionData: getPortfolioDistributionData,
        getPortfolioDistributionSumMarknadsvärde: getPortfolioDistributionSumMarknadsvärde,
        updatePortfolioDistributionRow: updatePortfolioDistributionRow,
        getPortfolioDistributionDataNewWeight: getPortfolioDistributionDataNewWeight
    };
});