define(['./alasqlavanza', './alasqlnordnet', './monthstaticvalues', './colors'], function(alasqlavanza, alasqlnordnet, monthstaticvalues, colors) {

    var chartData;
    var chartId;
    var months = monthstaticvalues.getMonthValues();
    var colorArray = colors.getColorArray();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

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
        var addedYear = [];        
        var yearWithMonthValues = [];
        var spacingValue = parseFloat(0.3, 10);
        if(resultYear.length > 4) 
            spacingValue = parseFloat(0.8, 10);

        resultYear.forEach(function(entry) {

            if (entry.Year == null) { return; }
            if(addedYear.includes(entry.Year)) return;

            var year = entry.Year;
            addedYear.push(year);

            var monthNumber = 11;
            var monthDataValues = [];
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
                monthDataValues[i] = totalBelopp;
            }

            yearWithMonthValues.push({
                name: year,
                data: monthDataValues,
                gap: parseFloat(0.3, 10),
                spacing: spacingValue
            });

        });

        chartData = yearWithMonthValues;
    }

    function loadChart() {
        var rotation = 0;
        if(chartData.length > 4) rotation = 270;
        
        $(chartId).kendoChart({
            title: {
                text: "Utdelningar månad/år"
            },
            legend: {
                position: "bottom",
                visible: true
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
            pannable: {
                lock: "y"
            },
            zoomable: {
                mousewheel: {
                    lock: "y"
                },
                selection: {
                    lock: "y"
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

    function updateChartOptions(type) {
        var rotation = 0;
        if(chartData.length > 4 && type === "column") rotation = 270;

        var chart = $(chartId).data("kendoChart");
        chart.setOptions({
            seriesDefaults: {
                type: type,
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
            }
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart,
        updateChartOptions: updateChartOptions
    };
});