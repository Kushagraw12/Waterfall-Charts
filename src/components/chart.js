import React from "react";
import ReactCharts from "echarts-for-react";

const Chart = ({option}) => {
  return (
    <>
      <ReactCharts option={option} style={{ height: "150%", width: "100%" }} />
    </>
  );
};

export default Chart;
