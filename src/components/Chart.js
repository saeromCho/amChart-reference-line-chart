import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import styles from '../res/style/styles.css';

const Chart = () => {
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
    valueAxis.adjustLabelPrecision = true;
    valueAxis.alwaysShowTooltip = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.labels.template.fontSize = 10;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    dateAxis.visible = false;
    valueAxis.title.visible = true;
    
    series.dataFields.valueY = "visits";
    series.dataFields.valueX='value';
    series.minBulletDistance = 10;
    series.fillOpacity = 0;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "visits";
    series2.dataFields.valueX='value';
    series2.minBulletDistance = 10;
    series2.fillOpacity = 0;//0.1;

    let seriesRange = valueAxis.createSeriesRange(series);
    valueAxis.title.text = 0;

    let seriesRange2 = valueAxis.createSeriesRange(series2);

    let pattern = new am4core.LinePattern();//.LinePattern();
    pattern.rotation = -45;
    pattern.width = 1000;
    pattern.height = 1000;
    pattern.gap = 10;

    // Add scrollbar
    // chart.scrollbarX = new am4core.Scrollbar();

    // add range
    let range = valueAxis.axisRanges.push(new am4charts.AxisDataItem());
    range.grid.stroke = chart.colors.getIndex(0);
    range.grid.strokeOpacity = 1;
    range.bullet = new am4core.ResizeButton();
    range.bullet.background.fill = chart.colors.getIndex(0);
    range.bullet.background.states.copyFrom(chart.zoomOutButton.background.states);
    range.bullet.adapter.add("minY", function(minY, target) {
      target.maxY = chart.plotContainer.maxHeight;
      target.maxX = chart.plotContainer.maxWidth;
      return chart.plotContainer.maxHeight;
    })
    range.label.valign = 'left';
    range.label.disabled = false;

    let range2 = valueAxis.axisRanges.push(new am4charts.AxisDataItem());
    valueAxis.adjustLabelPrecision = true;
    range2.value = chart.data[chart.data.length - 1].value;//200;
    range2.grid.stroke = chart.colors.getIndex(0);
    range2.grid.strokeOpacity = 1;
    range2.bullet = new am4core.ResizeButton();
    range2.bullet.background.fill = chart.colors.getIndex(0);
    range2.bullet.background.states.copyFrom(chart.zoomOutButton.background.states);
    range2.setLocation(1)
    range2.bullet.adapter.add("minY", function(minY, target) {
      target.maxY = chart.plotContainer.maxHeight;
      target.maxX = chart.plotContainer.maxWidth;
      return chart.plotContainer.maxHeight;
    })
    range2.label.valign = 'right';
    range2.label.disabled = false;

    range.bullet.events.on("dragged", function() {
      range.value = valueAxis.xToValue(range.bullet.pixelX);
      seriesRange.value = range.value;
      seriesRange.text = range.value;
      secondValue = range.value;
      diffValueText = firstValue - secondValue;
      valueAxis.title.text = diffValueText.toFixed(0);
      valueAxis.renderer.showTooltipOn = 'always';
      valueAxis.showSystemTooltip = true;
      valueAxis.renderer.showSystemTooltip = true;
      valueAxis.renderer.tooltipPosition = 'fixed';
      valueAxis.renderer.tooltipLocation = 0;
      valueAxis.renderer.tooltipText = secondValue.toFixed(2) + '\t\t\t\t\t\t\t' + firstValue.toFixed(2);

      range2.label.text = firstValue.toFixed(2);
      range.label.text = secondValue.toFixed(2);
    })

    range2.bullet.events.on("dragged", function() {
      range2.value = valueAxis.xToValue(range2.bullet.pixelX);
      seriesRange2.value = range2.value;
      seriesRange2.text = range2.value;
      
      firstValue = range2.value;
      diffValueText = firstValue - secondValue;
      valueAxis.title.text = diffValueText.toFixed(0);
      valueAxis.renderer.showTooltipOn = 'always';

      valueAxis.showSystemTooltip = true;
      valueAxis.renderer.showSystemTooltip = true;

      valueAxis.renderer.tooltipPosition = 'fixed';
      valueAxis.renderer.tooltipLocation = 0;
      valueAxis.renderer.tooltipText = secondValue.toFixed(2) + '\t\t\t\t\t\t\t' + firstValue.toFixed(2);
      range2.label.text = firstValue.toFixed(2);
      range.label.text = secondValue.toFixed(2);
    })
    
    diffValueText = seriesRange.value - seriesRange2.value;
    seriesRange.setLocation = 0;
    seriesRange2.setLocation = 190;
    seriesRange.setWorkingLocation = 0;
    seriesRange2.setWorkingLocation = 190;

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
    for (var i = 0; i < 300; i++) {
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
    {chart !== null && console.log(chart)}
    <div id='amchartDiv' className={styles.amchartDiv}>
      웹
      {chart}
    </div>
    </>
  )
}

export default Chart;