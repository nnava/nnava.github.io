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

        var nordnetYearData = alasqlnordnet.getDividendYears();
        var avanzaYearData = alasqlavanza.getDividendYears();

        alasql('CREATE TABLE IF NOT EXISTS DivYearMonthYearTable \
                (Year INT);');

        alasql('INSERT INTO DivYearMonthYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO DivYearMonthYearTable SELECT Year \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM DivYearMonthYearTable');
        alasql('TRUNCATE TABLE DivYearMonthYearTable');

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
                var year = entry.Ar;

                var resultNordnet = alasqlnordnet.getDividendMonthSumBelopp(year, month);
                var resultAvanza = alasqlavanza.getDividendMonthSumBelopp(year, month);

                if ($('#checkboxTax').is(":checked")) {
                    var taxNordnet = alasqlnordnet.getTaxMonthSumBelopp(year, month);
                    var taxAvanza = alasqlavanza.getTaxMonthSumBelopp(year, month);
                    resultNordnet = resultNordnet + taxNordnet;
                    resultAvanza = resultAvanza + taxAvanza;
                }

                var totalBelopp = resultNordnet + resultAvanza;
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
        var rotation = 0;
        if(chartData.length > 4) rotation = 310;
        
        $(chartId).kendoChart({
            title: {
                text: "Utdelningar månad/år"
            },
            legend: {
                position: "bottom"
            },
            seriesColors: colorArray,
            seriesDefaults: {
                type: "column",
                labels: {
                    visible: function(e) {
                        if(e.value < 1) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    rotation: rotation,
                    format: "#,0 kr",
                    background: "none"
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

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});