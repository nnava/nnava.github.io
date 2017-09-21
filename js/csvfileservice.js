define(['./papaparse.min'], function(Papa) {
    
    function exportDataToCSVFile(data, fileTitle) {
        var csv = "\ufeff" + Papa.unparse(data, {
            delimiter: ";",
        });
  
        var fileName = fileTitle + '.csv' || 'export.csv';
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { 
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    return { 
        exportDataToCSVFile: exportDataToCSVFile
    };
});
