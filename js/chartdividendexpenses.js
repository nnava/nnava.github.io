define(['./alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var chartId;
    var monthsInput = monthstaticvalues.getMonthInputs();
    var months = monthstaticvalues.getMonthValues();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

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
        var yearAvgExpensesValues = [];
        var monthMarginDataValues = [];
        var totalExpenses = 0;

        var year = resultYear["0"].Year;
        for(var i=0; i <= monthNumber; i++) {
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

            totalExpenses += monthExpenseTextboxValue;

            var monthValue = monthExpenseTextboxValue - totalDividendBelopp;
            var marginValue = 0;
            if(totalDividendBelopp > monthExpenseTextboxValue) {
                monthValue = 0;
                marginValue = totalDividendBelopp - monthExpenseTextboxValue;
            }

            monthExpensesDataValues[i] = monthValue;
            monthMarginDataValues[i] = marginValue;
        }

        totalExpenses = (totalExpenses / 12);

        for(var i=0; i <= monthNumber; i++) {
            yearAvgExpensesValues.push(totalExpenses);
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

        monthExpensesDividendData.push({
            type: "line",
            data: yearAvgExpensesValues,
            name: "Utgifter medelvärde",
            color: "#f2b661",
            tooltip: {
                visible: true
            },
            labels: {
                rotation: 0,
                visible: false
            }
        });

        chartData = monthExpensesDividendData;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Utdelningar/utgifter - nuvarande år"
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
            valueAxes: [{
                labels: {
                    format: "#,0 kr"
                }
            }], 
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
            theme: "bootstrap",
            transitions: false
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