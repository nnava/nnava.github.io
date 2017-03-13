define([], function() {

    function createPortfolioTable() {
        alasql('CREATE TABLE IF NOT EXISTS Portfolio (  \
                Konto STRING); \
        ');
    }

    function insertPortfolioData(konto) {
        alasql('INSERT INTO Portfolio VALUES ("' + konto + '");');            
    }

    function getPortfolios() {
        return alasql('SELECT Konto FROM Portfolio');
    }

    return { 
        createPortfolioTable: createPortfolioTable,
        insertPortfolioData: insertPortfolioData,
        getPortfolios: getPortfolios
    };
});