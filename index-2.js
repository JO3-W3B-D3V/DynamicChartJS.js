/**
 * NOTE: this file is used purely to demo the code
 */

/**
 * @global addEventHandler
 * @required @param {HTML Object} elem = the html element that you wish to target
 * @required @param {String} eventType = the event that you want the action to occur on
 * @required @param {Function} handler = the callback function
 */
var addEventHandler = function(elem, eventType, handler) {
    if (elem.addEventListener)
        elem.addEventListener(eventType, handler, false);
    else if (elem.attachEvent)
        elem.attachEvent('on' + eventType, handler);
};

/**
* @global ready
* @required @param {Function} clalback = the clalback function
* NOTE: Shorter than writing $(document).ready(function....), however, feel free to delete this code
* @return {Function}
*/
window.ready = function(callBack) {
    try {
      setTimeout(addEventHandler(document, "DOMContentLoaded", callBack), 20);
    } catch (e) {
      addEventHandler(document, "DOMContentLoaded", callBack);
      console.log(e.message);
    }
};


/**
* @global
* NOTE: this is just an example - Feel free to delete this code
*/
var example = ready(function(){
    var tempData = [
        [10,10,12,13,16,20,23,24,22,18,13,11],
        [65,59,10,81,56,55,40,120,50,70,90,40],
        [65,33,-28,20,-56,105,90,10,50,30,80,4]
    ];

    var rainData = [
        [65,33,-28,20,-56,105,90,10,50,30,80,4],
        [65,59,10,81,56,55,40,120,50,70,90,40],
        [65,33,-28,20,-56,105,90,10,50,30,80,4]
    ];

    var combineData = [tempData, rainData];


    var chartLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var divs = document.getElementsByClassName("demo");
    var select = document.getElementById("demo");
    var rainData = {
        type:'line',
        label: "Rain in MM",
        backgroundColor: "rgba(102, 194, 255, 0.25)",
        borderColor: "rgba(102, 194, 255, 0.75)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(102, 194, 255, 0)",
        hoverBorderColor: "rgba(102, 194, 255, 0.9)",
        data:[]
    };

    var dc = new DynamicChart(combineData, chartLabels);
    dc.showChart("chart", "click", divs, "data-value", 0, rainData);
    dc.showChart("chart", "change", select, "value", select.selectedIndex, rainData);

    var dcData = dc.getData();
    var dcOPts = dc.getOptions();
    var dcDataSets = dcData.datasets;
    var lineChart = dcDataSets;
});
