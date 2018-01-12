/**
 * @file
 * @name DynamicChartJS.js
 * @author Joseph Evans <joe.evs196@hotmail.co.uk>
 * @version 0.0.3
 * @requires chart.js (RECOMMENDED:- version 2.7.1)
  * @requires classList.min.js (with the recommended version of chart.js)
 * TODO: add the ability to change chart types
 * TODO: add the ability to change the defaults (options & data)
 * BUG: this fails when using chart.js version 1.0.2 (chart.bar is not a function)
 *      it appears that the options are seupt differently
 *      the bug just appears that the options don't seem to work, nor does the styling
 * @copyright Joseph Evans
 * @license MIT-License
 */

/**
 * @description the purpose of this minified block below is to add spport for IE9
 *              without it, chart.js fails because IE9 doesn't support classlist
 * @tutorial <http://purl.eligrey.com/github/classList.js/blob/master/classList.js>
 */
"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||!function(t){"use strict";if("Element"in t){var e="classList",n="prototype",i=t.Element[n],s=Object,r=String[n].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[n].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1},c=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},a=function(t,e){if(""===e)throw new c("SYNTAX_ERR","The token must not be empty.");if(/\s/.test(e))throw new c("INVALID_CHARACTER_ERR","The token must not contain space characters.");return o.call(t,e)},l=function(t){for(var e=r.call(t.getAttribute("class")||""),n=e?e.split(/\s+/):[],i=0,s=n.length;s>i;i++)this.push(n[i]);this._updateClassName=function(){t.setAttribute("class",this.toString())}},u=l[n]=[],h=function(){return new l(this)};if(c[n]=Error[n],u.item=function(t){return this[t]||null},u.contains=function(t){return~a(this,t+"")},u.add=function(){var t,e=arguments,n=0,i=e.length,s=!1;do t=e[n]+"",~a(this,t)||(this.push(t),s=!0);while(++n<i);s&&this._updateClassName()},u.remove=function(){var t,e,n=arguments,i=0,s=n.length,r=!1;do for(t=n[i]+"",e=a(this,t);~e;)this.splice(e,1),r=!0,e=a(this,t);while(++i<s);r&&this._updateClassName()},u.toggle=function(t,e){var n=this.contains(t),i=n?e!==!0&&"remove":e!==!1&&"add";return i&&this[i](t),e===!0||e===!1?e:!n},u.replace=function(t,e){var n=a(t+"");~n&&(this.splice(n,1,e),this._updateClassName())},u.toString=function(){return this.join(" ")},s.defineProperty){var f={get:h,enumerable:!0,configurable:!0};try{s.defineProperty(i,e,f)}catch(p){void 0!==p.number&&-2146823252!==p.number||(f.enumerable=!1,s.defineProperty(i,e,f))}}else s[n].__defineGetter__&&i.__defineGetter__(e,h)}}(self),function(){"use strict";var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var n,i=arguments.length;for(n=0;i>n;n++)t=arguments[n],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:n.call(this,t)}}"replace"in document.createElement("_").classList||(DOMTokenList.prototype.replace=function(t,e){var n=this.toString().split(" "),i=n.indexOf(t+"");~i&&(n=n.slice(i),this.remove.apply(this,n),this.add(e),this.add.apply(this,n.slice(1)))}),t=null}());

 window.ready = function(callBack) {
     try {
       setTimeout(addEventHandler(document, "DOMContentLoaded", callBack), 20);
     } catch (e) {
       addEventHandler(document, "DOMContentLoaded", callBack);
       console.log(e.message);
     }
 };



/**
 * @class DynamicChart the purpose of this class is to work along side chart.js,
 *        allowing the user to input some html element, and update the chart
 * @param {String} chartType = the chart type that you want to maybe change to
 * @required @param {Multi Dimensional Array[Int]} mda  = multi dimensional array, an example has been provided below.
 * @required @param {Array[String]} labels = an array of labels
 * @return {Object}
 */
function DynamicChart (mda, lbls, chartType) {


    /**
     * @private addEventHandler
     * @required @param {HTML Object} elem = the html element that you wish to target
     * @required @param {String} eventType = the event that you want the action to occur on
     * @required @param {Function} handler = the callback function
     */
    var addEventHandler = function (elem, eventType, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(eventType, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + eventType, handler);
        }
    };


    /**
     *  @private NOTE: this is just an object which houses the @private functions
     * the data amd options below are default, I should implement a way to changed
     * these
     * @class PrivateObject
     */
    var PrivateObject = {
        /**
         * @private temp place to hold the data for the data attribtue below
         * BUG: the reason why this is here is due to the fact that it was a bit buggy with chart js
         */
        dataBlocks : mda,


        /**
         * @private this is the objects chart reference
         */
        ctx : '',


        /**
         * @private default setup for the data for chart.js
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
         * @private default setup for the options for chart.js
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
         * @private isDefined
         * NOTE: the purpose of this function is just to make sure that a variable is defined
         * @required @param {*} onj = the object/value that you want to test
         * @return {Boolean}
         */
        isDefined : function (obj) {
            if (obj != null && typeof obj != 'undefined' && obj != '') return true;
            else return false;
        },


        /**
         * @private isList
         * NOTE: the purpose of this function is to see if the object is a list of objects or not
         * @required @param {HTML Object}
         * @return {Boolean}
         */
        isList : function (obj) {
            if ((obj instanceof HTMLCollection || obj instanceof Array)
                || (this.isDefined(obj.length)
                && obj.length > 1)
                && obj.tagName.toLowerCase() != 'select'
            ) return true;
            else return false;
        },


        /**
         * @private setHtmlElement
         * NOTE: the purpose of this function is to set this objects target html element
         * @required @param {HTML Object}
         * @return {Void}
         */
        setHtmlElement : function (html) {
            this.ctx = html;
        },

        /**
         * @private resetCanvas
         * NOTE: the purpose of this function is to just reset the canvas, it deletes the old html canvas
         *       and then creates a new one
         * @required @param {HTML Object} elm = the NAME of the html elemnt's ID that you wish to target
         * @return {HTML Object}
         */
        resetCanvas : function (elm) {
            var x = document.getElementById(elm);
            var parent = x.parentNode;
            var inner = "<canvas id='" + elm + "'></canvas>";
            parent.innerHTML = inner;
            return parent.firstChild;
        },


        /**
         * @private updateData
         * NOTE: the purpose of this function is to purely update the data, then reset the canvas
         * @required @param {Int} ind = the index of the multi dimensional array that you wish to target
         * @required @param {String} chartId = the id of the chart that you're trying to target
         * @return {Void}
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
         * @private getIndex
         * NOTE: the purpseo of this function is to try different techniques to get the index of the data array
         * @required @param {String} dataAttr = the data attribute of swithElm
         * @required @param {String} chartId =  the chart itself
         * @return {Int}
         */
        getIndex : function (swithElm, dataAttr) {
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
        },

        /**
         * @private runner
         * NOTE: basic function that updates the data
         * @required @param {HTML Object} swithElm = the html element that you want to get data from
         * @required @param {String} dataAttr = the data attribute of swithElm
         * @required @param {String} chartId =  the chart itself
         * @return {Void}
         */
        runner : function (swithElm, dataAttr, chartId) {
            var ind = this.getIndex(swithElm, dataAttr);
            this.updateData(ind, chartId);
        },


        /**
         * @private renderChart
         * NOTE: the  purpose of this function is to re-render the chart
         * @return {Void}
         */
        renderChart : function () {
            var data = this.data;
            var options = this.options;
            var set = this.data.datasets;
            var ctx = this.ctx;
            var type = set.type;


            // BUG: this is where the bug i mentioned above occurs, it's a partial fix at least, rather than
            //      have the code come to a stand still at least.
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
         * @private labelExists
         * NOTE: the purpose of this function is to scan across the labels when you want multiple charts
         * @return {Boolean}
         */
        labelExists : function (x) {
            var lblArray = [];
            var sets = this.data.datasets;
            for (var i = 0, s = sets.length; i < s; i++) {
                lblArray.push(sets[i].label);
            }


            if (lblArray.length < 2) {
                return false;
            } else if (lblArray.indexOf(x) > -1) {
                return true;
            } else {
                return false;
            }
        },


        /**
         * @private renderMultiCharts
         * NOTE: the purpose of this function is to render multiple charts at the same time, ont eh same canvas
         * TODO: make this functionality a bit more discrete and solid/reliable
         * @required @param {Object} extra = additional data elm to put into the dataset
         * @return {Void}
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

            if (allowPush) {this.data.datasets.push(extra); }
        }
    };

    /**
     * @public NOTE: this just contains all of the @public functions that you'd like to return
     * @class PublicObject
     * @type {Object}
     */
    var PublicObject = {


        /**
         * @public showChart
         * NOTE: the purpose of this function is to just initiate the object
         * TODO: allow for an array of extra objects to be inseted
         * @required @param {String} chartId = the name of the id chart element
         * @required @param {String} eventType = the event that updates the chart
         * @required @param {HTML Object} swithElm = the switching elemnt
         * @required @param {String} dataAttr = the data attribute(s)
         * @param {Int} ind = the initial index that you wish to load
         * @param {Object} extra = another setup for multi chart setup
         * @return {Void}
         */
        showChart : function (chartId, eventType, swithElm, dataAttr, ind, extra) {
            /**
             * NOTE: allows to run multiple charts on the same canvas
             * TODO: make more discrete & encapsulated
             */
            if (PrivateObject.isDefined(PrivateObject.dataBlocks[ind])
                && PrivateObject.isList(PrivateObject.dataBlocks[ind])) {
                    PrivateObject.renderMultiCharts(extra);
                    PrivateObject.updateData(ind, chartId);
            }


            if (PrivateObject.isDefined(ind) && !isNaN(ind) && ind > -1) {
                PrivateObject.data.datasets[0].data = PrivateObject.dataBlocks[ind];
            } if (PrivateObject.isDefined(data) && typeof data == 'object') {
                PrivateObject.data = data;
            } if (PrivateObject.isDefined(options) && typeof options == 'object') {
                PrivateObject.options = options;
            }


            var ctx = document.getElementById(chartId).getContext("2d");
            var data = PrivateObject.data;
            var options = PrivateObject.options;
            var tempFunction = function () { PrivateObject.runner(swithElm, dataAttr, chartId) };


            PrivateObject.setHtmlElement(document.getElementById(chartId));
            PrivateObject.renderChart();
            if (PrivateObject.isList(swithElm)) {
                for (var i = 0, s = swithElm.length; i < s;) {
                    var current = swithElm[i++];
                    addEventHandler(current, eventType, tempFunction);
                }
            } else {
                addEventHandler(swithElm, eventType, tempFunction);
            }
        },


        /**
         * @public getData
         * NOTE: The purpose of this function is to return the private objects data
         *       this way the user can change it as they like
         * @return {Object}
         */
        getData : function () {
            return PrivateObject.data;
        },


        /**
         * @public setData
         * NOTE: the purpose of this function is to allow the user to edit the data outside
         *      of the object
         * @required @param newData = the new data that will be assigned to this objects data
         * @return {Void}
         */
        setData : function (newData) {
            if (PrivateObject.isDefined(newData)) {
                PrivateObject.data = newData;
                PrivateObject.setHtmlElement(PrivateObject.resetCanvas((PrivateObject.ctx.id)));
                PrivateObject.renderChart();
            }
        },


        /**
         * @public getOptions
         * NOTE: the purpose of this function is to allow users to retrieve the options
         *       and edit them as they like
         * @return {Object}
         */
        getOptions : function () {
            return PrivateObject.options;
        },


        /**
         * @public
         * NOTE: the purpose of this function is to allow the user to update the options as they like
         * @required @param newOptions = a new set of options for the chart js
         * @return {Void}
         */
        setOptions : function (newOptions) {
            if (PrivateObject.isDefined(newOptions)) {
                PrivateObject.setHtmlElement(PrivateObject.resetCanvas((PrivateObject.ctx.id)));
                PrivateObject.options = newOptions;
                PrivateObject.renderChart();
            }
        }
    };


    return PublicObject;
};
