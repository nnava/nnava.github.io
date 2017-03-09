define([], function() {

    function createUserLocalizationTable() {
        alasql('CREATE TABLE IF NOT EXISTS UserLocalization (  \
                currency STRING); \
        ');
    }

    function insertUserLocalization(currency) {
        var resultCount = alasql('SELECT VALUE COUNT(*) FROM UserLocalization');
        if(resultCount == 0) {
            alasql('INSERT INTO UserLocalization VALUES ("' + currency + '");');
        }        
    }

    function getUserCurrency() {
        return alasql('SELECT VALUE currency FROM UserLocalization');
    }

    return { 
        createUserLocalizationTable: createUserLocalizationTable,
        insertUserLocalization: insertUserLocalization,
        getUserCurrency: getUserCurrency
    };
});