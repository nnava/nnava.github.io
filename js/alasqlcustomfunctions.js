define([], function() {

    function setAlasqlPortfolioDataCustomFunctions() {
        alasql.fn.portfolioNewTradeCount = function(price, count, desiredWeight, totalPortfolioValue) { 
            var currentMarketValue = price * count;
            var currentValueInPercentage = (currentMarketValue/totalPortfolioValue)*100;
            var desiredValue = (totalPortfolioValue * (desiredWeight/100));
            var priceDesiredValueCount = (desiredValue/price);
            return Math.round(priceDesiredValueCount - count);
        }

        alasql.fn.portfolioMarketValue = function(price, count, currentMarketValue) { 
            return (parseFloat(currentMarketValue) + parseFloat(price) * parseInt(count));
        }

        alasql.fn.portfolioWeightPercentage = function(price, count, diffCount, totalPortfolioValue) { 
            count = count + diffCount;
            var marketValue = price * count;
            return ((marketValue/totalPortfolioValue)*100).toFixed(2);
        }
    }

    function loadFunctions() {
        setAlasqlPortfolioDataCustomFunctions();
    }

    return { 
        loadFunctions: loadFunctions
    };
});