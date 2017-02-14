define([], function() {

    function deleteAvanzaRowsToSkip() {
        // HCP Specialare efter avknoppning QCP
        alasql('DELETE FROM AvanzaData \
                WHERE Datum = "2017-01-23" AND [Typ av transaktion] = "Utdelning" AND ISIN = "US40414L1098"');
        alasql('DELETE FROM AvanzaData \
                WHERE Datum = "2017-01-23" AND [Typ av transaktion] = "Utländsk källskatt 15%" AND ISIN = "US40414L1098"');
    }
    
    return {
        deleteAvanzaRowsToSkip: deleteAvanzaRowsToSkip
    };
});