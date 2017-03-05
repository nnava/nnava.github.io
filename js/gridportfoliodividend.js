define(['./alasqlportfoliodividenddata', './monthstaticvalues'], function(alasqlportfoliodividenddata, monthstaticvalues) {

    var gridData = [];
    var gridId;
    var months = monthstaticvalues.getMonthWithLettersValues();
    var currentMonth = new Date().getMonth();

    function setId(fieldId) {
        gridId = fieldId;
    }

    function setData() {

        var currentYear = new Date().getFullYear();
        var result = alasqlportfoliodividenddata.getPortfolioDividends(currentYear);

        var data = [];
        var id = 0;
        result.forEach(function(entry) {
            if(entry == null) return;

            var månad = months[entry.Månad -1];

            data.push({ 
                Id: id,
                Name : entry.Värdepapper,
                Antal : entry.Antal,
                Typ: entry.Typ,
                Månad: månad,
                Utdelningsdatum : entry.Utdelningsdag,
                Utdelningsbelopp : entry.UtdelningaktieValuta,
                Utdelningtotal: entry.Belopp
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

            for (var i = 0; i < dataItems[j].items.length; i++) {
                var utdelningsdatum = new Date(dataItems[j].items[i].get("Utdelningsdatum")).toISOString();
                var row = e.sender.tbody.find("[data-uid='" + dataItems[j].items[i].uid + "']");
                if(utdelningsdatum <= today)
                    row.addClass("grid-ok-row");
            }
        }                
    }

    function load() {
        $(gridId).kendoGrid({
            toolbar: ["pdf"],
            excel: {
                fileName: "förväntade_utdelningar.xlsx",
                filterable: true
            },
            pdf: {
                fileName: "förväntade_utdelningar.pdf",
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
                            Utdelningtotal: { type: "number"}
                        }
                    }
                },
                group: {
                    field: "Månad", dir: "asc", aggregates: [
                        { field: "Name", aggregate: "count" },
                        { field: "Utdelningtotal", aggregate: "sum"}
                    ]
                },
                aggregate: [ { field: "Name", aggregate: "count" },
                             { field: "Utdelningtotal", aggregate: "sum" }
                ],
                sort: ({ field: "Utdelningsdatum", dir: "asc" }),                        
                pageSize: gridData.length
            },
            height: 720,
            scrollable: true,
            sortable: true,
            filterable: true,
            pageable: false,
            columns: [
                { field: "Månad", groupHeaderTemplate: "#= value.substring(2, value.length) #", hidden: true },
                { field: "Name", title: "Värdepapper",  width: "180px", aggregates: ["count"], footerTemplate: "Totalt antal förväntade utdelningar: #=count# st", groupFooterTemplate: gridNameGroupFooterTemplate },
                { field: "Utdelningsdatum", title: "Datum", format: "{0:yyyy-MM-dd}", width: "60px" },
                { field: "Typ", title: "Typ", width: "80px" },
                { field: "Antal", title: "Antal", format: "{0} st", width: "50px" },
                { field: "Utdelningsbelopp", title: "Utdelning/aktie", width: "60px" }, 
                { field: "Utdelningtotal", title: "Belopp", width: "100px", format: "{0:n2} kr", aggregates: ["sum"], footerTemplate: "Totalt förväntat belopp: #= kendo.toString(sum, 'n2') # kr", groupFooterTemplate: gridUtdelningtotalGroupFooterTemplate },
            ]
        });
    }

    function gridNameGroupFooterTemplate(e) {
        var groupMonthValue = months.indexOf(e.Name.group.value);        
        if(currentMonth <= groupMonthValue) {
            return "Antal förväntade utdelningar: " + e.Name.count + " st";
        }
        else {
            return "Antal erhållna utdelningar: " + e.Name.count + " st";
        }
    }

    function gridUtdelningtotalGroupFooterTemplate(e) {
        var groupNameValue = e.Name.group.value;
        var monthName = groupNameValue.substring(2, groupNameValue.length)
        var groupMonthValue = months.indexOf(e.Name.group.value);  
        var sum = kendo.toString(e.Utdelningtotal.sum, 'n2') + " kr";      
        if(currentMonth <= groupMonthValue) {
            return "Förväntat belopp för "+ monthName + ": " + sum;
        }
        else {
            return "Erhållet belopp för "+ monthName + ": " + sum;
        }        
    }

    return {
        setId: setId,
        setData: setData,
        load: load
    };
});