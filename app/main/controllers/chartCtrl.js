/**
 * Controller to handle display of a selected chart. Basically just a skeleton
 * stub for now.
 */
angular.module('plea').controller('ChartCtrl', function($scope, mainViewState, _) {
    /**
     * $scope initialization
     */
    $scope.chart = mainViewState.selectedChart;
    // upon fetching data, this array will be filled with bare Javascript
    // objects of the form: {date: '2013-09-03', floor: 40, correct: 40, etc.}
    $scope.dailyRecords = [];

    // Fetch the Collection of DayMetric objects and group values for the same
    // date into objects.
    var dayMetricCollection = $scope.chart.getDayMetrics(function() {
        // find the range of dates these metrics span
		var datesInRange = _.uniq(dayMetricCollection.pluck('date'), true);
        // package all metric values for each respective date into the same object
		_.each(datesInRange, function(date) {
			var pkg = packageMetricValues(dayMetricCollection.where({'date': date}));
			$scope.dailyRecords.push(pkg);
		});

		_chart = new Chart();
    });

    // No need to do any extra processing to the phase lines, just expose
    // the bare collection.
    $scope.phaseLineCollection = $scope.chart.getPhaseLines();


    /**
     * Utility functions
     */

	/**
	 * Packages a group of DayMetrics that share a date together, key-indexed
	 * by their respective metric types.
	 *
	 * Note that the function assumes all input metrics have the same date.
	 *
	 * @param  {DayMetric} metrics  Array of DayMetric objects
	 * @return {Object}             Package of metric values
	 */
	function packageMetricValues(metrics) {
		if (metrics.length < 1) {
			return [];
		}

		// assume first metric date is shared by all
		var pkg = { date: metrics[0].get('date') };

		_.each(metrics, function(dayMetric) {
			var label = dayMetric.get('type');
			if (label) {
				pkg[label] = dayMetric.get('value');
			}
		});
		return pkg;
	}

	/**
	 * Celeration Chart
	 */

	function Chart() {
		this.numberOfDays = 140;
		this.minExponent = -3;
		this.maxExponent = 3;
		this.activeDay = $scope.dailyRecords.length + 1;
		//a decade is the section between two exponents of ten on the chart
		//for example, a decade could be from 1-10 or 0.01-0.1
		this.numberOfDecades = Math.abs(this.minExponent) + Math.abs(this.maxExponent);
		this.drawArea = document.getElementById('draw');
		this.init();
	}

	Chart.prototype.init = function() {
		this.setDimensions();
		this.createPaperDrawingArea();
		this.setObjects();
		this.setStyles();
		this.drawXAxis();
		this.drawYAxis();
		this.drawHistoricalData($scope.dailyRecords);
		this.createChartTouchEvents();
		this.createAdjustmentsTouchEvents();
	}

	Chart.prototype.setDimensions = function() {
		var width = window.innerWidth;
		var height = window.innerHeight * 0.9;

		//specify margins based on width and height of window
		this.bottomMargin = height * 0.05;
		this.topMargin = height * 0.075;
		this.leftMargin = width * 0.05;
		this.rightMargin = width * 0.05;

		//initialize width and height of chart based on window dimensions
		this.chartWidth = width - (this.leftMargin + this.rightMargin);
		this.chartHeight = height - (this.topMargin + this.bottomMargin);

		//set padding for number labels on chart
		this.labelPadding = this.leftMargin * 0.15;

		//set tickmark lengths
		this.baseTickLength = 8;
		this.intermediateTickLength = 5;

		//calculate height of a decade in pixels
		this.decadeHeight = this.chartHeight / this.numberOfDecades;
	}

	//initialize raphael.js 'paper' drawing area
	Chart.prototype.createPaperDrawingArea = function() {
		var that = this;
		var width = window.innerWidth;
		var height = window.innerHeight * 0.9;
		this.paper = new Raphael(that.drawArea, width, height);
	}

	Chart.prototype.setObjects = function() {
		this.metricsOrder = ['floor', 'corrects', 'errors', 'trials'];
		this.metric = {
			'corrects' : {
							'marker' : 'filled-circle',
							'metric' : null // instance of metric is stored here
						 },
			'floor' :   {
							'marker' : 'line',
							'metric' : null
					     },
			'errors' :   {
							'marker' : 'cross',
							'metric' : null
					     },
			'trials' :   {
							'marker' : 'empty-circle',
							'metric' : null
					     }
		};

		this.phaseline = {
			'phaseline' : null
		};
	}

	Chart.prototype.setStyles = function() {
		this.metricStyles = {
			'filled-circle' : 	{
									'fill-opacity': 1,
							   		'fill': '#4ABEA4',
							   		'stroke': 0,
							   		'opacity': .9
							   	},
			'line' : 			{
									'stroke-width': '1',
						 			'stroke': '#000'
						 		},
			'cross' : 			{
									'stroke-width': '1',
					    			'stroke': "#F62817",
					    			'opacity': .9
					    		},
			'empty-circle' : 	{
									'fill-opacity': 0
								}
		};
		this.phaselineStyles = {
			'phaseline' : 		{
									'stroke-width' : 1.5,
									'stroke' : '#404040'
								},
			'phaseline-floor' : {
									'text-anchor' : 'start'
								},
			'phaseline-note' : 	{
									'text-anchor' : 'middle'
								}
		}
		this.chartStyles = {
			//horizontal lines and labels
			//#A6C5D3
			'decadebaseline' : {
				'weight' : '1.1',
				'color' : '#ccc'
			},
			'decadebaselabel' : {
				'font-size' : 12,
				'text-anchor' : 'end',
				'color' : '#ccc'
			},
			'intermediateline' : {
				'weight' : '0.4',
				'color' : '#ccc'
			},
			'middleline' : {
				'weight' : '0.8',
				'color' : '#ccc'
			},
			'middlelabel' : {
				'font-size' : 10,
				'text-anchor' : 'end',
				'color' : '#ccca'
			},
			'floorlabel' : {
				'font-size' : 10,
				'text-anchor' : 'start',
				'color' : '#ccc'
			},
			// vertical lines and labels
			'weekline' : {
				'weight' : '1',
				'color' : '#ccc'
			},
			'weeklabel' : {
				'font-size' : 11,
				'text-anchor' : 'middle',
				'color' : '#ccc'
			},
			'activedayline' : {
				'weight' : '1',
				'color' : '#111'
			},
			'activedaylabel' : {
				'font-size' : 8,
				'text-anchor' : 'middle',
				'color' : '#111'
			}
		}
	}

	Chart.prototype.drawXAxis = function() {
		var lineStartX = this.leftMargin;
		var lineEndX = this.chartWidth;
		var chartBottomY = this.topMargin + this.chartHeight;

		//for each decade, draw the lines within that decade on the log scale
		for (var i = 0; i < this.numberOfDecades; i++) {
			//base values are multiples of ten
			var decadeBaseValue = Math.pow(10, this.minExponent + i);

			//find y position (pixels) for the base value of the decade
			var decadeNumber = i;
			var decadeBasePosition = chartBottomY - (decadeNumber*this.decadeHeight);

			//draw the baseline's value label
			this.drawLabel(lineStartX - this.labelPadding*1.5, decadeBasePosition, decadeBaseValue, this.chartStyles['decadebaselabel']);

			//draw floor label for baseline
			var labelText;
			var floorPadding = 62;
			if (decadeBaseValue <= 1) labelText = 1/decadeBaseValue + "'";
			else labelText = "";
			var endX = lineEndX + 1.7*this.baseTickLength;
			if (labelText === "") endX = lineEndX + this.baseTickLength;
			this.drawLabel(lineEndX + floorPadding, decadeBasePosition, labelText, this.chartStyles['floorlabel']);
			this.drawHorizontalLine(lineStartX - this.baseTickLength, endX, decadeBasePosition, this.chartStyles['decadebaseline']);

			//if we're on last decade, draw a top baseline and its label
			if (decadeNumber === (this.numberOfDecades - 1)) {
				var topDecadePosition = decadeBasePosition - this.decadeHeight;
				var topDecadeValue = Math.pow(10, this.minExponent + i + 1);
				this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + this.baseTickLength, topDecadePosition, this.chartStyles['decadebaseline']);
				this.drawLabel(lineStartX - this.labelPadding*1.5, topDecadePosition, topDecadeValue, this.chartStyles['decadebaselabel']);
			}

			//draw all lines in between baselines
			this.drawIntermediateLines(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX);
		}
	}

	Chart.prototype.drawYAxis = function() {
		var spacing = this.chartWidth/this.numberOfDays;

		var lineStartY = this.topMargin;
		var lineEndY = lineStartY + this.chartHeight;

		var startX = this.leftMargin;
		var vertLabelPadding = this.labelPadding + 10;

		for (var i = 0; i <= this.numberOfDays; i++) {
			//draw black line representing today's line
			if (i === this.activeDay) {
				this.drawLabel(startX + i*spacing, lineStartY - this.labelPadding, 'TODAY', this.chartStyles['activedaylabel']);
				this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, this.chartStyles['activedayline'], true, i);
			}

			else {
				//every 7th vertical line is bolded
				if (i%7 === 0) {
					//include tickmarks and labels on the 14th line
					if (i%14 === 0) {
						this.drawLabel(startX + i*spacing, lineEndY + vertLabelPadding, i, this.chartStyles['weeklabel']);
						this.drawVerticalLine(startX + i*spacing, lineStartY - this.baseTickLength, lineEndY + this.baseTickLength, this.chartStyles['weekline']);
					}
					else {
						this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, this.chartStyles['weekline']);
					}
				}

				//draw normal vertical lines
				else {
					this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, this.chartStyles['intermediateline']);
				}
			}
		}
	}

	//draws text (this function is used to draw numbers next to lines)
	Chart.prototype.drawLabel = function(x, y, lineValue, labelAttr) {
		var label = this.paper.text(x, y/2+2, lineValue);

		var fontSize = labelAttr['font-size'] || 15;
		var fontColor = labelAttr['color'] || '#A6C5D3';
		var textAlign = labelAttr['text-anchor'] || 'start';

		label.attr({
			'font-size': fontSize,
			'fill': fontColor,
			'text-anchor': textAlign
		});
	}

	Chart.prototype.drawHorizontalLine = function(x1, x2, y, params) {
		var deltaY = 0; //zero bc we don't want slanted lines
		var basePath = "M " + x1 + " " + y + " l " + x2 + " " + deltaY;

		//add line to the drawing area
		var line = this.paper.path(basePath);
		var lineColor = params['color'] || '#000';
		var lineWeight = params['weight'] || '1';

		line.attr({
			"stroke": lineColor,
			"stroke-width": lineWeight
		});
	}

	//get y positions for and draw lines for values in between the high baseline and the low baseline
	Chart.prototype.drawIntermediateLines = function(decadeNumber, decadeBaseValue, decadeBasePosition, x1, x2) {
		for (var j = 2; j < 10; j++) {
			var lineValue = j * decadeBaseValue;
			var intermediateLineYPosition = this.valueToYPosition(decadeBasePosition, lineValue, decadeBaseValue);
			var floorPadding = 62;

			//only draw line with ticks and labels on the fifth line in the decade
			//(this is just how the chart is designed)
			if (j === 5) {
				this.drawLabel(x1 - this.labelPadding, intermediateLineYPosition, lineValue, this.chartStyles['middlelabel']);
				this.drawHorizontalLine(x1 - this.intermediateTickLength, x2 + this.intermediateTickLength, intermediateLineYPosition, this.chartStyles['middlelabel']);
				//draw floor label
				if (lineValue < 1) {
					this.drawLabel(x2 + floorPadding, intermediateLineYPosition, 1/lineValue + "'", this.chartStyles['floorlabel']);
					this.drawHorizontalLine(x1 - this.intermediateTickLength, x2 + 2*this.intermediateTickLength, intermediateLineYPosition, this.chartStyles['middleline']);
				}
			}

			else {
				var labelText;
				if (lineValue >= 1 && lineValue <=6) labelText = 60/lineValue + '"';
				else if (lineValue === .002 || lineValue === .02 || lineValue === .2) labelText = 1/lineValue + "'";
				else labelText = "";
				var endX = x2 + this.intermediateTickLength;
				if (labelText === "") endX = x2
				this.drawLabel(x2 + floorPadding, intermediateLineYPosition, labelText, this.chartStyles['floorlabel']);
				this.drawHorizontalLine(x1, endX, intermediateLineYPosition, this.chartStyles['intermediateline']);
			}
		}
	}

	Chart.prototype.drawVerticalLine = function(x, y1, y2, params) {
		var deltaX = 0; // zero because we don't want the line to be slanted
		var deltaY = y2 - y1;
		var basePath = "M " + x + ' ' + y1 + " l " + deltaX + ' ' + deltaY;
		// add the line to the drawing area
		var line = this.paper.path(basePath);

		// get attrs to add to line. set to defaults if they're undefined
		var lineColor = params['color'] || '#000';
		var lineWeight = params['weight'] || '1';

		line.attr({"stroke-width": lineWeight,
				   "stroke": lineColor});

	}

	//takes a value and converts it to a y position on the chart
	Chart.prototype.valueToYPosition = function(baseLineYPosition, lineValue, decadeBaseValue) {
		var decadeProportion = 1 * lineValue/decadeBaseValue;
		var logDecadeProportion = log10(decadeProportion);
		var offsetFromBase = this.decadeHeight * logDecadeProportion;
		var y = baseLineYPosition - offsetFromBase;
		return y;
	}

	// converts a day (in int form, between 0 and 140 and
	// returns the x coordinate of that day line on the chart)
	Chart.prototype.dayToXPosition = function(day) {
		if ((day < 0) || (day > this.numberOfDays)) {
			return 'day out of range';
		}
		// compute based on margins and spacing. add variables from the drawYaxis function to the
		// chart object if need be
		else {
			var startX = this.leftMargin;
			var spacing = this.chartWidth/this.numberOfDays;
			var xValue = startX + day*spacing;
			return xValue;
		}
	}

	Chart.prototype.getDecadeBasePosition = function(decadeNumber) {
		var chartBottomY = this.topMargin + this.chartHeight;
		var position = chartBottomY - (decadeNumber * this.decadeHeight);
		return position;
	}

	Chart.prototype.getDecadeBaseValue = function(decadeNumber) {
		var decadeExponent = decadeNumber + this.minExponent;
		var value = Math.pow(10, decadeExponent);
		return value;
	}

	Chart.prototype.drawHistoricalData = function(dailyRecords) {
		for (var i = 0; i < dailyRecords.length; i++) {
			var dayPosition = this.dayToXPosition(i+1);
			if (dailyRecords.corrects !== null) {
				this.drawHistoricalCorrects(dayPosition, dailyRecords[i].corrects);
			}
			if (dailyRecords.errors !== null) {
				this.drawHistoricalErrors(dayPosition, dailyRecords[i].errors);
			}
			if (dailyRecords.trials !== null) {
				this.drawHistoricalTrials(dayPosition, dailyRecords[i].trials);
			}
			if (dailyRecords.floors !== null) {
				this.drawHistoricalFloors(dayPosition, dailyRecords[i].floor);
			}
		}
	}

	Chart.prototype.drawHistoricalCorrects = function(day, value) {
		var cx = day;
		var decadeNumber = 3; // default base decade for corrects
		var decadeBaseValue = this.getDecadeBaseValue(decadeNumber);
		var decadeBasePosition = this.getDecadeBasePosition(decadeNumber);
		var cy = this.valueToYPosition(decadeBasePosition, value * decadeBaseValue, decadeBaseValue);
		var radius = 3;
		var newCircle = this.paper.circle(cx, cy, radius);
		newCircle.attr(this.metricStyles['filled-circle']);
	}

	Chart.prototype.drawHistoricalErrors = function(day, value) {
		var cx = day;
		var decadeNumber = 3; //default base decade for errors
		var decadeBaseValue = this.getDecadeBaseValue(decadeNumber);
		var decadeBasePosition = this.getDecadeBasePosition(decadeNumber);
		var cy = this.valueToYPosition(decadeBasePosition, value * decadeBaseValue, decadeBaseValue);
		var radius = 3;

		// draw cross on chart, cross is drawn as two lines
		var crossPathOne = 'M '+(cx-radius)+' '+(cy-radius)+' L '+(cx+radius)+' '+(cy+radius);
		var crossPathTwo = 'M '+(cx-radius)+' '+(cy+radius)+' L '+(cx+radius)+' '+(cy-radius);
		var crossLineOne = this.paper.path(crossPathOne);
		var crossLineTwo = this.paper.path(crossPathTwo);

		// set error attributes onto cross
		var errorMetricStyles = this.metricStyles['cross'];
		crossLineOne.attr(errorMetricStyles);
		crossLineTwo.attr(errorMetricStyles);
	}

	Chart.prototype.drawHistoricalTrials = function(day, value) {
		var cx = day;
		var decadeNumber = 0; // default base decade for trials
		var decadeBaseValue = this.getDecadeBaseValue(decadeNumber);
		var decadeBasePosition = this.getDecadeBasePosition(decadeNumber);
		var cy = this.valueToYPosition(decadeBasePosition, value * decadeBaseValue, decadeBaseValue);
		var radius = 3;
		var newCircle = this.paper.circle(cx, cy, radius);
		newCircle.attr(this.metricStyles['empty-circle']);
	}

	Chart.prototype.drawHistoricalFloors = function(day, value) {
		var cx = day;
		var logValue = this.floorToLog(value);
		var decadeNumber = 3; //default base decade for floors
		var decadeBaseValue = this.getDecadeBaseValue(decadeNumber);
		var decadeBasePosition = this.getDecadeBasePosition(decadeNumber);
		var cy = this.valueToYPosition(decadeBasePosition, logValue * decadeBaseValue, decadeBaseValue);
		var radius = 3;

		var linePath = 'M '+(cx-radius)+' '+cy+' L '+(cx+radius)+' '+cy;
		var newLine = this.paper.path(linePath);
		// set floor attributes onto line
		var floorMetricStyles = this.metricStyles['line'];
		newLine.attr(floorMetricStyles);

	return newLine;
	}

	Chart.prototype.floorToLog = function(floorValue) {
		// in seconds
		return 1/(floorValue/60);
	}

	// helper to do log10 of numbers
	function log10(value) {
		return Math.log(value) / Math.LN10;
	}

	Chart.prototype.createChartTouchEvents = function() {
		var chart = this;
		this.activeMetric = 'floor';
		chart.hammertime = Hammer(document.getElementById("draw"));

		// draw point on active day line
		chart.hammertime.on("tap", function(event){
			event.preventDefault();
			document.getElementById("adjustments").style.display = "block";
			var chartBottomY = chart.chartHeight + chart.topMargin;
			var y = chartBottomY - (event.gesture.touches[0].pageY-event.target.offsetTop);

			chart.saveMetric(chart.activeMetric, y);
		});
	}

	Chart.prototype.saveMetric = function(metricName, yValue) {
		var chart = this;
		// if the metric is already on the chart, remove it
		if (chart.metric[metricName]['metric'] !== null) {
			chart.metric[metricName]['metric'].paperObject.remove();
		}
		// create a new instance of Metric for this metric
		chart.metric[metricName]['metric'] = new Metric(chart, metricName , chart.activeDay, yValue);
		$scope.chart.addDayMetric(new Date, metricName, chart.metric[metricName]['metric'].getValue());
		// update the marker on the chart
        // find it and set it to the new value
        var htmlMetricIDTag = document.getElementById(metricName);
        htmlMetricIDTag.value=chart.metric[metricName]['metric'].value;
        //$(htmlMetricID).val(chart.metric[metricName]['metric'].value);

        // highlight the corresponding setion for this metric in the adjustments panel
        var htmlAdjustmentSectionID = "#"+metricName+"-section";
        //$("htmlAdjustmentSectionID").css('background','rgba(242,242,242,.8)');
        // TODO: this should really be adding a class rather than modifying the css
        // and probably in its own "highlightMetricAdjustment" function

        var nextMetric = chart.getNextMetric(metricName);
        // if the next metric to be entered hasn't been set yet,
        if (chart.metric[nextMetric] !== undefined && chart.metric[nextMetric]['metric'] === null) {
            // set it as the active metric 
            chart.activeMetric = nextMetric;

            // and highlight that section in the adjustments panel
            //$('#adjustments').css("display", "block");
            htmlAdjustmentSectionID = "#"+metricName+"-section";
            //$(htmlAdjustmentSectionID).css('background','rgba(200,200,200,.8)');
        }
        // otherwise set the activeMetric to none
        else {
            chart.activeMetric = ' ';
        }
	}

	Chart.prototype.getMarkerForMetric = function(type) {
		return this.metric[type]['marker'];
	}

	Chart.prototype.getNextMetric = function(metricName) {
        var chart = this;
        // find this one in the list metrics in order
        var thisIndex = chart.metricsOrder.indexOf(metricName);
        var nextMetric = 'none';

        // if the next metric is within array bounds, return it
        if (thisIndex + 1 < chart.metricsOrder.length) {
            nextMetric = chart.metricsOrder[thisIndex+1];
        }
        // otherwise return the default value of 'none'
        return nextMetric;
	}

	Chart.prototype.createAdjustmentsTouchEvents = function() {
		var chart = this;
		var addNodes = document.getElementsByClassName("add");
		for (var i = 0; i < addNodes.length; i++) {
			addNodes[i].addEventListener("click", function(e){
				e.preventDefault();
				var label = this.getAttribute('id'); // get the id of the div that was clicked

				if (label === "add-correct") {
					chart.metric['corrects']['metric'].changeValueAndMarker(1);
				}

				if (label === "add-floor") {
					chart.metric['floor']['metric'].changeValueAndMarker(1);
				}

				if (label === "add-error") {
					chart.metric['errors']['metric'].changeValueAndMarker(1);
				}

				if (label === "add-trial") {
					chart.metric['trials']['metric'].changeValueAndMarker(1);
				}
			})
		}
		var subtractNodes = document.getElementsByClassName("subtract");
		for (var i = 0; i < addNodes.length; i++) {
			subtractNodes[i].addEventListener("click", function(e){
				e.preventDefault();
				var label = this.getAttribute('id'); // get the id of the div that was clicked

				if (label === "sub-correct") {
					chart.metric['corrects']['metric'].changeValueAndMarker(-1);
				}

				if (label === "sub-floor") {
					chart.metric['floor']['metric'].changeValueAndMarker(-1);
				}

				if (label === "sub-error") {
					chart.metric['errors']['metric'].changeValueAndMarker(-1);
				}

				if (label === "sub-trial") {
					chart.metric['trials']['metric'].changeValueAndMarker(-1);
				}
			})
		}
	}
});
