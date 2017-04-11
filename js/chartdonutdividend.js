define(['./colors', './bankdatadividend', './dropdowndonutdividendsort', './dateperiod'], function(colors, bankdatadividend, dropdowndonutdividendsort, dateperiod) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();
    var selectedPeriod = 0;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(period, sort) {
        selectedPeriod = period;
        var startPeriod = dateperiod.getStartOfYear(selectedPeriod);
        var endPeriod = dateperiod.getEndOfYear(selectedPeriod);

        if(selectedPeriod == "R12") {
            var today = new Date().toISOString();
            startPeriod = dateperiod.getStartOfTrailingPeriod(today, -11);
            endPeriod = dateperiod.getDateEndOfMonth(today);
        }

        var isTaxChecked = $('#checkboxTax').is(":checked");
        var result = bankdatadividend.getVärdepapperTotalDividend(startPeriod, endPeriod, sort, isTaxChecked);

        var donutData = [];
        result.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            donutData.push({ 
                "category": entry.name,
                "value": entry.value
            });
        });

        chartData = donutData;
    }

    function loadChart() {
        var titleText = "Värdepapper/utdelning -  " + (selectedPeriod.startsWith("R") ? "R12" : selectedPeriod);

        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: titleText
            },
            legend: {
                position: "top"
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "donut"
            },
            series: [{
                name: "Data",
                data: chartData,
                labels: {
                    visible: true,
                    background: "transparent",
                    position: "outsideEnd",
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            }],
            seriesColors: colorArray,
            tooltip: {
                visible: true,
                template: "#= category # - #= kendo.format('{0:P}', percentage) # (#= kendo.toString(value, 'n0') # kr)"
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