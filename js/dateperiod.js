define(['./date_fns.min'], function(date_fns) {

    function getStartOfYear(year) {
        return date_fns.startOfYear(new Date(year, 0, 1, 1, 00, 00));
    };
    
    function getEndOfYear(year) {
        return date_fns.endOfYear(new Date(year, 0, 1, 1, 00, 00));
    };

    function getStartOfTrailingPeriod(date, monthValue) {
        return date_fns.startOfMonth(date_fns.addMonths(date, monthValue));
    }

    function getDateEndOfMonth(date) {
        return date_fns.endOfMonth(date);
    }

    function getDateRange(startDate, endDate) {
        var start = startDate.toISOString().slice(0, 10).split('-');
        var end = endDate.toISOString().slice(0, 10).split('-');
        var startYear = parseInt(start[0]);
        var endYear = parseInt(end[0]);
        var dates = [];

        for(var i = startYear; i <= endYear; i++) {
            var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
            var startMon = i === startYear ? parseInt(start[1]) : 0;
            for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
                var month = j+1;
                var displayMonth = month < 10 ? '0' + month : month;
                dates.push({ year: i, month: displayMonth});
            }
        }
        return dates;
    }

    return { 
        getStartOfYear: getStartOfYear,
        getEndOfYear: getEndOfYear,
        getStartOfTrailingPeriod: getStartOfTrailingPeriod,
        getDateEndOfMonth: getDateEndOfMonth,
        getDateRange: getDateRange
    };
});