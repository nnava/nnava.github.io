define(['./alasqlavanza', './bankdataportfolio'], function(alasqlavanza, bankdataportfolio) {

    var spreadSheetData = [];
    var spreadSheetId;
    var yqlUrl = 'https://query.yahooapis.com/v1/public/yql';
    var historicalUrl = 'http://finance.yahoo.com/d/quotes.csv';
    var currencyArray = [];
    var mergedCellsArray = [];
    var stockLastTradePriceArray = [];

    kendo.spreadsheet.defineFunction("yfcurrencytosek", function(callback, currency){
        fetchCurrencyToSek(currency, function(value){
            callback(value);
        });
    }).argsAsync([
        [ "currency", "string" ]
    ]);

    function fetchCurrencyToSek(currency, callback) {

        if(currency === "SEK") { callback(1); return; };
        if(currencyArray[currency] != null) { callback(currencyArray[currency]); return; };

        var queryParams = "&f=c4l1&s=#FX#SEK=X".replace("#FX#", currency.toUpperCase());
        var queryTemplate = "select * from csv where url='" + historicalUrl + "?e=.csv" + queryParams + "'";

        $.ajax({
            url: yqlUrl,
            data: {q: queryTemplate, format: 'json'}
        }).done(function(output) {
            var response = _.isString(output) ? JSON.parse(output) : output;
            var currencyValue = response.query.results.row.col1;
            currencyArray[currency] = currencyValue;
            callback(currencyValue);
        }).fail(function(err) {
            console.log(err.responseText);
        }); 
    }

    kendo.spreadsheet.defineFunction("yflastprice", function(callback, symbol){
        fetchLastTradePriceOnly(symbol, function(value){
            callback(value);
        });
    }).argsAsync([
        [ "symbol", "string" ]
    ]);

    function fetchLastTradePriceOnly(symbol, callback) {

        var queryTemplate = _.template("select * from csv where url='" + historicalUrl + "?s=<%= symbol %>&f=l1' and columns='LastTradePriceOnly'");

        $.ajax({
            url: yqlUrl,
            data: {q: queryTemplate({symbol:symbol}), format: 'json'}
        }).done(function(output) {
            var response = _.isString(output) ? JSON.parse(output) : output;

            console.log(symbol, " calling fetchLastTradePriceOnly");
            var results = response.query.results;
            if(results == null) {
                if(stockLastTradePriceArray[symbol]) { callback(stockLastTradePriceArray[symbol]); return; };

                callback(0); 
                return;
            }

            var lastTradePriceOnly = results.row.LastTradePriceOnly;
            if(lastTradePriceOnly === "N/A")
                lastTradePriceOnly = 0;

            stockLastTradePriceArray[symbol] = lastTradePriceOnly;

            callback(lastTradePriceOnly);
        }).fail(function(err) {
            console.log(err.responseText);
        }); 
    }

    function setSpreadsheetId(fieldId) {
        spreadSheetId = fieldId;
    }

    function resetArrayValues() {
        spreadSheetData = [];
        mergedCellsArray = [];
        stockLastTradePrice = [];
    }

    function setData() {

        var portfolioData = bankdataportfolio.getStocksInPortfolio();

        resetArrayValues();

        spreadSheetData.push({
            height: 25,
            cells: [
                {
                    value: "Värdepapper", textAlign: "center", bold: "true"
                },
                {
                    value: "Bransch", textAlign: "center", bold: "true"
                },
                {
                    value: "Antal", textAlign: "center", bold: "true"
                },
                {
                    value: "Senaste pris", textAlign: "center", bold: "true"
                },
                {
                    value: "Valuta", textAlign: "center", bold: "true"
                },
                {
                    value: "Marknadsvärde", textAlign: "center", bold: "true"
                }
            ]
        });        
        
        var rowCount = 2;
        var indexCount = 1;
        portfolioData.forEach(function(object) {

            var lastpriceFormula = "=YFLASTPRICE(\"#symbol#\")*YFCURRENCYTOSEK(\"#FX#\")".replace("#symbol#", object.YahooSymbol).replace("#FX#", object.Valuta);
            var marketValueFormula = "C#rowCount#*D#rowPrice#".replace("#rowCount#", rowCount).replace("#rowPrice#", rowCount);

            spreadSheetData.push({
                index: indexCount,
                cells: [
                    {
                        value: object.Värdepapper, textAlign: "left"
                    },
                    {
                        value: object.Bransch, textAlign: "left"
                    },
                    {
                        value: object.Antal, format: "#,0"
                    },
                    {
                        formula: lastpriceFormula, textAlign: "right", format: "#,0.00 kr"
                    },
                    {
                        value: object.Valuta, textAlign: "right"
                    },
                    {
                        formula: marketValueFormula, format: "#,0.00 kr"
                    }
                ]
            });

            rowCount++;
            indexCount++;
        });

        var totalSumMarketValueFormula = "SUM(F2:F#LASTROW#)".replace("#LASTROW#", indexCount);
        spreadSheetData.push({
            index: indexCount,
            cells: [
                {
                    index: 0
                },
                {
                    index: 1
                },
                {
                    index: 2
                },
                {
                    index: 3, value: "Totalt:", textAlign: "right", bold: "true"
                },
                {
                    index: 4
                },
                {
                    formula: totalSumMarketValueFormula, format: "#,0.00 kr"
                }
            ]
        });

        // Merge cells, to show totaltext
        mergedCellsArray.push(("D#ROW#:E#ROW#").replace("#ROW#", rowCount).replace("#ROW#", rowCount));
    }

    function loadSpreadSheet() {

        if($(spreadSheetId).data('kendoSpreadsheet')) {
            $(spreadSheetId).data('kendoSpreadsheet').destroy();
            $(spreadSheetId).empty();
        }

        setTimeout(function(){  
            $(spreadSheetId).kendoSpreadsheet({
                theme: "bootstrap",
                sheets: [
                    {
                        name: "Aktier",
                        mergedCells: mergedCellsArray,
                        rows: spreadSheetData,
                        columns: [
                            {
                                width: 200
                            },
                            {
                                width: 130
                            },
                            {
                                width: 90
                            },
                            {
                                width: 100
                            },
                            {
                                width: 40
                            },
                            {
                                width: 110
                            }
                        ]
                    }
                ]
            });

            $(".k-button-icon > .k-i-file-excel").parent().on("click", function () {
                $(".k-spreadsheet-window").find(".k-textbox").val("Portföljöversikt");
            });

        }, 100);

    }

    return {
        setSpreadsheetId: setSpreadsheetId,
        setData: setData,
        loadSpreadSheet: loadSpreadSheet
    };
});