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
let chart = null;
let diffValueText = 0;
let firstValue = 0;
let secondValue = 0;

window.onload = function() {
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  chart = am4core.create("amchartDiv", am4charts.XYChart);

  // Add data
  chart.data = generateChartData();  

  // Create axes, 둘중 하나라도 없으면 에러나네.. 안쓰이더라도 x, y 둘 다 선언해줘야 함.
  let dateAxis = chart.yAxes.push(new am4charts.ValueAxis());

  let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

  // Create series
  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "visits";
  series.dataFields.valueX='value';
  // series.strokeWidth = 1;
  series.minBulletDistance = 10;
  series.tooltipText = "{valueY}";
  series.fillOpacity = 0;//0.1;
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.fillOpacity = 0.5;
  series.tooltip.label.padding(12, 12, 12, 12)

  let series2 = chart.series.push(new am4charts.LineSeries());
  series2.dataFields.valueY = "visits";
  series2.dataFields.valueX='value';
  series2.strokeWidth = 1;
  series2.minBulletDistance = 10;
  series2.tooltipText = "{valueY}";
  series2.fillOpacity = 0;//0.1;
  series2.tooltip.pointerOrientation = "vertical";
  series2.tooltip.background.cornerRadius = 20;
  series2.tooltip.background.fillOpacity = 0.5;
  series2.tooltip.label.padding(12, 12, 12, 12)

  let seriesRange = valueAxis.createSeriesRange(series);
  valueAxis.title.text = "Litres sold (M)";
  // seriesRange.contents.strokeDasharray = "2,3";
  // seriesRange.contents.stroke = chart.colors.getIndex(8);
  // seriesRange.contents.strokeWidth = 1;

  let seriesRange2 = valueAxis.createSeriesRange(series2);
  // seriesRange2.contents.strokeDasharray = "2,3";
  // seriesRange2.contents.stroke = chart.colors.getIndex(8);
  // seriesRange2.contents.strokeWidth = 1;

  let pattern = new am4core.LinePattern();//.LinePattern();
  pattern.rotation = -45;
  // pattern.stroke = seriesRange.contents.stroke;
  pattern.width = 1000;
  pattern.height = 1000;
  pattern.gap = 10;
  // seriesRange.contents.fill = pattern;
  // seriesRange.contents.fillOpacity = 0.5;

  // seriesRange2.contents.fill = pattern;
  // seriesRange2.contents.fillOpacity = 0.5;

  // Add scrollbar
  // chart.scrollbarX = new am4core.Scrollbar();

  // add range
  let range = valueAxis.axisRanges.push(new am4charts.AxisDataItem());
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

  let range2 = valueAxis.axisRanges.push(new am4charts.AxisDataItem());
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
    // console.log('.sdfsd', valueAxis.xToValue(range.bullet.pixelX))
    // console.log('응?', range);
    range.value = valueAxis.xToValue(range.bullet.pixelX);
    // console.log('123123', seriesRange);
    seriesRange.value = range.value;
    secondValue = range.value;
    diffValueText = firstValue - secondValue;
    console.log('1111', diffValueText.toFixed(0));
    // console.log('456456', seriesRange);
    // console.log('응?@@@', range);
  })

  range2.bullet.events.on("dragged", function() {
    range2.value = valueAxis.xToValue(range2.bullet.pixelX);
    seriesRange2.value = range2.value;
    firstValue = range2.value;
    diffValueText = firstValue - secondValue;
    console.log('2222', diffValueText.toFixed(0));
  })
  
// console.log(seriesRange.value, 'seriesRange.value')
  diffValueText = seriesRange.value - seriesRange2.value;
  // console.log('seriesRange.value', seriesRange.value)
  // console.log('diffValueText');
  // console.log(diffValueText)
  let firstTime = chart.data[0].date;
  let lastTime = chart.data[chart.data.length - 1].date;
  let date = firstTime + (lastTime - firstTime) / 2;
  range.value = date;

  seriesRange.value = date;
  seriesRange.endValue = chart.data[chart.data.length - 1].date;
  
}

function generateChartData() {
  let chartData = [];
  let firstDate = 0;
  let visits = 0;
  for (var i = 0; i < 200; i++) {
    // we create date objects here. In your data, you can have date strings
    // and then set format of your dates using chart.dataDateFormat property,
    // however when possible, use date objects, as this will speed up chart rendering.
    let newDate = firstDate;
    newDate = firstDate + i;

    visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    chartData.push({
      value: newDate,
      visits: visits
    });
  }
  return chartData;
}

const Chart = () => {
  const [diffValue, setDiffValue] = useState("");
  if (isMobile) {
    return (
      <div id='amchartDiv' className={styles.amchartDiv}>
        모바일
      </div>
    )
  }
  
  return (
    <>
    {console.log('sdfsdfsdfsdfsdfsdfsdf')}
    {console.log(chart)}
    <div id='amchartDiv' className={styles.amchartDiv}>
      웹
      {chart}
    </div>
    </>
  )
}

export default Chart;