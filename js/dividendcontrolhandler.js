define(['./griddividend'], function(griddividend) {

    function loadGridDividend() {
        griddividend.setId("#gridDividend");
        griddividend.setData();
        griddividend.load();
    }

    return {
        loadGridDividend: loadGridDividend
    }
});