/**
 * @name     DynamicChartJS.js
 * @author   Joseph Evans <joe.evs196@hotmail.co.uk>
 * @version  0.0.3
 * @license   MIT-License
 * @copyright Joseph Evans 2018
 * @file      the purpose of this file is to allow you to toggle between different data sets through
 *            adding events to dome elements, in addition to changing the chart type(s), in addition
 *            to addign the ability to input additional charts, if you want to see how I've done this
 *            documentation, take a look at {@link http://usejsdoc.org/index.html}, it's a great
 *            tool to allow you to document your javascript, I personally suggest more developers make use
 *            of this tool
 * @requires chart.js {@link https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.bundle.min.js}
 * @requires classList.min.js {@link http://purl.eligrey.com/github/classList.js/blob/master/classList.js}
 * @todo     add the ability to accept a list of additional
 * @todo     correct any mistakes in code documentation, this has been somewhat rushed
 * @todo     go through detailed testing, ensuring that it works across multiple devices and browsers
 * @todo     test further for bugs whenever possible
 */


/**
 * @ignore
 * @global
 * @name        classList.min.js
 * @description the purpose of this minified block below is to add spport for IE9
 *              without it, chart.js fails because IE9 doesn't support classlist,
 *              i copied the source code to add stability to this file, just to allow for some
 *              support for IE9
 * @see         {@link http://purl.eligrey.com/github/classList.js/blob/master/classList.js}
 */
"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||!function(t){"use strict";if("Element"in t){var e="classList",n="prototype",i=t.Element[n],s=Object,r=String[n].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[n].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1},c=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},a=function(t,e){if(""===e)throw new c("SYNTAX_ERR","The token must not be empty.");if(/\s/.test(e))throw new c("INVALID_CHARACTER_ERR","The token must not contain space characters.");return o.call(t,e)},l=function(t){for(var e=r.call(t.getAttribute("class")||""),n=e?e.split(/\s+/):[],i=0,s=n.length;s>i;i++)this.push(n[i]);this._updateClassName=function(){t.setAttribute("class",this.toString())}},u=l[n]=[],h=function(){return new l(this)};if(c[n]=Error[n],u.item=function(t){return this[t]||null},u.contains=function(t){return~a(this,t+"")},u.add=function(){var t,e=arguments,n=0,i=e.length,s=!1;do t=e[n]+"",~a(this,t)||(this.push(t),s=!0);while(++n<i);s&&this._updateClassName()},u.remove=function(){var t,e,n=arguments,i=0,s=n.length,r=!1;do for(t=n[i]+"",e=a(this,t);~e;)this.splice(e,1),r=!0,e=a(this,t);while(++i<s);r&&this._updateClassName()},u.toggle=function(t,e){var n=this.contains(t),i=n?e!==!0&&"remove":e!==!1&&"add";return i&&this[i](t),e===!0||e===!1?e:!n},u.replace=function(t,e){var n=a(t+"");~n&&(this.splice(n,1,e),this._updateClassName())},u.toString=function(){return this.join(" ")},s.defineProperty){var f={get:h,enumerable:!0,configurable:!0};try{s.defineProperty(i,e,f)}catch(p){void 0!==p.number&&-2146823252!==p.number||(f.enumerable=!1,s.defineProperty(i,e,f))}}else s[n].__defineGetter__&&i.__defineGetter__(e,h)}}(self),function(){"use strict";var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var n,i=arguments.length;for(n=0;i>n;n++)t=arguments[n],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:n.call(this,t)}}"replace"in document.createElement("_").classList||(DOMTokenList.prototype.replace=function(t,e){var n=this.toString().split(" "),i=n.indexOf(t+"");~i&&(n=n.slice(i),this.remove.apply(this,n),this.add(e),this.add.apply(this,n.slice(1)))}),t=null}());


/**
 * @global
 * @function
 * @name        addEventHandler
 * @param       {HTML} elem  the html element that you wish to target
 * @param       {String} eventType  the event that you want the action to occur on
 * @param       {Function} handler  the callback function
 * @description the purpose of this private function is to allow for an event to be handled
 */
window.addEventHandler = function (elem, eventType, handler) {
    try {
        if (elem.addEventListener) {
            elem.addEventListener(eventType, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + eventType, handler);
        }
    } catch (e) {
        return false;
    }
};


/**
 * @global
 * @function
 * @name        ready
 * @param       {Function} callBack  the purpose of this parameter is to allow the user to launch a function when the
 *                                   document is ready
 * @return      {Function}
 * @description the prupose of this function is to allow for the same function to run ONCE the DOM has loaded
 *              this function is shorter than jquery's solution where you'd use $(document).ready
 */
 window.ready = function(callBack) {
    try {
       setTimeout(addEventHandler(document, "DOMContentLoaded", callBack), 20);
    } catch (e) {
        try {
           addEventHandler(document, "DOMContentLoaded", callBack);
           console.log(e.message);
       } catch (e2) {
           return console.log(e2.message);
       }
    }
 };



/**
 * @global
 * @class
 * @constructor
 * @name      DynamicChart
 * @param     {String} chartType the chart type that you want to maybe change to
 * @param     {Array} mda        the muldi dimensional array allows you to add actual data
 * @param     {Array} labels     an array of labels
 * @return    {Object}
 * @classdesc the purpose of this class is to work along side chart.js,
 *            allowing the user to input some html element, and update the chart
 */
function DynamicChart (mda, lbls, chartType) {
    /**
     * @private
     * @property    {Object} PrivateObject the prupose of this property is to encapsulate some private functions
     * @name        PrivateObject
     * @type        {Object}
     * @description the prupose of this property is to encapsulate some private functions
     */
    var PrivateObject = {
        /**
         * @private
         * @property    {Array} dataBlocks prupose of this is to allow this obejct to store the
         *                      data that the user wishes to display
         * @name        dataBlocks
         * @default     mda
         * @description the prupose of this is to allow this obejct to store the data that the user wishes
         *              to display
         */
        dataBlocks : mda,


        /**
         * @private
         * @property    {HTML} ctx the purpose of this is to store what html element you're trying to traget
         * @name        ctx
         * @default     ''
         * @description the purpose of this is to store what html element you're trying to traget
         */
        ctx : '',


        /**
         * @private
         * @property    {Object} data default setup for the data for chart.js
         * @name        data
         * @default     data
         * @description default setup for the data for chart.js
         */
        data : {
            labels: lbls,
            datasets: [{
                type:'bar',
                label: "Temperature (°C)",
                backgroundColor: "rgba(255,146,57,0.75)",
                borderColor: "rgba(255,146,57,0.75)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,146,57,0.9)",
                hoverBorderColor: "rgba(255,146,57,0.9)",
                data: []
            }]
        },


        /**
         * @private
         * @property    {Object} options default setup for the options for chart.js
         * @name        options
         * @default     options
         * @description default setup for the options for chart.js
         */
        options : {
            responsive: true,
            title: {
                display: true,
                text: "Temperature Chart",
                fontSize: 24
            },
            tooltips: {
                mode: 'index'
            },
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: false,
                    gridLines: {
                        display: true,
                        color: "rgba(253,168,99,0.2)"
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            },
            legend: {
                onClick: null
            },
        },


        /**
         * @private
         * @function
         * @name        isDefined
         * @param       {Object} obj the object/value that you want to test
         * @return      {Boolean}
         * @description the purpose of this function is just to make sure that a variable is defined
         */
        isDefined : function (obj) {
            if (obj != null && typeof obj != 'undefined' && obj != '') return true;
            else return false;
        },


        /**
         * @private
         * @function
         * @name        isList
         * @param       {Object} obj the object that you want to check if it's a list or not
         * @return      {Boolean}
         * @description the purpose of this function is to see if the object is a list or not and one with
         *              a length longer than just 1
         */
        isList : function (obj) {
            try {
                if ((obj instanceof HTMLCollection || obj instanceof Array)
                    || (this.isDefined(obj.length)
                    && obj.length > 1)
                    && obj.tagName.toLowerCase() != 'select'
                ) return true;
                else return false;
            } catch (e) {
                return false; // safety feature
            }
        },


        /**
         * @private
         * @function
         * @name        setHtmlElement
         * @param       {HTML} html the html object you're trying to target
         * @return      {Void}
         * @description the purpose of this function is to set this objects target html element
         */
        setHtmlElement : function (html) {
            this.ctx = html;
        },


        /**
         * @private
         * @function
         * @name        resetCanvas
         * @param       {HTML} elm the NAME of the html elemnt's ID that you wish to target
         * @return      {HTML}
         * @description the purpose of this function is to just reset the canvas, it deletes the old html canvas
         *              and then creates a new one
         */
        resetCanvas : function (elm) {
            var x = document.getElementById(elm);
            var parent = x.parentNode;
            var inner = "<canvas id='" + elm + "'></canvas>";
            parent.innerHTML = inner;
            return parent.firstChild;
        },


        /**
         * @private
         * @function
         * @name        updateData
         * @param       {Int} ind        the index of the multi dimensional array that you wish to target
         * @param       {String} chartId the id of the chart that you're trying to target
         * @return      {Void}
         * @description the purpose of this function is to purely update the data, then reset the canvas
         */
        updateData : function (ind, chartId) {
            var dataList = this.data.datasets;
            if (!this.isList(this.dataBlocks[0][0])) {
                for (var i = 0, s = dataList.length; i < s;) {
                    this.data.datasets[i++].data = this.dataBlocks[ind];
                }
            } else {
                var temp = this.dataBlocks;
                var toUpdate = this.data.datasets;
                for (var i = 0, s = temp.length; i < s; i++) {
                    toUpdate[i].data = temp[i][ind];
                }
            }
            this.setHtmlElement(this.resetCanvas(chartId));
            this.renderChart();
        },


        /**
         * @private
         * @function
         * @name        getIndex
         * @param       {String} dataAttr the data attribute of swithElm
         * @param       {String} chartId  the chart itself
         * @return      {Int}
         * @description the purpseo of this function is to try different techniques to get the index of the data array
         */
        getIndex : function (swithElm, dataAttr) {
            try {
                var ind;

                if (this.isList(swithElm)) {
                    swithElm = event.target;
                }

                if (this.isDefined(swithElm.getAttribute(dataAttr))) {
                    ind = swithElm.getAttribute(dataAttr);
                } else if (this.isDefined(swithElm.dataAttr)) {
                    ind = swithElm.dataAttr;
                } else if (dataAttr == "value") {
                    ind = swithElm.value;
                } else if (this.isDefined(swithElm.options[swithElm.selectedIndex])) {
                    ind = swithElm.options[swithElm.selectedIndex];
                } else if (this.isDefined(swithElm[dataAttr])) {
                    ind = swithElm[dataAttr];
                } else if (typeof ind == 'undefined') {
                    return 0;
                } else { // fallback to ensure that a number is always returned
                    return 0;
                }

                return ind;


            } catch (e) {
                console.log(e.message);
                return 0;
            }
        },


        /**
         * @private
         * @function
         * @name        runner
         * @param       {HTML} swithElm   the html element that you want to get data from
         * @param       {String} dataAttr the data attribute of swithElm
         * @param       {String} chartId  the chart itself
         * @return      {Void}
         * @description basic function that updates the data
         */
        runner : function (swithElm, dataAttr, chartId) {
            var ind = this.getIndex(swithElm, dataAttr);
            this.updateData(ind, chartId);
        },


        /**
         * @private
         * @function
         * @name        renderChart
         * @return      {Void}
         * @description the purpose of this function is to re-render the chart when the chart has been
         *              changed to some degree or another
         */
        renderChart : function () {
            var data = this.data;
            var options = this.options;
            var set = this.data.datasets;
            var ctx = this.ctx;
            var type = set.type;


            if (set.length > 1 || !this.isDefined(type)) {
                try {
                    new Chart(ctx, {
                        type: 'bar',
                        data: data,
                        options: options
                    });
                } catch (e) {
                    console.log(e.message);
                }
            } else if (type.toLowerCase() == "bar") {
                try {
                    Chart.Bar(ctx, { data:data, options:options });
                } catch (e) {
                    new Chart(ctx).Bar( data, options );
                }
            } else if (type.toLowerCase() == "line") {
                try {
                    Chart.Line(ctx, { data:data, options:options });
                } catch (e) {
                    new Chart(ctx).Line( data, options );
                }
            } else if (type.toLowerCase() == "pie") {
                try {
                    Chart.Pie(ctx, { data:data, options:options });
                } catch (e) {
                    new Chart(ctx).Pie( data, options );
                }
            }
        },


        /**
         * @private
         * @function
         * @name        labelExists
         * @param       {String} lbl the label that you're seraching for
         * @return      {Boolean}
         * @description the purpose of this function is to scan across the labels when you want multiple charts,
         *              things can get a bit buggy without a check in advance, just to make sure that the chart doesn't
         *              get added multiple times
         */
        labelExists : function (lbl) {
            var lblArray = [];
            var sets = this.data.datasets;
            for (var i = 0, s = sets.length; i < s; i++) {
                lblArray.push(sets[i].label);
            }


            if (lblArray.length < 2) {
                return false;
            } else if (lblArray.indexOf(lbl) > -1) {
                return true;
            } else {
                return false;
            }
        },


        /**
         * @private
         * @function
         * @name        renderMultiCharts
         * @param       {Object} extra additional data elm to put into the dataset
         * @return      {Void}
         * @description the purpose of this function is to render multiple charts at the same time, ont eh same canvas
         * @todo        make this functionality a bit more discrete and solid/reliable
         */
        renderMultiCharts : function (extra) {
            if (!this.isDefined(extra)) return null;
            if (!this.isDefined(extra.label)) return null;
            var allowPush = false;
            var s = this.data.datasets.length;
            var sets = this.data.datasets;

            for (var i = 0; i < s; i++) {
                var lbl = this.data.datasets[i].label;
                if (!this.labelExists(lbl)) {
                    allowPush = true;
                    break;
                }
            }

            if (allowPush) {
                //var old = this.data.datasets.pop();
                //console.log();
                this.data.datasets.push(extra);
                //this.data.datasets.push(old);
            }
        }
    };

    /**
     * @public
     * @property    {Object} PublicObject the prupose of this property is to encapsulate some private functions
     * @name        PublicObject
     * @type        {Object}
     * @description the prupose of this property is to encapsulate some private functions
     */
    var PublicObject = {


        /**
         * @public
         * @function
         * @name        showChart
         * @param       {String} chartId   the name of the id chart element
         * @param       {String} eventType the event that updates the chart
         * @param       {HTML} swithElm    the switching elemnt
         * @param       {String} dataAttr  the data attribute(s)
         * @param       {Int} ind          the initial index that you wish to load
         * @param       {Object} extra     another setup for multi chart setup
         * @return      {Void}
         * @description the purpose of this function is to just initiate the object
         * @todo        allow for an array of extra objects to be inseted
         */
        showChart : function (chartId, eventType, swithElm, dataAttr, ind, extra) {
            /**
             * @ignore
             * @description the purpose of this little block is to just check if there's
             *              additional charts that you'd like to plot onto the same canvas
             */
            if (PrivateObject.isDefined(PrivateObject.dataBlocks[ind])
                && PrivateObject.isList(PrivateObject.dataBlocks[ind])) {
                    PrivateObject.renderMultiCharts(extra);
                    PrivateObject.updateData(ind, chartId);
            }


            /**
             * @ignore
             * @description the purpose of this little block is to check if the ind parameter
             *              is somewhat valid, it also checks to see that the options and data is valid
             *              this currently does very minor validation
             * @todo        feedback if any of the following cases fail
             */
            if (PrivateObject.isDefined(ind) && !isNaN(ind) && ind > -1) {
                PrivateObject.data.datasets[0].data = PrivateObject.dataBlocks[ind];
            } if (PrivateObject.isDefined(data) && typeof data == 'object') {
                PrivateObject.data = data;
            } if (PrivateObject.isDefined(options) && typeof options == 'object') {
                PrivateObject.options = options;
            }


            /**
             * @ignore
             * @description the purpose of this little block below is to allow an event to
             *              re-run this code when input changes
             */
            var ctx = document.getElementById(chartId).getContext("2d");
            var data = PrivateObject.data;
            var options = PrivateObject.options;
            var tempFunction = function () { PrivateObject.runner(swithElm, dataAttr, chartId) };


            /**
             * @ignore
             * @description the prupsoe of this little block is to apply the event handler to the html
             *              that has been provided to this function
             */
            PrivateObject.setHtmlElement(document.getElementById(chartId));
            PrivateObject.renderChart();
            if (PrivateObject.isList(swithElm)) {
                for (var i = 0, s = swithElm.length; i < s;) {
                    var current = swithElm[i++];
                    addEventHandler(current, eventType, tempFunction);
                }
            } else {
                if(addEventHandler(swithElm, eventType, tempFunction)) {
                    addEventHandler(swithElm, eventType, tempFunction);
                } else {
                    tempFunction();
                }
            }
        },


        /**
         * @public
         * @function
         * @name        getData
         * @return      {Object}
         * @description the purpose of this function is to return the private objects data
         *              this way the user can change it as they like
         */
        getData : function () {
            return PrivateObject.data;
        },


        /**
         * @public
         * @function
         * @name         setData
         * @param        {Object} newData the new data that will be assigned to this objects data
         * @return       {Void}
         * @description  the purpose of this function is to allow the user to edit the data outside
         *               of the object
         */
        setData : function (newData) {
            if (PrivateObject.isDefined(newData)) {
                PrivateObject.data = newData;
                PrivateObject.setHtmlElement(PrivateObject.resetCanvas((PrivateObject.ctx.id)));
                PrivateObject.renderChart();
            }
        },


        /**
         * @public
         * @function
         * @name        getOptions
         * @return      {Object}
         * @description the purpose of this function is to allow users to retrieve the options
         *              and edit them as they like
         */
        getOptions : function () {
            return PrivateObject.options;
        },


        /**
         * @public
         * @function
         * @name        setOptions
         * @param       {Object} newOptions a new set of options for the chart js
         * @return      {Void}
         * @description the purpose of this function is to allow the user to update the options as they like
         */
        setOptions : function (newOptions) {
            if (PrivateObject.isDefined(newOptions)) {
                PrivateObject.setHtmlElement(PrivateObject.resetCanvas((PrivateObject.ctx.id)));
                PrivateObject.options = newOptions;
                PrivateObject.renderChart();
            }
        }
    };


    /**
     * @description this return just outputs all of the public functions and variables
     */
    return PublicObject;
};
