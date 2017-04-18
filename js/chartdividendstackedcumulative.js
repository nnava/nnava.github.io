define(['./bankdatadividend', './colors', './monthstaticvalues', './dateperiod'], function(bankdatadividend, colors, monthstaticvalues, dateperiod) {

    var chartData = [];
    var chartId;
    var selectedPeriod = 0;
    var colorArray = colors.getColorArray();
    var months = [];
    var localStorageSeriesDefaultField = "chartdividendstackedcumulative_seriesdefault";

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setCategoryAxisData(period) {
        months = [];
        var monthValues = monthstaticvalues.getMonthValues();

        if(period == "R12") {
            var today = new Date().toISOString();
            var startPeriod = dateperiod.getStartOfTrailingPeriod(today, -11);
            var endPeriod = dateperiod.getDateEndOfMonth(today);
            var datesInPeriod = dateperiod.getDateRange(startPeriod, endPeriod);

            datesInPeriod.forEach(function(dateObject) {
                var dateMonth = (dateObject.month - 1);
                months.push(monthValues[dateMonth]);
            });
        }
        else {
            months = monthValues;
        }
    }

    function setChartData(period) {
        chartData = [];
        selectedPeriod = period;

        var startPeriod = dateperiod.getStartOfYear(selectedPeriod);
        var endPeriod = dateperiod.getEndOfYear(selectedPeriod);

        if(selectedPeriod == "R12") {
            var today = new Date().toISOString();
            startPeriod = dateperiod.getStartOfTrailingPeriod(today, -11);
            endPeriod = dateperiod.getDateEndOfMonth(today);
        }

        var isTaxChecked = $('#checkboxTax').is(":checked");
        var resultVärdepapper = bankdatadividend.getVärdepapperForPeriod(startPeriod, endPeriod);        
        var dividendData = bankdatadividend.getVärdepapperDividendData(startPeriod, endPeriod, resultVärdepapper, isTaxChecked);
        dividendData.forEach(function(entry) {
            chartData.push({
                name: entry.name,
                data: entry.data                
            });
        });

        var resultTotalDividend = bankdatadividend.getTotalDividend(startPeriod, endPeriod, isTaxChecked);
        var avgDividendValue = (resultTotalDividend / 12);

        var avgDividendArray = [];
        for(var i=0; i <= 11; i++) {
            avgDividendArray.push(avgDividendValue);
        }

        chartData.push({
            type: "line",
            data: avgDividendArray,
            name: "Utdelningar medelvärde",
            color: "#f2b661",
            tooltip: {
                visible: true
            },
            labels: {
                rotation: 0,
                visible: false
            }
        });
    
    }

    function loadChart() {
        var titleText = "Utdelning per månad/värdepapper - " + (selectedPeriod.startsWith("R") ? "R12" : selectedPeriod);

        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: titleText
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: getSeriesDefaultType(),
                stack: true,
                labels: {
                    visible: false,
                    background: "transparent"
                }
            },
            series: chartData,
            seriesColors: colorArray,
            valueAxis: {
                labels: {
                    format: "#,0 kr"
                }
            },
            render: function(e) {
                // Clear up the loading indicator for this chart
                var loading = $(".chart-loading", e.sender.element.parent());
                kendo.ui.progress(loading, false);
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
                template: "#= series.name # - (#= kendo.toString(value, 'n2') # kr)"
            },
            theme: "bootstrap"
        });
    }

    function updateChartOptions(type) {
        localStorage.setItem(localStorageSeriesDefaultField, type);

        var chart = $(chartId).data("kendoChart");
        chart.setOptions({
            seriesDefaults: {
                type: type,
                stack: true,
                labels: {
                    visible: false,
                    background: "transparent"
                }
            }
        });
    }

    function getSeriesDefaultType() {
        var seriesDefaultTypeLocalStorageValue = localStorage.getItem(localStorageSeriesDefaultField);
        if(seriesDefaultTypeLocalStorageValue == null)
            return "column";
        else 
            return seriesDefaultTypeLocalStorageValue;
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        setCategoryAxisData: setCategoryAxisData,
        loadChart: loadChart,
        updateChartOptions: updateChartOptions,
        getSeriesDefaultType: getSeriesDefaultType
    };
});