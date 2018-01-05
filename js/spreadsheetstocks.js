define(['./alasqlportfoliodata', './bankdataportfolio', './bankdatadividend', './alasqlstockdata', './alasqlcurrencydata', './alasqllocalization'], 
    function(alasqlportfoliodata, bankdataportfolio, bankdatadividend, alasqlstockdata, alasqlcurrencydata, alasqllocalization) {

    var spreadSheetData = [];
    var spreadSheetId;
    var currencyArray = [];
    var mergedCellsArray = [];
    var filterCells;
    var stockLastTradePriceArray = [];
    var skipRunningFunctions = false;
    const columnBransch = 2;
    const columnSenastePris = 4;
    const localStorageStocksBranschField = "spreadsheetstocksarray_bransch_ver1";
    const localStorageStocksSenastePrisField = "spreadsheetstocksarray_senastepris_ver1";
    var storedStocksSenastePrisArray = getStoredArray(localStorageStocksSenastePrisField);

    kendo.spreadsheet.defineFunction("CALCDIVIDE", function(callback, numerator, denominator){
        calculateDivision(numerator, denominator, function(value){
            callback(value);
        });
    }).argsAsync([
        ["numerator", "number"],
        ["denominator", "number"]
    ]);

    function calculateDivision(numerator, denominator, callback) {
        if(numerator == 0) { callback(0); return; }
        callback(numerator/denominator);
    }

    kendo.spreadsheet.defineFunction("CURRENTDIVIDENDSUM", function(callback, isin){
        getCurrentDividendSum(isin, function(value){
            callback(value);
        });
    }).argsAsync([
        ["isin", "string"]
    ]);

    function getCurrentDividendSum(isin, callback) {
        callback(bankdatadividend.getCurrentDividendSum(isin));
    }

    kendo.spreadsheet.defineFunction("PURCHASEVALUE", function(callback, isin){
        getPurchaseValue(isin, function(value){
            callback(value);
        });
    }).argsAsync([
        ["isin", "string"]
    ]);

    function getPurchaseValue(isin, callback) {
        callback(bankdataportfolio.getPurchaseValue(isin));
    }

    kendo.spreadsheet.defineFunction("YFCURRENCYTOUSERCURRENCY", function(callback, currency){
        fetchCurrencyToUserCurrency(currency, function(value){
            callback(value);
        });
    }).argsAsync([
        ["currency", "string"]
    ]);

    function fetchCurrencyToUserCurrency(currency, callback) {

        if(skipRunningFunctions) return;
        var userCurrency = alasqllocalization.getUserCurrency();
        if(currency === userCurrency) { callback(1); return; };
        if(currencyArray[currency] != null) { callback(currencyArray[currency]); return; };

        var currencyValue = alasqlcurrencydata.getCurrencyExchangeRateValue(currency);
        currencyArray[currency] = currencyValue;
        callback(currencyValue);
    }

    kendo.spreadsheet.defineFunction("YFLASTPRICE", function(callback, xCell, symbol, isin) {
        fetchLastTradePriceOnly(symbol, isin, xCell, function(value){
            callback(value);
        });
    }).argsAsync([
        [ "xCell", "string" ],
        [ "symbol", "string" ],
        [ "isin", "string" ]
    ]);

    function fetchLastTradePriceOnly(symbol, isin, xCell, callback) {

        if(skipRunningFunctions) return;

        var spreadsheet = $(spreadSheetId).data("kendoSpreadsheet");
        var sheet = spreadsheet.activeSheet();
        
        
        $.get('https://proxy-sauce.glitch.me/https://finance.google.com/finance?q=' + symbol + '&output=json', function(data, status) {
            var responseData = _.isString(data) ? JSON.parse(data.replace("//", "")) : data;

            if(data.length < 1000) {
                var avanzaLink = alasqlstockdata.getAzaLinkFromYahooSymbol(symbol);

                if(avanzaLink == "-") {
                    var senastePris = 0;
                    var storedStocksSenastePrisArray = getStoredArray(localStorageStocksSenastePrisField);
                    var savedSenastePris =  alasql('SELECT VALUE SenastePris FROM ? WHERE ISIN = ?', [storedStocksSenastePrisArray, isin]);
                    if(savedSenastePris != null) {
                        stockLastTradePriceArray[symbol] = savedSenastePris;
                        senastePris = savedSenastePris;
                    }
                    sheet.range(xCell).background("lightyellow");
                    callback(senastePris);
                    return;
                }

                $.get('https://proxy-sauce.glitch.me/' + 'https://www.avanza.se' + avanzaLink, function(data, status) {

                    var parser = new DOMParser();
                    var doc = parser.parseFromString(data, "text/html");
                    var spanLastPrice = doc.getElementsByClassName('lastPrice SText bold');

                    if(spanLastPrice["0"] == null || spanLastPrice["0"].childNodes["0"] == null) {
                        var senastePris = 0;
                        var storedStocksSenastePrisArray = getStoredArray(localStorageStocksSenastePrisField);
                        var savedSenastePris =  alasql('SELECT VALUE SenastePris FROM ? WHERE ISIN = ?', [storedStocksSenastePrisArray, isin]);
                        if(savedSenastePris != null) {
                            stockLastTradePriceArray[symbol] = savedSenastePris;
                            senastePris = savedSenastePris;
                        }
                        sheet.range(xCell).background("lightyellow");
                        callback(senastePris);
                        return;
                    }

                    var resultValue = parseFloat(spanLastPrice["0"].childNodes["0"].innerText.replace(',', '.')).toFixed(2);
                    stockLastTradePriceArray[symbol] = resultValue;
                    sheet.range(xCell).background("lightgreen");
                    callback(resultValue);
                    return;
                }, "text" );
            }
            else {
                var resultValue = parseFloat(responseData["0"].l.replace(',', '')).toFixed(2);
                stockLastTradePriceArray[symbol] = resultValue;
                sheet.range(xCell).background("lightgreen");
                callback(resultValue);
                return;
            }
        }, "text" ).fail(function(err) {
            var senastePris = 0;
            var savedSenastePris =  alasql('SELECT VALUE SenastePris FROM ? WHERE ISIN = ?', [storedStocksSenastePrisArray, isin]);
            if(savedSenastePris != null) {
                stockLastTradePriceArray[symbol] = savedSenastePris;
                senastePris = savedSenastePris;
            }
            
            sheet.range(xCell).background("lightyellow");
            callback(senastePris);
            return;
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
                    value: "ISIN", textAlign: "center", bold: "true"
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
                    value: "Direktavk.", textAlign: "center", bold: "true"
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
        var storedStocksBranschArray = getStoredArray(localStorageStocksBranschField);
        portfolioData.forEach(function(object) {

            var lastpriceFormula = "=YFLASTPRICE(\"#rowId#\", \"#symbol#\", \"#isin#\")*YFCURRENCYTOUSERCURRENCY(\"#FX#\")".replace("#symbol#", object.YahooSymbol).replace("#isin#", object.ISIN).replace("#FX#", object.Valuta).replace("#rowId#", "E" + rowCount);
            var marketValueFormula = "D#rowCount#*E#rowPrice#".replace("#rowCount#", rowCount).replace("#rowPrice#", rowCount);
            var purchaseValueFormula = "=PURCHASEVALUE(B#rowCount#)".replace("#rowCount#", rowCount);
            var yieldFormula = "=CALCDIVIDE((CURRENTDIVIDENDSUM(B#rowCount#)*YFCURRENCYTOUSERCURRENCY(G#rowCount#)), E#rowCount#)".replace(new RegExp('#rowCount#', 'g'), rowCount);
            var bransch = object.Bransch;
            var savedBransch = alasql('SELECT VALUE Bransch FROM ? WHERE ISIN = ?', [storedStocksBranschArray, object.ISIN]);
            if(savedBransch != null)
                bransch = savedBransch;

            spreadSheetData.push({
                index: indexCount,
                cells: [
                    {
                        value: object.Värdepapper, textAlign: "left"
                    },
                    {
                        value: object.ISIN, textAlign: "left"
                    },
                    {
                        value: bransch, textAlign: "left", 
                        validation: {
                             dataType: "list",
                             showButton: true,
                             comparerType: "list",
                             from: '{ "Dagligvaror", "Finans & Fastighet", "Hälsovård",  "Övrigt", "ETF", "Investmentbolag", "Industrivaror & tjänster", "Informationsteknik", "Energi", "Kraftförsörjning", "Sällanköpsvaror- och tjänster" }',
                             allowNulls: true
                         }
                    },
                    {
                        value: object.Antal, format: "#,0"
                    },
                    {
                        formula: lastpriceFormula, textAlign: "right", format: "#,0.00 kr"
                    },
                    {
                        formula: yieldFormula, textAlign: "right", format: "#,0.00 %"
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

        var totalSumMarketValueFormula = "SUM(H2:H#LASTROW#)".replace("#LASTROW#", indexCount);
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
                    index: 3
                },
                {
                    index: 4
                },
                {
                    index: 5, value: "Totalt:", textAlign: "right", bold: "true"
                },
                {
                    index: 6
                },
                {
                    formula: totalSumMarketValueFormula, format: "#,0.00 kr"
                }
            ]
        });

        // Merge cells, to show totaltext
        mergedCellsArray.push(("F#ROW#:G#ROW#").replace("#ROW#", rowCount).replace("#ROW#", rowCount));
        filterCells = "A1:H#ROW#".replace("#ROW#", indexCount);
    }

    function getStoredArray(fieldId) {
        var data = JSON.parse(localStorage.getItem(fieldId));
        if(data == null) return [];
        return data;
    }

    function loadSpreadSheet() {

        if($(spreadSheetId).data('kendoSpreadsheet')) {
            $(spreadSheetId).data('kendoSpreadsheet').destroy();
            $(spreadSheetId).empty();
        }

        setTimeout(function(){  
            $(spreadSheetId).kendoSpreadsheet({
                theme: "bootstrap",
                change: onChange,
                toolbar: {
                    home: [ ["cut", "copy", "paste"] ], 
                    insert: [[ "addRowBelow", "addRowAbove" ]], 
                    data: false 
                },
                sheets: [
                    {
                        name: "Värdepapper",
                        mergedCells: mergedCellsArray,
                        filter: {
                            ref: filterCells,
                            columns:[]
                        },
                        rows: spreadSheetData,
                        columns: [
                            {
                                width: 200
                            },
                            {
                                width: 100
                            },
                            {
                                width: 130
                            },
                            {
                                width: 90
                            },
                            {
                                width: 110
                            },
                            {
                                width: 110
                            },
                            {
                                width: 60
                            },
                            {
                                width: 110
                            }
                        ]
                    }
                ],
                excelExport: function(e) {
             	    var customFileName = $(".k-spreadsheet-window").find(".k-textbox").val();
            	    e.workbook.fileName = customFileName;
                }
            });
            $(".k-button-icon > .k-i-file-excel").parent().on("click", function () {
                $(".k-spreadsheet-window").find(".k-textbox").val("Portföljöversikt");
            });

        }, 100);
    }

    function onChange(arg) {        
        if(arg.range._ref.bottomRight.col === columnBransch ||
            arg.range._ref.bottomRight.col === columnSenastePris) {
            var spreadsheet = $(spreadSheetId).data("kendoSpreadsheet");
            var spreadsheetDataJson = spreadsheet.toJSON();
            var result = spreadsheetDataJson.sheets["0"].rows;
            var dataBransch = [];
            var dataSenastePris = [];

            for(var i = 1; i < result.length; i++) {
                // Skip last as it is summary
                if(i == (result.length -1)) break;
                var isin = result[i].cells["1"].value
                var senastepris = result[i].cells["4"].value;
                var bransch = result[i].cells["2"].value;
                
                dataBransch.push({ ISIN: isin, Bransch: bransch });
                dataSenastePris.push({ ISIN: isin, SenastePris: senastepris });               
            }

            localStorage.setItem(localStorageStocksBranschField, JSON.stringify(dataBransch));
            localStorage.setItem(localStorageStocksSenastePrisField, JSON.stringify(dataSenastePris));
        }
    }

    function saveSpreadsheetDataToTable() {
        skipRunningFunctions = true;

        var spreadsheet = $(spreadSheetId).data("kendoSpreadsheet");
        var data = spreadsheet.toJSON();
        var result = data.sheets["0"].rows;
        var data = [];

        for(var i = 1; i < result.length; i++)
        {
            // Skip last as it is summary
            if(i == (result.length -1)) break;

            var bransch = result[i].cells["2"].value;
            if(bransch.length == 0)
                bransch = "Övrigt";

            data.push({
                Värdepapper: result[i].cells["0"].value,
                ISIN: result[i].cells["1"].value,
                Bransch: bransch,
                Antal: result[i].cells["3"].value,
                SenastePris: result[i].cells["4"].value.toFixed(2),
                Valuta: result[i].cells["6"].value,
                Marknadsvärde: result[i].cells["7"].value.toFixed(2)
            });
        }

        alasqlportfoliodata.saveDataToTable(data);
        skipRunningFunctions = false;
    }

    return {
        setSpreadsheetId: setSpreadsheetId,
        setData: setData,
        loadSpreadSheet: loadSpreadSheet,
        saveSpreadsheetDataToTable: saveSpreadsheetDataToTable
    };
});