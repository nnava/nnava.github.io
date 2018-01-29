define([], function() {

    function createPortfolioDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS PortfolioData (  \
                [Värdepapper] STRING, \
                ISIN NVARCHAR(100), \
                Bransch STRING, \
                Antal INT, \
                SenastePris DECIMAL, \
                Valuta STRING, \
                [AvanzaAntalÄgare] INT, \
                [Marknadsvärde] DECIMAL); \
                CREATE INDEX isinIndex ON PortfolioData(ISIN); \
        ');
    }

    function createPortfolioDistributionDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS PortfolioDistributionData (  \
            [ID] INT AUTO_INCREMENT, \
            [Värdepapper] STRING, \
            ISIN NVARCHAR(100), \
            Symbol NVARCHAR(100), \
            Bransch STRING, \
            Antal INT, \
            SenastePris DECIMAL, \
            Valuta STRING, \
            [Marknadsvärde] DECIMAL,\
            [AktuellFördelning] DECIMAL, \
            [NyFördelning] DECIMAL, \
            [NyMarknadsvärde] DECIMAL, \
            [DiffAntal] NUMBER); \
            CREATE INDEX isinIndex ON PortfolioDistributionData(ISIN); \
        ');
    }

    function createPortfolioLastPriceDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS PortfolioLastPriceData ( \
            Symbol STRING, \
            SenastePris NUMBER);');
    }

    function truncatePortfolioDistributionDataTable() {
        alasql('TRUNCATE TABLE PortfolioDistributionData');
    }

    function truncatePortfolioLastPriceDataTable() {
        alasql('TRUNCATE TABLE PortfolioLastPriceData');
    }

    function insertPortfolioLastPriceRow(symbol, senastepris) {
        alasql('INSERT INTO PortfolioLastPriceData VALUES ("' + symbol + '", ' + senastepris + ');');
    }

    function saveDistributionDataToTable(portfolioData, portfolioSumValue) {
        createPortfolioDistributionDataTable();
        truncatePortfolioDistributionDataTable();

        var standardWeight = (100/portfolioData.length);

        alasql('INSERT INTO PortfolioDistributionData SELECT [Värdepapper], ISIN, Symbol, Bransch, Antal, SenastePris, Valuta, [Marknadsvärde], \
                portfolioWeightPercentage(SenastePris, Antal, 0, ' + portfolioSumValue + ') AS [AktuellFördelning], \
                portfolioWeightPercentage(SenastePris, Antal, portfolioNewTradeCount(SenastePris, Antal, ' + standardWeight + ',' + portfolioSumValue + '), ' + portfolioSumValue + ') AS [NyFördelning], \
                portfolioMarketValue(SenastePris, portfolioNewTradeCount(SenastePris, Antal, ' + standardWeight + ',' + portfolioSumValue + '), [Marknadsvärde]) AS [NyMarknadsvärde], \
                portfolioNewTradeCount(SenastePris, Antal, ' + standardWeight + ',' + portfolioSumValue + ') AS DiffAntal FROM ?', [portfolioData]);
    }

    function saveDataToTable(data) {
        createPortfolioDataTable();
        alasql('TRUNCATE TABLE PortfolioData');
        alasql('INSERT INTO PortfolioData SELECT [Värdepapper], ISIN, Bransch, Antal, SenastePris, Valuta, [AvanzaAntalÄgare], [Marknadsvärde] FROM ?', [data]);
    }

    function updatePortfolioDistributionNewWeightPercentageRow(ID, newWeightPercentage) {
        alasql('UPDATE PortfolioDistributionData SET [NyFördelning] = ? WHERE ID = ?', [newWeightPercentage, ID]);
    }
    
    function updatePortfolioDistributionNewLatestPriceRow(ID, latestPrice) {
        alasql('UPDATE PortfolioDistributionData SET SenastePris = ? WHERE ID = ?', [latestPrice, ID]);
    }

    function updatePortfolioDistributionCalculatedValuesWithNewLatestPriceRow(ID, latestPrice) {
        var portfolioSumValue = getPortfolioDistributionSumMarknadsvärde();
        var count = alasql('SELECT VALUE Antal FROM PortfolioDistributionData WHERE ID = ?', [ID])
        var newMarketValue = (latestPrice * count);
        alasql('UPDATE PortfolioDistributionData SET [Marknadsvärde] = ? WHERE ID = ?', [newMarketValue, ID]);
    }

    function updatePortfolioLastPriceRow(latestPrice, symbol) {
        alasql('UPDATE PortfolioLastPriceData SET SenastePris = ? WHERE Symbol = ?', [latestPrice, symbol]);
    }

    function getPortfolioLastPriceDataMissingPrice() {
        return alasql('SELECT Symbol FROM PortfolioLastPriceData WHERE SenastePris == 0');
    }

    function getPortfolioLastPriceValueBySymbol(symbol) {
        return alasql('SELECT VALUE SenastePris FROM PortfolioLastPriceData WHERE Symbol = ?', symbol);
    }

    function getPortfolioDistributionData() {
        return alasql('SELECT [ID], [Värdepapper], ISIN, Symbol, Antal, SenastePris, [Marknadsvärde], [AktuellFördelning], \
                       [NyFördelning], [NyMarknadsvärde], DiffAntal FROM PortfolioDistributionData');
    }

    function getPortfolioDistributionDataNewWeight() {
        var portfolioSumValue = getPortfolioDistributionSumMarknadsvärde();

        return alasql('SELECT [ID], [Värdepapper], ISIN, Symbol, Antal, SenastePris, [Marknadsvärde], portfolioWeightPercentage(SenastePris, Antal, 0, ' + portfolioSumValue + ') AS [AktuellFördelning], \
                      [NyFördelning], portfolioMarketValue(SenastePris, portfolioNewTradeCount(SenastePris, Antal, [NyFördelning],' + portfolioSumValue + '), [Marknadsvärde]) AS [NyMarknadsvärde], \
                      portfolioNewTradeCount(SenastePris, Antal, [NyFördelning],' + portfolioSumValue + ') AS DiffAntal FROM PortfolioDistributionData');
    }

    function getPortfolioDistributionSumMarknadsvärde() {
        return alasql('SELECT VALUE SUM([Marknadsvärde]::NUMBER) FROM PortfolioDistributionData');
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

    function getPortfolioValueAZAOwnerCount() {
        var result = alasql('SELECT [AvanzaAntalÄgare], [Marknadsvärde] AS [value] FROM PortfolioData');
        var returnData = [];
        result.forEach(function(entry) {
            if(entry == null) return;
            if(entry.AvanzaAntalÄgare == null) return;

            returnData.push({ 
                "category": getAZAOwnerCountCategory(entry.AvanzaAntalÄgare),
                "value": parseInt(entry.value)
            });
        });

        return returnData;
    }

    function getAZAOwnerCountCategory(avanzaAntalÄgare) {
        if(avanzaAntalÄgare == 0)
            return "N/A";
        else if(avanzaAntalÄgare > 10000)
            return "> 10 000";
        else if(avanzaAntalÄgare < 10000 && avanzaAntalÄgare > 1000)
            return "1 000 - 10 000";
        else if(avanzaAntalÄgare < 1000 && avanzaAntalÄgare > 100)
            return "100 - 1 000";
        else if(avanzaAntalÄgare < 100 && avanzaAntalÄgare > 10)
            return "10 - 100";
        else
            return "< 10";
    }

    return { 
        createPortfolioDataTable: createPortfolioDataTable,
        createPortfolioLastPriceDataTable: createPortfolioLastPriceDataTable,
        insertPortfolioLastPriceRow: insertPortfolioLastPriceRow,
        truncatePortfolioLastPriceDataTable: truncatePortfolioLastPriceDataTable,
        saveDataToTable: saveDataToTable,
        getPortfolioData: getPortfolioData,
        getPortfolioAllocation: getPortfolioAllocation,
        getPortfolioCurrency: getPortfolioCurrency,
        getPortfolioIndustry: getPortfolioIndustry,
        getPortfolioIndustrySort: getPortfolioIndustrySort,
        getPortfolioCurrencyStocks: getPortfolioCurrencyStocks,
        getPortfolioLastPriceDataMissingPrice: getPortfolioLastPriceDataMissingPrice,
        saveDistributionDataToTable: saveDistributionDataToTable,
        getPortfolioDistributionData: getPortfolioDistributionData,
        getPortfolioLastPriceValueBySymbol: getPortfolioLastPriceValueBySymbol,
        updatePortfolioDistributionNewWeightPercentageRow: updatePortfolioDistributionNewWeightPercentageRow,
        updatePortfolioDistributionNewLatestPriceRow: updatePortfolioDistributionNewLatestPriceRow,
        updatePortfolioDistributionCalculatedValuesWithNewLatestPriceRow: updatePortfolioDistributionCalculatedValuesWithNewLatestPriceRow,
        updatePortfolioLastPriceRow: updatePortfolioLastPriceRow,
        getPortfolioDistributionDataNewWeight: getPortfolioDistributionDataNewWeight,
        getPortfolioValueAZAOwnerCount: getPortfolioValueAZAOwnerCount 
    };
});