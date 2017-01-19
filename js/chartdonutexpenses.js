define(['./alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var chartId;
    var monthsInput = monthstaticvalues.getMonthInputs();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getDividendMaxYear();
        var avanzaYearData = alasqlavanza.getDividendMaxYear();

        alasql('CREATE TABLE IF NOT EXISTS DonutExpensesYearTable \
                (Year INT);');

        alasql('INSERT INTO DonutExpensesYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO DonutExpensesYearTable SELECT Year \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM DonutExpensesYearTable');
        alasql('TRUNCATE TABLE DonutExpensesYearTable');

        var monthNumber = 11;
        var totalYearExpenses = 0;
        var totalYearDividends = 0;

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

            var totalBelopp = resultNordnet + resultAvanza;
            totalYearDividends = totalYearDividends + totalBelopp;

            var monthValue = $('#' + monthsInput[i]).data("kendoNumericTextBox").value();
            totalYearExpenses = totalYearExpenses + monthValue;
        }

        var donutData = [];
        donutData.push({
            category: "Utdelningar",
            value: totalYearDividends,
        });

        donutData.push({
            category: "Utgifter",
            value: totalYearExpenses,
        });

        chartData = donutData;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Utdelningar/utgifter - total"
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                    position: "outsideEnd"
                }
            },
            series: [{
                type: "donut",
                data: chartData
            }],
            tooltip: {
                visible: true,
                template: "#= category # - #= kendo.format('{0:P}', percentage) #"
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