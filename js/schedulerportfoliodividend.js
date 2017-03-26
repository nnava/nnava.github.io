define(['./alasqlportfoliodividenddata', './monthstaticvalues', './colors', './icsFormatter'], function(alasqlportfoliodividenddata, monthstaticvalues, colors, ics) {

    var schedulerData = [];
    var resourceData = [];
    var schedulerId;
    var months = monthstaticvalues.getMonthWithLettersValues();
    var colorsArray = colors.getColorArray();
    var currentYear = new Date().getFullYear();
    var today = new Date().toISOString().slice(0, 10);

    function setId(fieldId) {
        schedulerId = fieldId;
    }

    function setData() {

        var data = [];
        var värdepapperArray = [];
        var id = 0;
        var colorArrayId = 0;
        
        var result = alasqlportfoliodividenddata.getPortfolioDividends(currentYear);
        resourceData = [];

        result.forEach(function(entry) {
            if(entry == null) return;

            var beloppText = "Förväntat: "
            if(entry.Utdelningmottagen)
                beloppText = "Erhållet: ";

            var title = entry.Värdepapper + " - Antal: " + entry.Antal + " st. " + beloppText + kendo.toString(entry.Belopp, 'n2') + " kr";

            data.push({ 
                DividendId: id,
                Title : title,
                Start : new Date(entry.Utdelningsdag),
                End : new Date(entry.Utdelningsdag),
                StockId : entry.Värdepapper,
                IsAllDay : true
            });

            id++;
            
            if(värdepapperArray.includes(entry.Värdepapper)) return;

            värdepapperArray.push(entry.Värdepapper);
            resourceData.push({ text: entry.Värdepapper, value: entry.Värdepapper, color: colorsArray[colorArrayId] });
            
            colorArrayId++;
            if(colorArrayId >= 38)
                colorArrayId = 0;
        });

        schedulerData = data;
    }

    var CustomAgenda = kendo.ui.AgendaView.extend({    
        endDate: function() {
            var startDate = kendo.ui.AgendaView.fn.endDate.call(this);
            var yearLastDate = new Date(new Date().getFullYear(), 11, 31)
            var dayCountToLastDayOfYear = Math.floor((yearLastDate - startDate) / 86400000);

            return kendo.date.addDays(startDate, dayCountToLastDayOfYear);
        }
    });

    function load() {
        var today = new Date().toISOString().slice(0, 10);
        var yearFirstDayDate = new Date(new Date().getFullYear(), 0, 1);

        if($(schedulerId).data('kendoScheduler')) {
            $(schedulerId).data('kendoScheduler').destroy();
            $(schedulerId).empty();
        }

        $(schedulerId).kendoScheduler({   
            toolbar: [ "pdf" ],
            pdf: {
                fileName: "förväntade_utd_kalender_" + today + ".pdf"
            },  
            date: yearFirstDayDate,
            startTime: yearFirstDayDate,
            views: [
                { type: CustomAgenda, title: "Helår" }, { type: "month", eventHeight: 50 }, { type: "day" }
            ],
            timezone: "Europe/Stockholm",
            editable: false,
            dataSource: {            
                data: schedulerData,
                schema: {
                    model: {
                        id: "dividendId",
                        fields: {
                            dividendId: { from: "DividendId", type: "number" },
                            title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                            start: { type: "date", from: "Start" },
                            end: { type: "date", from: "End" },
                            stockId: { from: "StockId" },
                            isAllDay: { type: "boolean", from: "IsAllDay" }
                        }
                    }
                }
            },
            resources: [
                {
                    field: "stockId",
                    title: "Stock",
                    dataSource: resourceData
                }
            ]
        });

        $(".k-scheduler-toolbar").find("ul.k-scheduler-tools").append('<li style="background-color: #f5f5f5;"><a role="button" class="k-button exportics" style="margin-left: 10px;">Export to iCalendar</a></li>');
        
        $(".exportics").on("click", function(){
            var calEntry = new icsFormatter();

            var result = alasql('SELECT * FROM ? WHERE [Utdelningsdag] >= "' + today + '"', [alasqlportfoliodividenddata.getPortfolioDividends(currentYear)]);
            result.forEach(function(entry) {
                if(entry == null) return;

                var beloppText = "Förväntat: "
                if(entry.Utdelningmottagen)
                    beloppText = "Erhållet: ";

                var title = "Utdelning: " + entry.Värdepapper + " - Antal: " + entry.Antal + " st. " + beloppText + kendo.toString(entry.Belopp, 'n2') + " kr";
                var start = new Date(entry.Utdelningsdag);
                start.setHours(8, 0, 0, 0);
                calEntry.addEvent(title, title, "", start.toUTCString(), start.toUTCString());
            });

            calEntry.download();
        });
    }

    return {
        setId: setId,
        setData: setData,
        load: load
    };
});