define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues', './colors'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues, colors) {

    var chartData;
    var chartId;
    var months = monthstaticvalues.getMonthValues();
    var colorArray = colors.getColorArray();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getSellTransactionYears();
        var avanzaYearData = alasqlavanza.getSellTransactionYears();

        alasql('CREATE TABLE IF NOT EXISTS TransactionCountYearTable \
                (Year INT);');

        alasql('INSERT INTO TransactionCountYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO TransactionCountYearTable SELECT Year \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM TransactionCountYearTable');
        alasql('TRUNCATE TABLE TransactionCountYearTable');

        var datasetValue = [];
        var addedYear = [];        
        var yearWithMonthValues = [];
        
        resultYear.forEach(function(entry) {

            if (entry.Year == null) { return; }
            if(addedYear.includes(entry.Year)) return;

            addedYear.push(entry.Year);

            var year = entry.Year;
            var monthNumber = 11;
            var monthDataValues = [];
            for(var i=0; i <= monthNumber; i++)
            {
                var month = i + 1;               

                var resultNordnet = alasqlnordnet.getSellTransactionCount(year, month);
                var resultAvanza = alasqlavanza.getSellTransactionCount(year, month);

                monthDataValues[i] = resultNordnet + resultAvanza;
            }

            yearWithMonthValues.push({
                name: entry.Year,
                data: monthDataValues
            });
            
        });

        chartData = yearWithMonthValues;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Antal säljtransaktioner - år/månad"
            },
            legend: {
                position: "bottom"
            },
            chartArea: {
                background: ""
            },
            seriesColors: colorArray,
            seriesDefaults: {
                type: "line",
                style: "smooth"
            },
            series: chartData,
            valueAxis: {
                majorUnit: 5,
                labels: {
                    format: "{0}"
                },
                line: {
                    visible: false
                }
            },
            categoryAxis: {
                categories: months,
                majorGridLines: {
                    visible: false
                },
                labels: {
                    rotation: "auto"
                }
            },
            tooltip: {
                visible: true,
                format: "{0}",
                template: "#= series.name #: #= value #"
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