define([], function() {

    var yqlUrl = 'https://query.yahooapis.com/v1/public/yql';
    var historicalUrl = 'http://finance.yahoo.com/d/quotes.csv';
    var currencyArray = ['USD', 'CAD', 'EUR', 'NOK', 'DKK'];

    function fillCurrencyDataFromYahooFinance() {

        currencyArray.forEach(function(currency) {
            var queryParams = "&f=c4l1&s=#FX#SEK=X".replace("#FX#", currency);
            var queryTemplate = "select * from csv where url='" + historicalUrl + "?e=.csv" + queryParams + "'";

            $.ajax({
                url: yqlUrl,
                data: {q: queryTemplate, format: 'json'}
            }).done(function(output) {
                var response = _.isString(output) ? JSON.parse(output) : output;
                var currencyValue = response.query.results.row.col1;
                currencyArray[currency] = currencyValue;
                alasql('INSERT INTO CurrencyData VALUES ("' + currency + '", ' + currencyValue + ');');
            }).fail(function(err) {
                console.log(err.responseText);
            });
        });
    }

    return { 
        fillCurrencyDataFromYahooFinance: fillCurrencyDataFromYahooFinance
    };
});