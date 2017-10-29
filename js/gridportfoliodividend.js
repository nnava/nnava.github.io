define(['./alasqlportfoliodividenddata', './monthstaticvalues', './bankdatadividend', './dateperiod'], function(alasqlportfoliodividenddata, monthstaticvalues, bankdatadividend, dateperiod) {

    var gridData = [];
    var gridId;
    var months = monthstaticvalues.getMonthWithLettersValues();
    var currentMonth = new Date().getMonth();
    var selectedYear = new Date().getFullYear();

    function setId(fieldId) {
        gridId = fieldId;
    }

    function setData(year) {
        selectedYear = year;
        var result = alasqlportfoliodividenddata.getPortfolioDividends(selectedYear);
        var data = [];
        var id = 0;

        result.forEach(function(entry) {
            if(entry == null) return;

            var månad = months[entry.Månad -1];
            var land = entry.Land == null ? "x" : entry.Land.toLowerCase();
            data.push({ 
                Id: id,
                Name : entry.Värdepapper,
                Antal : entry.Antal,
                Typ: entry.Typ,
                Månad: månad,
                Utdelningsdatum : entry.Utdelningsdag,
                Utdelningsbelopp : entry.UtdelningaktieValuta,
                Utdelningtotal: entry.Belopp,
                Valuta: entry.Valuta,
                ValutaKurs: entry.ValutaKurs,
                Land: land,
                UtdelningDeklarerad: entry.UtdelningDeklarerad,
                Utv: entry.Utv
            });

            id++;
        });

        gridData = data;
    }

    function onDataBound(e) {
        var columns = e.sender.columns;
        var dataItems = e.sender.dataSource.view();
        var today = new Date().toISOString();
        for (var j = 0; j < dataItems.length; j++) {

            if(dataItems[j].items == null) return;
            
            for (var i = 0; i < dataItems[j].items.length; i++) {
                var utdelningsdatum = new Date(dataItems[j].items[i].get("Utdelningsdatum")).toISOString();
                var utdelningdeklarerad = dataItems[j].items[i].get("UtdelningDeklarerad");
                var row = e.sender.tbody.find("[data-uid='" + dataItems[j].items[i].uid + "']");
                if(utdelningsdatum <= today)
                    row.addClass("grid-ok-row");

                if(utdelningdeklarerad == "N")
                    row.addClass("grid-yellow-row");
            }
        }                
    }

    function load() {
        var today = new Date().toISOString().slice(0, 10);

        var grid = $(gridId).kendoGrid({
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: "förväntade_utdelningar" + "_" + today + ".xlsx",
                filterable: true
            },
            pdf: {
                fileName: "förväntade_utdelningar" + "_" + today + ".pdf",
                allPages: true,
                avoidLinks: true,
                paperSize: "A4",
                margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                landscape: true,
                repeatHeaders: true,
                scale: 0.8
            },
            theme: "bootstrap",
            dataBound: onDataBound,
            dataSource: {
                data: gridData,
                schema: {
                    model: {
                        fields: {
                            Name: { type: "string" },
                            Antal: { type: "number" },
                            Typ: { type: "string" },
                            Utdelningsdatum: { type: "date" },
                            Utdelningsbelopp: { type: "string" },
                            Utdelningtotal: { type: "number"},
                            Land: {type: "string" },
                            ValutaKurs: { type: "string"},
                            Valuta: {type: "string" }
                        }
                    }
                },
                group: {
                    field: "Månad", dir: "asc", aggregates: [
                        { field: "Månad", aggregate: "sum" },
                        { field: "Name", aggregate: "count" },
                        { field: "Utdelningtotal", aggregate: "sum"}
                    ]
                },
                aggregate: [ { field: "Månad", aggregate: "sum" },
                             { field: "Name", aggregate: "count" },
                             { field: "Utdelningtotal", aggregate: "sum" }
                ],
                sort: ({ field: "Utdelningsdatum", dir: "asc" }),                        
                pageSize: gridData.length
            },
            scrollable: true,
            sortable: true,
            filterable: true,
            groupable: true,
            pageable: false,
            columns: [
                { field: "Månad", groupHeaderTemplate: "#= value.substring(2, value.length) #", hidden: true },
                { field: "UtdelningDeklarerad", hidden: true },
                { field: "Name", title: "Värdepapper", template: "<div class='gridportfolio-country-picture' style='background-image: url(/styles/images/#:data.Land#.png);'></div><div class='gridportfolio-country-name'>#: Name #</div>", width: "150px", aggregates: ["count"], footerTemplate: "Totalt antal förväntade utdelningar: #=count# st", groupFooterTemplate: gridNameGroupFooterTemplate },
                { field: "Utdelningsdatum", title: "Utd/Handl. utan utd", format: "{0:yyyy-MM-dd}", width: "75px" },
                { field: "Typ", title: "Typ", width: "70px" },
                { field: "Antal", title: "Antal", format: "{0} st", width: "40px" },
                { field: "Utdelningsbelopp", title: "Utdelning/aktie", width: "60px" }, 
                { title: "Utv.", template: '<span class="#= gridPortfolioDividendDivChangeClass(data) #"></span>', width: "15px" }, 
                { field: "Utdelningtotal", title: "Belopp", width: "110px", format: "{0:n2} kr", aggregates: ["sum"], footerTemplate: gridUtdelningtotalFooterTemplate, groupFooterTemplate: gridUtdelningtotalGroupFooterTemplate },
                { title: "", template: '<span class="k-icon k-i-info" style="#= gridPortfolioDividendInfoVisibility(data) #"></span>', width: "15px" }
            ],
            excelExport: function(e) {
                var sheet = e.workbook.sheets[0];
                for (var i = 0; i < sheet.columns.length; i++) {
                    sheet.columns[i].width = getExcelColumnWidth(i);
                }
            }
        }).data("kendoGrid");

        grid.thead.kendoTooltip({
            filter: "th",
            content: function (e) {
                var target = e.target; 
                return $(target).text();
            }
        });

        addTooltipForColumnFxInfo(grid, gridId);
        addTooltipForColumnUtvInfo(grid, gridId);
    }

    function addTooltipForColumnUtvInfo(grid, gridId) {
        $(gridId).kendoTooltip({
            show: function(e){
                if(this.content.text().length > 1){
                    this.content.parent().css("visibility", "visible");
                }
            },
            hide:function(e){
                this.content.parent().css("visibility", "hidden");
            },
            filter: "td:nth-child(9)", 
            position: "left",
            width: 200,
            content: function(e) {
                var dataItem = grid.dataItem(e.target.closest("tr"));
                if(dataItem == null || e.target[0].parentElement.className == "k-group-footer" || dataItem.Utv == 0) return "";

                var content = "Utdelningsutveckling jmf fg utdelning: " + dataItem.Utv.replace('.', ',') + " %";
                return content
            }
        }).data("kendoTooltip");
    }

    function addTooltipForColumnFxInfo(grid, gridId) {
        $(gridId).kendoTooltip({
            show: function(e){
                if(this.content.text().length > 1){
                    this.content.parent().css("visibility", "visible");
                }
            },
            hide:function(e){
                this.content.parent().css("visibility", "hidden");
            },
            filter: "td:nth-child(11)", 
            position: "left",
            width: 200,
            content: function(e) {
                var dataItem = grid.dataItem(e.target.closest("tr"));
                if(dataItem == null || dataItem.ValutaKurs <= 1 || e.target[0].parentElement.className == "k-group-footer") return "";

                var content = "Förväntat belopp beräknat med " + dataItem.Valuta + " växelkurs: " + (dataItem.ValutaKurs).replace(".", ",") + "kr";
                return content
            }
        }).data("kendoTooltip");
    }

    window.gridPortfolioDividendDivChangeClass = function gridPortfolioDividendDivChangeClass(data) {
        if(data.Utv == 0 || data.Utv == null) 
            return "hidden";
        else if(data.Utv > 0) 
            return "k-icon k-i-arrow-up";
        else 
            return "k-icon k-i-arrow-down";
    }

    window.gridPortfolioDividendInfoVisibility = function gridPortfolioDividendInfoVisibility(data) {
        return data.ValutaKurs > 1 ? "" : "display: none;";
    }

    function getExcelColumnWidth(index) {
        var columnWidth = 150;
        
        switch(index) {
            case 0: // Månad
                columnWidth = 80;
                break;
            case 1: // Värdepapper
                columnWidth = 220;
                break;   
            case 2: // Datum
                columnWidth = 80;
                break;     
            case 3: // Typ
                columnWidth = 130;
                break;     
            case 4: // Antal
                columnWidth = 70;
                break;  
            case 5: // Utdelning/aktie
                columnWidth = 120;
                break;  
            case 6: // Belopp
                columnWidth = 260;
                break;                               
            default:
                columnWidth = 150;
        }

        return columnWidth;
    }

    function gridNameGroupFooterTemplate(e) {
        var groupNameValue = e.Månad.sum;
        if(typeof e.Name.group !== 'undefined')
            groupNameValue = e.Name.group.value;

        var groupMonthValue = months.indexOf(groupNameValue);        
        if(currentMonth <= groupMonthValue) {
            return "Antal förväntade utdelningar: " + e.Name.count + " st";
        }
        else {
            return "Antal erhållna utdelningar: " + e.Name.count + " st";
        }
    }

    function gridUtdelningtotalFooterTemplate(e) {
        var startPeriod = dateperiod.getStartOfYear((selectedYear -1));
        var endPeriod = dateperiod.getEndOfYear((selectedYear -1));
        var isTaxChecked = $('#checkboxTax').is(":checked");

        var selectedYearTotalNumeric = e.Utdelningtotal.sum;
        var selectedYearTotal = kendo.toString(selectedYearTotalNumeric, 'n2') + " kr";
        var lastYearTotalNumeric = bankdatadividend.getTotalDividend(startPeriod, endPeriod, isTaxChecked);
        var lastYearTotal = kendo.toString(lastYearTotalNumeric, 'n2') + " kr";
        var growthValueNumeric = calculateGrowthChange(selectedYearTotalNumeric, lastYearTotalNumeric);
        var growthValue = kendo.toString(growthValueNumeric, 'n2').replace(".", ",") + "%";
        var spanChange = buildSpanChangeArrow(selectedYearTotalNumeric, lastYearTotalNumeric);

        return "Totalt förväntat belopp: " + selectedYearTotal + " " + spanChange + growthValue + " (" + lastYearTotal + ")";     
    }

    function gridUtdelningtotalGroupFooterTemplate(e) {
        var groupNameValue = e.Månad.sum;
        if(typeof e.Name.group !== 'undefined')
            groupNameValue = e.Name.group.value;

        var groupMonthValue = months.indexOf(groupNameValue);
        var isTaxChecked = $('#checkboxTax').is(":checked");
        var lastYearValueNumeric = bankdatadividend.getDividendMonthSumBelopp((selectedYear -1), (groupMonthValue +1), isTaxChecked);
        var selectedYearValueNumeric = e.Utdelningtotal.sum; 
        var lastYearValue = kendo.toString(lastYearValueNumeric, 'n2') + " kr";
        var selectedYearValue = kendo.toString(selectedYearValueNumeric, 'n2') + " kr";
        var monthName = groupNameValue.substring(3, groupNameValue.length).toLowerCase();
        var spanChange = buildSpanChangeArrow(selectedYearValueNumeric, lastYearValueNumeric);
        var growthValueNumeric = calculateGrowthChange(selectedYearValueNumeric, lastYearValueNumeric);
        var growthValue = kendo.toString(growthValueNumeric, 'n2').replace(".", ",") + "%";

        if(months.includes(groupNameValue)) {
            if(currentMonth <= groupMonthValue) {
                return "Förväntat belopp " + monthName + ": " + selectedYearValue + " " + spanChange + growthValue + " (" + lastYearValue + ")";
            }
            else {
                return "Erhållet belopp " + monthName + ": " + selectedYearValue + " " + spanChange + growthValue +  " (" + lastYearValue + ")";
            }   
        }
        else {
            return "Förväntat belopp " + groupNameValue + ": " +  selectedYearValue + " " + spanChange + growthValue +  " (" + lastYearValue + ")";
        }     
    }

    function buildSpanChangeArrow(current, last) {
        var spanArrowClass = current > last ? "k-i-arrow-up" : "k-i-arrow-down";
        var titleText = current > last ? "To the moon" : "Back to earth";
        return "<span class='k-icon " + spanArrowClass + "' title='" + titleText + "'></span>";
    }

    function calculateGrowthChange(current, last) {
        if(last == 0) return 0;
        var changeValue = current - last;
        return ((changeValue / last) * 100).toFixed(2);
    }

    return {
        setId: setId,
        setData: setData,
        load: load
    };
});