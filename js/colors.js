define([], function() {
    var colors = ['#356fa2', '#499ab2', '#4a934a', '#c2924e', '#ae2f2b', '#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#00bcd4', '#009688', '#4caf50', '#cddc39', '#ffeb3b', '#ff9800' ,'#795548'];

    function getColorArray() {
        return colors;
    };

    return { 
        getColorArray: getColorArray
    };
});