define(['./alasqlavanza', './alasqlnordnet', './monthstaticvalues', './dateperiod'], function(alasqlavanza, alasqlnordnet, monthstaticvalues, dateperiod) {

    var chartData;
    var chartId;
    var monthsInput = monthstaticvalues.getMonthInputs();
    var months = [];
    var monthNumber = 11;
    var selectedPeriod;

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
        selectedPeriod = period;
        var nordnetYearData = alasqlnordnet.getDividendMaxYear();
        var avanzaYearData = alasqlavanza.getDividendMaxYear();

        var result = nordnetYearData.concat(avanzaYearData);
        var resultYear = alasql('SELECT DISTINCT Year FROM ?', [result]);

        var monthDividendDataValues = [];
        var monthExpensesDataValues = [];
        var yearAvgExpensesValues = [];
        var monthMarginDataValues = [];
        var totalExpenses = 0;
        var maxYear = resultYear["0"].Year;
        var startPeriod = dateperiod.getStartOfYear(maxYear);
        var endPeriod = dateperiod.getEndOfYear(maxYear);

        if(period == "R12") {
            var today = new Date().toISOString();
            startPeriod = dateperiod.getStartOfTrailingPeriod(today, -11);
            endPeriod = dateperiod.getDateEndOfMonth(today);
        }

        var arrayIndex = 0;
        var datesInPeriod = dateperiod.getDateRange(startPeriod, endPeriod);
        datesInPeriod.forEach(function(dateObject) {
            var year = dateObject.year;
            var month = dateObject.monthJsValue;
            var monthCalendarValue = month + 1;
            var resultNordnet = alasqlnordnet.getDividendMonthSumBelopp(year, monthCalendarValue);
            var resultAvanza = alasqlavanza.getDividendMonthSumBelopp(year, monthCalendarValue);

            if ($('#checkboxTax').is(":checked")) {
                var taxNordnet = alasqlnordnet.getTaxMonthSumBelopp(year, monthCalendarValue);
                var taxAvanza = alasqlavanza.getTaxMonthSumBelopp(year, monthCalendarValue);
                resultNordnet = resultNordnet + taxNordnet;
                resultAvanza = resultAvanza + taxAvanza;
            }

            var totalDividendBelopp = Math.round(resultNordnet + resultAvanza);
            monthDividendDataValues[arrayIndex] = totalDividendBelopp;

            var monthExpenseTextboxValue = $('#' + monthsInput[month]).data("kendoNumericTextBox").value();
            totalExpenses += monthExpenseTextboxValue;

            var monthValue = monthExpenseTextboxValue - totalDividendBelopp;
            var marginValue = 0;
            if(totalDividendBelopp > monthExpenseTextboxValue) {
                monthValue = 0;
                marginValue = totalDividendBelopp - monthExpenseTextboxValue;
            }

            monthExpensesDataValues[arrayIndex] = monthValue;
            monthMarginDataValues[arrayIndex] = marginValue;

            arrayIndex++;
        });

        totalExpenses = (totalExpenses / 12);
        for (var i=0; i <= monthNumber; i++) {
            yearAvgExpensesValues.push(totalExpenses);
        }

        var monthExpensesDividendData = [];
        monthExpensesDividendData.push({
            name: "Utdelningar",
            data: monthDividendDataValues,
        });

        monthExpensesDividendData.push({
            name: "Utgifter",
            data: monthExpensesDataValues,
            color: "#C9D2DB"
        });

        monthExpensesDividendData.push({
            name: "Överskott",
            data: monthMarginDataValues,
            color: "#5CB85C"
        });

        monthExpensesDividendData.push({
            type: "line",
            data: yearAvgExpensesValues,
            name: "Utgifter medelvärde",
            color: "#f2b661",
            tooltip: {
                visible: true
            },
            labels: {
                rotation: 0,
                visible: false
            }
        });

        chartData = monthExpensesDividendData;
    }

    function loadChart() {

        if($(chartId).data('kendoChart')) {
            $(chartId).data('kendoChart').destroy();
            $(chartId).empty();
        }

        var titleText = "Utdelningar/utgifter - " + (selectedPeriod.startsWith("R") ? "R12" : "nuvarande år");

        $(chartId).kendoChart({
            title: {
                text: titleText
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column",
                stack: true,
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= chartDividendExpensesSerieLabels(value) #"
                }
            },
            series: chartData,
            valueAxes: [{
                labels: {
                    format: "#,0 kr"
                }
            }], 
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
            theme: "bootstrap",
            transitions: false
        });
    }

    window.chartDividendExpensesSerieLabels = function chartDividendExpensesSerieLabels(value) {
        if (value == 0) 
            return "";
        else
            return kendo.toString(value, 'n0');
    }

    function updateChartOptions(type) {
        var chart = $(chartId).data("kendoChart");
        chart.setOptions({
            seriesDefaults: {
                type: type,
                stack: true,
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= chartDividendExpensesSerieLabels(value) #"
                }
            }
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        setCategoryAxisData: setCategoryAxisData,
        loadChart: loadChart,
        updateChartOptions: updateChartOptions
    };
});