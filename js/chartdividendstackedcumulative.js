define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './colors', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, colors, monthstaticvalues) {

    var chartData;
    var chartId;
    var selectedYear = 0;
    var colorArray = colors.getColorArray();
    var months = monthstaticvalues.getMonthValues();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue, year) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        selectedYear = year;
        var isTaxChecked = $('#checkboxTax').is(":checked");
        var avanzaData = alasqlavanza.getVärdepapperForYear(year);
        var nordnetData = alasqlnordnet.getVärdepapperForYear(year);

        alasql('CREATE TABLE IF NOT EXISTS DivStackedCumulativeVardepapper \
                (Vardepapper NVARCHAR(100), BankType NVARCHAR(10));');

        alasql('INSERT INTO DivStackedCumulativeVardepapper SELECT Vardepapper, "AVA" AS BankType \
                FROM ?', [avanzaData]);
                
        alasql('INSERT INTO DivStackedCumulativeVardepapper SELECT Vardepapper, "NN" AS BankType \
                FROM ?', [nordnetData]);

        var resultVärdepapper = alasql('SELECT DISTINCT Vardepapper, BankType FROM DivStackedCumulativeVardepapper');
        alasql('TRUNCATE TABLE DivStackedCumulativeVardepapper');

        var värdepapperDividendDataValues = [];
        resultVärdepapper.forEach(function(entry) {
            if (entry.Vardepapper == null) { return; }
            var värdepapper = entry.Vardepapper;

            var monthNumber = 11;
            var monthDividendDataValues = [];
            for(var i=0; i <= monthNumber; i++)
            {
                var month = i + 1;

                if(entry.BankType == "AVA") {
                    var resultAvanza = alasqlavanza.getVärdepapperDividend(year, month, värdepapper, isTaxChecked);

                    if(resultAvanza[0] == null) 
                        monthDividendDataValues.push(0);
                    else
                        monthDividendDataValues.push(resultAvanza[0].value);
                }
                else {
                    var resultNordnet = alasqlnordnet.getVärdepapperDividend(year, month, värdepapper, isTaxChecked);

                    if(resultNordnet[0] == null) 
                        monthDividendDataValues.push(0);
                    else
                        monthDividendDataValues.push(resultNordnet[0].value);
                }
            }

            värdepapperDividendDataValues.push({
                name: värdepapper,
                data: monthDividendDataValues
            });

        });

        chartData = värdepapperDividendDataValues;
    }

    function loadChart() {
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: "Utdelning per månad/värdepapper - år " + selectedYear
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column",
                stack: true,
                labels: {
                    visible: false,
                    background: "transparent"
                }
            },
            series: chartData,
            seriesColors: colorArray,
            valueAxis: {
                line: {
                    visible: false
                },
                labels: {
                    format: "#,0 kr"
                }
            },  
            categoryAxis: {
                categories: months,
                majorGridLines: {
                    visible: true
                }
            },
            tooltip: {
                visible: true,
                template: "#= series.name # - (#= kendo.toString(value, 'n2') # kr)"
            },
            theme: "bootstrap"
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});