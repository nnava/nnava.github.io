define([], function() {

    function createCurrencyDataTable() {
        alasql('CREATE TABLE IF NOT EXISTS CurrencyData (  \
                Currency NVARCHAR(10), \
                ExchangeRate NUMBER);');
    }

    function getCurrencyExchangeRateValue(currency) {
        return alasql('SELECT VALUE ExchangeRate \
                       FROM CurrencyData \
                       WHERE Currency = "' + currency + '"');
    }

    return { 
        createCurrencyDataTable: createCurrencyDataTable,
        getCurrencyExchangeRateValue: getCurrencyExchangeRateValue
    };
});