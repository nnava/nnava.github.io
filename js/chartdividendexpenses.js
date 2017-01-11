define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var chartId;
    var monthsInput = monthstaticvalues.getMonthInputs();
    var months = monthstaticvalues.getMonthValues();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getDividendMaxYear();
        var avanzaYearData = alasqlavanza.getDividendMaxYear();

        alasql('CREATE TABLE IF NOT EXISTS DivExpensesYearTable \
                (Year INT);');

        alasql('INSERT INTO DivExpensesYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO DivExpensesYearTable SELECT Year \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM DivExpensesYearTable');
        alasql('TRUNCATE TABLE DivExpensesYearTable');

        var monthNumber = 11;
        var monthDividendDataValues = [];
        var monthExpensesDataValues = [];
        var monthMarginDataValues = [];

        var year = resultYear["0"].Year;
        for(var i=0; i <= monthNumber; i++)
        {
            var month = i + 1;

            var resultNordnet = alasqlnordnet.getDividendMonthSumBelopp(year, month);
            var resultAvanza = alasqlavanza.getDividendMonthSumBelopp(year, month);

            if ($('#checkboxTax').is(":checked")) {
                var taxNordnet = alasqlnordnet.getTaxMonthSumBelopp(year, month);
                var taxAvanza = alasqlavanza.getTaxMonthSumBelopp(year, month);
                resultNordnet = resultNordnet + taxNordnet;
                resultAvanza = resultAvanza + taxAvanza;
            }

            var totalDividendBelopp = Math.round(resultNordnet + resultAvanza);
            monthDividendDataValues[i] = totalDividendBelopp;

            var monthExpenseTextboxValue = $('#' + monthsInput[i]).data("kendoNumericTextBox").value();

            var monthValue = monthExpenseTextboxValue - totalDividendBelopp;
            var marginValue = 0;
            if(totalDividendBelopp > monthExpenseTextboxValue) {
                monthValue = 0;
                marginValue = totalDividendBelopp - monthExpenseTextboxValue;
            } 
            else {
                marginValue = 0;
            }

            monthExpensesDataValues[i] = monthValue;
            monthMarginDataValues[i] = marginValue;
        }

        var monthExpensesDividendData = [];
        monthExpensesDividendData.push({
            name: "Utdelningar",
            data: monthDividendDataValues,
        });

        monthExpensesDividendData.push({
            name: "Utgifter",
            data: monthExpensesDataValues,
            color: "#C9D2DB"
        });

        monthExpensesDividendData.push({
            name: "Överskott",
            data: monthMarginDataValues,
            color: "#5CB85C"
        });

        chartData = monthExpensesDividendData;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Utdelningar/kostnader - nuvarande år"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column",
                stack: true,
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= chartDividendExpensesSerieLabels(value) #"
                }
            },
            series: chartData,
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
                format: "#,0 kr"
            },
            theme: "bootstrap"
        });
    }

    window.chartDividendExpensesSerieLabels = function chartDividendExpensesSerieLabels(value) {
        if (value == 0) 
            return "";
        else
            return kendo.toString(value, 'n0');
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});