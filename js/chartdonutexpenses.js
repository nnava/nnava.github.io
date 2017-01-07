define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

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

        alasql('CREATE TABLE IF NOT EXISTS ArTable \
                (Ar INT);');

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Ar FROM ArTable');
        alasql('TRUNCATE TABLE ArTable');

        var monthNumber = 11;
        var totalYearExpenses = 0;
        var totalYearDividends = 0;

        var year = resultYear["0"].Ar;
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
            category: "Kostnader",
            value: totalYearExpenses,
        });

        chartData = donutData;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Utdelningar/kostnader total"
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