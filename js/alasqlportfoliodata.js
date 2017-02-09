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
    };

    return { 
        createPortfolioDataTable: createPortfolioDataTable,
        saveDataToTable: saveDataToTable
    };
});