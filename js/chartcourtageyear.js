define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var chartId;
    var chartYearValues = [];
    var total = [];
    var nordnetValues = [];
    var chartDataCourtageGrowth = [];

    function resetArrayValues() {
        chartYearValues = [];
        chartDataCourtageGrowth = [];
        nordnetValues = [];
    }

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        resetArrayValues();

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getCourtageYears();

        alasql('CREATE TABLE IF NOT EXISTS CourtageYearTable \
                (Year INT);');

        alasql('INSERT INTO CourtageYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM CourtageYearTable');
        alasql('TRUNCATE TABLE CourtageYearTable');

        var yearDepositData = [];
        var addedYear = [];
        var avanzaValues = [];
        var isNordnetNotAdded = true;
        total = [];

        resultYear.forEach(function(entry) {

            if (entry.Year == null) { return; }
            if (addedYear.includes(entry.Year)) return;

            var year = entry.Year;

            addedYear.push(year);

            var nordnetBelopp = alasqlnordnet.getCourtageSumAvgifter(year);
            var totalBelopp = nordnetBelopp;

            total[year] = totalBelopp;

            nordnetValues.push(nordnetBelopp);
 
            var yearBefore = year-1;
            var foundLastYear = false;
            resultYear.forEach(function(entryLast) {
                if(entryLast.Year == yearBefore) {
                    var totalBeloppLastYear = getTotalCourtageForYear(yearBefore);

                    var changeValue = totalBelopp - totalBeloppLastYear;
                    var growthValue = ((changeValue / totalBeloppLastYear) * 100).toFixed(2);

                    chartDataCourtageGrowth.push(growthValue);

                    foundLastYear = true;
                }
                
            });

            if(foundLastYear == false) {
                chartDataCourtageGrowth.push(0);
            }
        });

        chartYearValues = addedYear; 
    }

    function getTotalCourtageForYear(year) {
        return alasqlnordnet.getCourtageSumAvgifter(year);
    }

    window.getChartCourtageLabelText = function getChartCourtageLabelText(category) {
        return kendo.toString(total[category], 'n2') + ' kr';
    }

    function isBiggerThan0(element, index, array) {
        return element > 0;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Courtage - år"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column",
                stack: true
            },
            series: [{
                type: "column",
                field: "nn",
                name: "Nordnet",
                data: nordnetValues,
                color: "#00A8EF",
                labels: {
                    visible: true,
                    template: "#= window.getChartCourtageLabelText(category) #",                
                    position: "outsideEnd"
                }
            },
            {
                type: "line",
                data: chartDataCourtageGrowth,
                name: "Courtageutveckling",
                axis: "courtageutveckling",
                color: "#F2B661",
                tooltip: {
                    visible: true,
                    format: "{0} %"
                },
                labels: {
                    rotation: 0,
                    visible: true,
                    format: "{0} %"
                }
            }],
            valueAxes: [{
                title: { text: "kr" },
                labels: {
                    format: "#,0 kr"
                }
            }, {
                labels: {
                    format: "{0} %"
                },
                name: "courtageutveckling",
                title: { text: "Courtageutveckling" }
            }],
            categoryAxis: {
                categories: chartYearValues,
                majorGridLines: {
                    visible: true
                }
            },
            tooltip: {
                visible: true,
                template: "${series.name} - #= kendo.toString(value, 'n2') # kr"
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