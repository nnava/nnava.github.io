define(['./colors', './alasqlportfoliodata'], function(colors, alasqlportfoliodata) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();
    var maxCountIndustryVisualChange = 8;
    var maxCountAllocationVisualChange = 45;
    var localStorageSortField = "chartdonutportfolioallocation_sort";

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

    function setChartData() {
        var sort = getSort();

        var resultAllocation = alasqlportfoliodata.getPortfolioAllocation(sort);
        var resultIndustry = alasqlportfoliodata.getPortfolioIndustrySort(sort);

        var industryData = [];
        var allocationData = [];
        var donutData = [];

        resultIndustry.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            industryData.push({ 
                "category": entry.name,
                "value": parseInt(entry.value),
                "antal": 0,
                "senastepris": 0
            });
        });

        donutData.push({ 
            name: "Bransch",
            data: industryData,
            labels: {
                visible: function(e) {
                    var percentage = (e.percentage * 100);
                    if(industryData.length > maxCountIndustryVisualChange && percentage < 1)
                        return false;
                    else
                        return true;
                },
                background: "transparent",
                rotation: 320,
                position: "center",
                template: "#= category # - #= kendo.format('{0:P}', percentage) #"
            }
        });

        resultAllocation.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            allocationData.push({ 
                "category": entry.name,
                "value": parseInt(entry.value),
                "antal": entry.Antal,
                "senastepris": entry.SenastePris
            });
        });

        var labelDistance = 35;
        if(allocationData.length > maxCountAllocationVisualChange)
            labelDistance = 45;

        donutData.push({ 
            name: "Innehav",
            data: allocationData,
            labels: {
                visible: true,
                background: "transparent",
                distance: labelDistance,
                position: "outsideEnd",
                template: "#= category # - #= kendo.format('{0:P}', percentage) #"
            }
        });
        
        chartData = donutData;
    }

    function loadChart() {

        var legendVisible = true;
        var seriesDefaultsPadding = 45;
        if(chartData[1].data.length > maxCountAllocationVisualChange) {
            legendVisible = false;
            seriesDefaultsPadding = 30;
        }
            
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: "Fördelning innehav"
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
                type: "donut",
                padding: 45
            },
            series: chartData,
            seriesColors: colorArray,
            tooltip: {
                visible: true,
                template: "#= window.returnPortfolioAllocationTooltipText(category, kendo.format('{0:P}', percentage), value, dataItem) #"
            },
            theme: "bootstrap"
        });
    }

    window.returnPortfolioAllocationTooltipText = function returnPortfolioAllocationTooltipText(category, percentage, value, dataItem) {
        if(dataItem.antal === 0 && dataItem.senastepris === 0)
            return category + " - " + percentage + " (" + kendo.toString(value, 'n0') + ') kr';
        else
            return category + " - " + percentage + " (" + kendo.toString(value, 'n0') + ') kr' + "</br>" + "Antal: " + kendo.toString(dataItem.antal, 'n0') + " st á senaste pris: " + dataItem.senastepris + " kr";
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart,
        saveSortLocalStorage: saveSortLocalStorage,
        getSort: getSort
    };
});