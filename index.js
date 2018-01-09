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
  var chartData = [
      [10,10,12,13,16,20,23,24,22,18,13,11],
      [65,59,10,81,56,55,40,120,50,70,90,40],
      [65,33,-28,20,-56,105,90,10,50,30,80,4]
  ];


  var chartLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var divs = document.getElementsByClassName("demo");
  var select = document.getElementById("demo");

  var dc = new DynamicChart(chartData, chartLabels);
  dc.showChart("chart", "click", divs, "data-value");
  dc.showChart("chart", "change", select, "value", select.selectedIndex);
});
