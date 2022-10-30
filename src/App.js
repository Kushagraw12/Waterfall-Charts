import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@mui/material";
import lodash from "lodash";
import SummaryBox from "./components/summary";
import Chart from "./components/chart";
import ChartConfig from "./components/chart-configs";
import Loader from "./components/loader";
import axios from "axios";
import "./App.css";

function App() {
  // Initial States
  const [data, setData] = useState(null);
  const [chartConfig, setChartConfig] = useState({});
  const [lo, setLo] = useState(0);
  const [pro, setPro] = useState(0);
  const [shown, setShown] = useState(false);

  const api_url =
    "https://run.mocky.io/v3/e2ffac92-48e0-4826-a59f-bf76fc727383";

  let dataD = lodash.get(data, "data", []);
  let xal = [];
  let xan = [];
  let xap = [];
  let xac = [];
  let tot = 0;

  // Cleaning the Data
  const helper = () => {
    tot = 0;
    let totpro = 0;
    let totlos = 0;
    let profitArr = [];
    let lossArr = [];
    let xak = "";
    let yak1 = "";
    let yak2 = "";

    if (dataD && dataD.length > 0) {
      let ok = false;
      for (let [key, value] of Object.entries(dataD[0])) {
        console.log(value);
        let parameter = lodash.find(lodash.get(data, "parameters", {}), {
          key: key,
        });
        if (parameter && parameter.type === "columns") {
          xak = key;
        } else {
          if (ok === false) {
            yak1 = key;
            ok = true;
          } else {
            yak2 = key;
          }
        }
      }
    }
    for (let i = 0; i < dataD.length; i++) {
      let prevYearVal = lodash.get(dataD[i], yak1, 0);
      let currYearVal = lodash.get(dataD[i], yak2, 0);
      tot += currYearVal - prevYearVal;
      if (currYearVal > prevYearVal) {
        totpro += currYearVal - prevYearVal;
        profitArr.push([
          currYearVal - prevYearVal,
          lodash.get(dataD[i], xak, ""),
        ]);
      } else {
        totlos += prevYearVal - currYearVal;
        lossArr.push([
          prevYearVal - currYearVal,
          lodash.get(dataD[i], xak, ""),
        ]);
      }
    }
    setPro(totpro);
    setLo(totlos);
    helper2(profitArr, lossArr, tot);
  };

  // For Sorting as per requirement
  const helper2 = (pro, lo, totalSum) => {
    xal = [];
    xan = [];
    xap = [];
    // negative difference
    if (totalSum < 0) {
      pro.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] < b[0] ? -1 : 1;
        }
      });
      lo.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] > b[0] ? -1 : 1;
        }
      });
      for (let i = 0; i < lo.length; i++) {
        xan.push(lo[i][0].toFixed(2));
        xal.push(lo[i][1]);
      }
      for (let i = 0; i < pro.length; i++) {
        xap.push(pro[i][0].toFixed(2));
        xal.push(pro[i][1]);
      }
    }
    // positive difference
    else {
      pro.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] > b[0] ? -1 : 1;
        }
      });
      lo.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] < b[0] ? -1 : 1;
        }
      });
      for (let i = 0; i < pro.length; i++) {
        xan.push(Number(pro[i][0]).toFixed(2));
        xal.push(pro[i][1]);
      }
      for (let i = 0; i < lo.length; i++) {
        xap.push(Number(lo[i][0]).toFixed(2));
        xal.push(lo[i][1]);
      }
    }
    helper3();
  };

  // Make Axis
  const helper3 = () => {
    let totalData = [0];
    const llen = xan.length,
      rlen = xap.length;
    // Total Length for the final Bar
    let tlen = llen + rlen;
    tlen++;

    for (let i = 0; i < tlen; i++) {
      if (i < llen) {
        xap.unshift("-");
        if (i > 0) {
          totalData[i] = Number(xan[i - 1]) + totalData[i - 1];
        }
      } else {
        xan.push("-");
        totalData[i] = totalData[i - 1] - Number(xap[i]);
      }
      if (i === llen) {
        totalData[i] = totalData[i] + Number(xan[llen - 1]);
      }
    }
    xal.push("Total");
    xac = [];
    for (let i = 0; i < xap.length; i++) {
      xac.push("-");
    }
    xac.push(Number(totalData[xap.length - 1]).toFixed(2));
    const config = ChartConfig(xal, totalData, xap, xan, xac, tot);
    setChartConfig(config);
  };

  // Calling the api and fetching data on loading!
  useEffect(() => {
    axios
      .get(api_url)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .then(() => {
        console.log(data);
      });
  }, []);

  const handleShow = async () => {
    if (!data) {
      alert("No Data!");
      return;
    }
    setShown(!shown);
    helper();
  };
  return (
    <div className="App">
      <div className="getData">
        {!data ? (
          <div className="loader">
            <Loader />
          </div>
        ) : (
          <div className="data-show">
            {shown ? (
              <Grid container spacing={2}>
                <br />
                <Grid item xs={12} md={9}>
                  <Chart option={chartConfig} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <br />
                  <SummaryBox
                    profit={Number(pro).toFixed(2)}
                    loss={Number(lo).toFixed(2)}
                  />
                </Grid>
              </Grid>
            ) : (
              <div>
                <Typography color="text.primary">
                  The chart is ready! <br />
                </Typography>
              </div>
            )}
            <br />
            <Button
              onClick={handleShow}
              color="primary"
              variant="contained"
              className="show-btn"
            >
              {shown ? "Hide " : "Show "}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
