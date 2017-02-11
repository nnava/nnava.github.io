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

    return { 
        createPortfolioDataTable: createPortfolioDataTable,
        saveDataToTable: saveDataToTable,
        getPortfolioAllocation: getPortfolioAllocation
    };
});