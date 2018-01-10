/**
 * @file DynamicChartJS.js
 * @author Joseph Evans <joe.evs196@hotmail.co.uk>
 * @version 0.0.2
 * @requires chart.js (RECOMMENDED:- version 2.7.1)
 * TODO: add the ability to change chart types
 * TODO: add the ability to change the defaults (options & data)
 * BUG: this fails when using chart.js version 1.0.2 (chart.bar is not a function)
 *      it appears that the options are seupt differently
 *      the bug just appears that the options don't seem to work, nor does the styling
 * @copyright Joseph Evans
 * @license MIT-License
 */



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
                label: "Temps",
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
                // This will change depending on the page
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
                    alert(e.message);
                }
            } else if (type.toLowerCase() == "bar") {
                try {
                    Chart.Bar(ctx, { data, options });
                } catch (e) {
                    new Chart(ctx).Bar( data, options );
                }
            } else if (type.toLowerCase() == "line") {
                try {
                    Chart.Line(ctx, { data, options });
                } catch (e) {
                    new Chart(ctx).Line( data, options );
                }
            } else if (type.toLowerCase() == "pie") {
                try {
                    Chart.Pie(ctx, { data, options });
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
         * TODO: allow for an array of extra objects to be inserted
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
