import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import styles from '../res/style/styles.css';

/* Chart code */
// Themes begin
// am4core.ready = function() {
window.onload = function() {
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  let chart = am4core.create("amchartDiv", am4charts.XYChart);

  // Add data
  chart.data = generateChartData();  

  // Create axes
  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "visits";
  series.dataFields.dateX = "date";
  series.strokeWidth = 1;
  series.minBulletDistance = 10;
  series.tooltipText = "{ㅁㄹㄴㄴㅇㄹㄴㅇvalueY}";
  series.fillOpacity = 0.1;
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.fillOpacity = 0.5;
  series.tooltip.label.padding(12, 12, 12, 12)

  let series2 = chart.series.push(new am4charts.LineSeries());
  series2.dataFields.valueY = "visits";
  series2.dataFields.dateX = "date";
  series2.strokeWidth = 1;
  series2.minBulletDistance = 10;
  series2.tooltipText = "{valueY}";
  series2.fillOpacity = 0.1;
  series2.tooltip.pointerOrientation = "vertical";
  series2.tooltip.background.cornerRadius = 20;
  series2.tooltip.background.fillOpacity = 0.5;
  series2.tooltip.label.padding(12, 12, 12, 12)

  let seriesRange = dateAxis.createSeriesRange(series);
  seriesRange.contents.strokeDasharray = "2,3";
  seriesRange.contents.stroke = chart.colors.getIndex(8);
  seriesRange.contents.strokeWidth = 1;

  let seriesRange2 = dateAxis.createSeriesRange(series2);
  seriesRange2.contents.strokeDasharray = "2,3";
  seriesRange2.contents.stroke = chart.colors.getIndex(1);
  seriesRange2.contents.strokeWidth = 1;

  let pattern = new am4core.LinePattern();
  pattern.rotation = -45;
  pattern.stroke = seriesRange.contents.stroke;
  pattern.width = 1000;
  pattern.height = 1000;
  pattern.gap = 6;
  seriesRange.contents.fill = pattern;
  seriesRange.contents.fillOpacity = 0.5;

  seriesRange2.contents.fill = pattern;
  seriesRange2.contents.fillOpacity = 0.5;

  // Add scrollbar
  // chart.scrollbarX = new am4core.Scrollbar();

  // add range
  let range = dateAxis.axisRanges.push(new am4charts.DateAxisDataItem());
  range.grid.stroke = chart.colors.getIndex(0);
  range.grid.strokeOpacity = 1;
  range.bullet = new am4core.ResizeButton();
  range.bullet.background.fill = chart.colors.getIndex(0);
  range.bullet.background.states.copyFrom(chart.zoomOutButton.background.states);
  range.bullet.minX = 0;
  range.bullet.adapter.add("minY", function(minY, target) {
    target.maxY = chart.plotContainer.maxHeight;
    target.maxX = chart.plotContainer.maxWidth;
    return chart.plotContainer.maxHeight;
  })

  let range2 = dateAxis.axisRanges.push(new am4charts.DateAxisDataItem());
  range2.grid.stroke = chart.colors.getIndex(0);
  range2.grid.strokeOpacity = 1;
  range2.bullet = new am4core.ResizeButton();
  range2.bullet.background.fill = chart.colors.getIndex(0);
  range2.bullet.background.states.copyFrom(chart.zoomOutButton.background.states);
  range2.bullet.minX = 0;
  range2.bullet.adapter.add("minY", function(minY, target) {
    target.maxY = chart.plotContainer.maxHeight;
    target.maxX = chart.plotContainer.maxWidth;
    return chart.plotContainer.maxHeight;
  })

  range.bullet.events.on("dragged", function() {
    range.value = dateAxis.xToValue(range.bullet.pixelX);
    seriesRange.value = range.value;
  })

  range2.bullet.events.on("dragged", function() {
    range2.value = dateAxis.xToValue(range2.bullet.pixelX);
    seriesRange.value = range2.value;
  })

  let firstTime = chart.data[0].date.getTime();
  let lastTime = chart.data[chart.data.length - 1].date.getTime();
  let date = new Date(firstTime + (lastTime - firstTime) / 2);

  range.date = date;

  seriesRange.date = date;
  seriesRange.endDate = chart.data[chart.data.length - 1].date;
  console.log('range2');
  console.log(range2)
  console.log('range');
  console.log(range)
}

function generateChartData() {
  let chartData = [];
  let firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 200);
  let visits = 1200;
  for (var i = 0; i < 200; i++) {
    // we create date objects here. In your data, you can have date strings
    // and then set format of your dates using chart.dataDateFormat property,
    // however when possible, use date objects, as this will speed up chart rendering.
    let newDate = new Date(firstDate);
    newDate.setDate(newDate.getDate() + i);

    visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

    chartData.push({
      date: newDate,
      visits: visits
    });
  }
  console.log('@@@@@');
  console.log(chartData.visits)
  return chartData;
}

function Chart () {
  console.log('sdfsdfsdf', styles);
  if (isMobile) {
    return (
      <div id='amchartDiv' className={styles.amchartDiv}>
        모바일
      </div>
    )
  }
  
  return (
    <>
    <div id='amchartDiv' className={styles.amchartDiv}>
      웹
      {/* {chart} */}
    </div>
    </>
  )
}

export default Chart;