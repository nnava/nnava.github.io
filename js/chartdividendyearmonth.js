define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var chartId;
    var months = monthstaticvalues.getMonthValues();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getDividendYears();
        var avanzaYearData = alasqlavanza.getDividendYears();

        alasql('CREATE TABLE IF NOT EXISTS ArTable \
                (Ar INT);');

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Ar FROM ArTable');
        alasql('TRUNCATE TABLE ArTable');

        var datasetValue = [];
        var entryId = 0;
        var addedYear = [];        
        var yearWithMonthValues = [];
        
        resultYear.forEach(function(entry) {

            if (entry.Ar == null) { return; }
            if(addedYear.includes(entry.Ar)) return;

            addedYear.push(entry.Ar);

            var monthNumber = 11;
            var monthDataValues = [];
            for(var i=0; i <= monthNumber; i++)
            {
                var month = i + 1;

                var resultNordnet = alasqlnordnet.getDividendMonthSumBelopp(entry.Ar, month);
                var resultAvanza = alasqlavanza.getDividendMonthSumBelopp(entry.Ar, month);

                var beloppNordnet = JSON.parse(JSON.stringify(resultNordnet));
                var beloppAvanza = JSON.parse(JSON.stringify(resultAvanza));

                var totalBelopp = parseInt(beloppNordnet["0"].Belopp) + parseInt(beloppAvanza["0"].Belopp);
                monthDataValues[i] = totalBelopp;
            }

            yearWithMonthValues.push({
                    name: entry.Ar,
                    data: monthDataValues,
                    gap: parseFloat(0.4, 10),
                    spacing: parseFloat(0.3, 10)
            });

            entryId++; 
        });

        chartData = yearWithMonthValues;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Utdelningar månad/år"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column"
            },
            series: chartData,
            valueAxis: {
                line: {
                    visible: false
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
                format: "{0}"
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