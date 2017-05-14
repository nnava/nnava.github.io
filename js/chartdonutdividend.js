define(['./colors', './bankdatadividend', './dropdowndonutdividendsort', './dateperiod'], function(colors, bankdatadividend, dropdowndonutdividendsort, dateperiod) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();
    var selectedPeriod = 0;
    var localStorageSortField = "chartdonutdividend_sort";
    var maxCountAllocationVisualChange = 45;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function saveSortLocalStorage(sort) {
        localStorage.setItem(localStorageSortField, sort);
    }

    function getSort() {
        var sortLocalStorageValue = localStorage.getItem(localStorageSortField);
        if(sortLocalStorageValue == null)
            return "name";
        else 
            return sortLocalStorageValue;
    }

    function setChartData(period) {
        selectedPeriod = period;
        var sort = getSort();
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

        var legendVisible = true;
        var labelDistance = 35;
        if(chartData.length > maxCountAllocationVisualChange) {
            legendVisible = false;
            labelDistance = 45;
        }

        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: titleText
            },
            legend: {
                visible: legendVisible,
                position: "top",
                margin: 4,
                padding: 2,
                labels: {
                    font: "10px Verdana"
                }
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
                    distance: labelDistance,
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
        loadChart: loadChart,
        saveSortLocalStorage: saveSortLocalStorage,
        getSort: getSort
    };
});