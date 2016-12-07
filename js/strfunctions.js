define([], function() {

    function trim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }

    function csvJSON(csv){

        var lines = csv.split(";;");
        var result = [];
        var headers = lines[0].split(";");

        for(var i=1;i<lines.length;i++){

            var obj = {};
            var currentline=lines[i].split(";");

            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }
        
        return JSON.stringify(result); 
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function getBankSourceJsonData(stringValue) {
        var trimmedData = trim(stringValue);

        trimmedData = replaceAll(trimmedData, "ö", "o");
        trimmedData = replaceAll(trimmedData, "ä", "a");
        trimmedData = replaceAll(trimmedData, ",", ".");
        trimmedData = replaceAll(trimmedData, "/", "");

        return JSON.parse(csvJSON(trimmedData));
    }

    return { 
        getBankSourceJsonData: getBankSourceJsonData
    };

});