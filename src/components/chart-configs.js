const Config = (Xaxis, totData, rXaxis, lXaxis, totXaxis, tot) => {
  const config = {
    title: {
      text: "Alphaa AI Waterfall Chart",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Profit", "Loss"],
    },
    xAxis: {
      type: "category",
      data: Xaxis,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Before value",
        type: "bar",
        stack: "Total",
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        barWidth: "80%",
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        data: totData,
      },
      {
        name: "Profit",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "top",
        },
        barWidth: "80%",
        data: tot < 0 ? rXaxis : lXaxis,
        itemStyle: {
          borderColor: "#89CFF0",
          color: "#89CFF0",
        },
      },
      {
        name: "Loss",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "bottom",
        },
        barWidth: "80%",
        data: tot > 0 ? rXaxis : lXaxis,
        itemStyle: {
          borderColor: "#D2042D",
          color: "#D2042D",
        },
      },
      {
        name: "total",
        type: "bar",
        stack: "Total",
        label: {
          show: true,
          position: "top",
        },
        barWidth: "80%",
        data: totXaxis,
        itemStyle: {
          borderColor: "#0000FF",
          color: "#0000FF",
        },
      },
    ],
  };
  return config;
};

export default Config;
