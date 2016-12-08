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

        alasql('CREATE TABLE IF NOT EXISTS ArTable \
                (Ar INT);');

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Ar FROM ArTable');
        alasql('TRUNCATE TABLE ArTable');

        var monthNumber = 11;
        var monthDataValues = [];
        var monthExpensesDataValues = [];

        var year = resultYear["0"].Ar;
        for(var i=0; i <= monthNumber; i++)
        {
            var month = i + 1;

            var resultNordnet = alasqlnordnet.getDividendSumBelopp(year, month);
            var resultAvanza = alasqlavanza.getDividendSumBelopp(year, month);

            var beloppNordnet = JSON.parse(JSON.stringify(resultNordnet));
            var beloppAvanza = JSON.parse(JSON.stringify(resultAvanza));

            var totalBelopp = parseInt(beloppNordnet["0"].Belopp) + parseInt(beloppAvanza["0"].Belopp);
            monthDataValues[i] = totalBelopp;

            var monthValue = $('#' + monthsInput[i]).data("kendoNumericTextBox").value();
            
            monthExpensesDataValues[i] = monthValue - totalBelopp;
        }

        var monthExpensesDividendData = [];
        monthExpensesDividendData.push({
            name: "Utdelningar",
            data: monthDataValues,
        });

        monthExpensesDividendData.push({
            name: "Utgifter",
            data: monthExpensesDataValues,
            color: "#c9d2db"
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
                stack: true
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

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});