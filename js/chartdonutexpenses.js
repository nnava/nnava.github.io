define(['./alasqlavanza', './alasqlnordnet', './monthstaticvalues', './dateperiod'], function(alasqlavanza, alasqlnordnet, monthstaticvalues, dateperiod) {

    var chartData;
    var chartId;
    var monthsInput = monthstaticvalues.getMonthInputs();
    var selectedPeriod = "N";
    var localStorageSelectedPeriodField = "chartdonutexpenses_selectedperiod";
    var monthNumber = 11;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(period) {
        selectedPeriod = period;
        localStorage.setItem(localStorageSelectedPeriodField, selectedPeriod);

        var nordnetYearData = alasqlnordnet.getDividendMaxYear();
        var avanzaYearData = alasqlavanza.getDividendMaxYear();

        var result = avanzaYearData.concat(nordnetYearData);
        var resultYear = alasql('SELECT DISTINCT Year FROM ?', [result]);
        var maxYear = resultYear["0"].Year;
        if(maxYear == null) {
            chartData = [];
            return;
        }

        var startPeriod = dateperiod.getStartOfYear(maxYear);
        var endPeriod = dateperiod.getEndOfYear(maxYear);
        if(period == "R12") {
            var today = new Date().toISOString();
            startPeriod = dateperiod.getStartOfTrailingPeriod(today, -11);
            endPeriod = dateperiod.getDateEndOfMonth(today);
        }

        var totalYearExpenses = 0;
        var totalYearDividends = 0;
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

            var totalBelopp = resultNordnet + resultAvanza;
            totalYearDividends = totalYearDividends + totalBelopp;

            var monthValue = $('#' + monthsInput[arrayIndex]).data("kendoNumericTextBox").value();
            totalYearExpenses = totalYearExpenses + monthValue;
            arrayIndex++;
        });

        var donutData = [];
        donutData.push({
            category: "Utdelningar",
            value: totalYearDividends,
        });

        // Koll om värde större än 0? Annars har vi inga utgifter, sätt som 0
        totalYearExpenses = totalYearExpenses - totalYearDividends;
        if(totalYearExpenses <= 0) 
            totalYearExpenses = 0;

        donutData.push({
            category: "Utgifter",
            value: totalYearExpenses,
        });

        chartData = donutData;
    }

    function loadChart() {
        if($(chartId).data('kendoChart')) {
            $(chartId).data('kendoChart').destroy();
            $(chartId).empty();
        }

        var titleText = "Utdelningar/utgifter - total " + (selectedPeriod.startsWith("R") ? "R12" : "nuvarande år");

        $(chartId).kendoChart({
            title: {
                text: titleText
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #",
                    position: "outsideEnd"
                }
            },
            series: [{
                type: "donut",
                data: chartData
            }],
            tooltip: {
                visible: true,
                template: "#= category # - #= kendo.format('{0:P}', percentage) # - #= kendo.toString(value, 'n2') # kr"
            },
            theme: "bootstrap",
            transitions: false
        });
    }

    function getSelectedPeriod() {
        var selectedPeriodLocalStorageValue = localStorage.getItem(localStorageSelectedPeriodField);
        if(selectedPeriodLocalStorageValue == null)
            return selectedPeriod;
        else 
            return selectedPeriodLocalStorageValue;
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart,
        getSelectedPeriod: getSelectedPeriod
    };
});