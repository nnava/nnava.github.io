define(['./alasqlavanza', './alasqlnordnet', './monthstaticvalues', './colors'], function(alasqlavanza, alasqlnordnet, monthstaticvalues, colors) {

    var chartData;
    var chartId;
    var months = monthstaticvalues.getMonthValues();
    var colorArray = colors.getColorArray();
    var yearTotalValue = [];

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

        var nordnetYearData = alasqlnordnet.getBuyTransactionYears();
        var avanzaYearData = alasqlavanza.getBuyTransactionYears();

        var result = avanzaYearData.concat(nordnetYearData);
        var resultYear = alasql('SELECT DISTINCT Year FROM ?', [result]);
        var datasetValue = [];
        var addedYear = [];        
        var yearWithMonthValues = [];
        yearTotalValue = [];
        
        resultYear.forEach(function(entry) {

            if (entry.Year == null) { return; }
            if(addedYear.includes(entry.Year)) return;

            addedYear.push(entry.Year);

            var year = entry.Year;
            var monthNumber = 11;
            var monthDataValues = [];
            var totalTransactionCount = 0;
            for(var i=0; i <= monthNumber; i++)
            {
                var month = i + 1;               

                var resultNordnet = alasqlnordnet.getBuyTransactionCount(year, month);
                var resultAvanza = alasqlavanza.getBuyTransactionCount(year, month);
                var total = resultNordnet + resultAvanza;
                totalTransactionCount += total;

                monthDataValues[i] = total;
            }

            yearTotalValue[year] = totalTransactionCount;

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
                text: "Antal köptransaktioner - år/månad"
            },
            legend: {
                position: "bottom",
                labels: {
                    template: "#= window.getChartBuyLineLegendText(text) #"
                }
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
                template: "#= series.name #: #= value # st"
            },
            theme: "bootstrap",
            transitions: false
        });
    }

    window.getChartBuyLineLegendText = function getChartBuyLineLegendText(text) {
        return text + " (" + yearTotalValue[text] + " st)";
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});