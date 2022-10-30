import React, { useState, forwardRef, useEffect } from "react";
import { Button, TextField, Snackbar, Grid } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import lodash from "lodash";
import "./App.css";
import Summary from "./components/summary";
import Chart from "./components/chart";
import ChartConfig from "./components/chart-configs";
import axios from "axios";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  // Input States
  const [inputJson, setInputJson] = useState(null);
  const [inputData, setInputData] = useState(null);

  //Alert States
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Chart States
  const [chartConfig, setChartConfig] = useState({});
  const [loss, setLoss] = useState(0);
  const [profit, setProfit] = useState(0);

  // Getting the data other than metadata which is the actual representational data.
  let representationData = lodash.get(inputData, "data", []);

  let X_Axis_labels = [];
  let X_Axis_neg = [];
  let X_Axis_pos = [];
  let X_Axis_complete = [];
  let netSum = 0;

  const RefineJSON_Input = () => {
    console.log(inputData);
    console.log(inputJson);
    netSum = 0;

    let netProfit = 0;
    let netLoss = 0;
    let profitArr = [];
    let lossArr = [];

    let X_Axis_Key = "";
    let Y_Axis_Key_1 = "";
    let Y_Axis_Key_2 = "";

    if (representationData && representationData.length > 0) {
      let flag = false;
      for (let [key, value] of Object.entries(representationData[0])) {
        let parameter = lodash.find(lodash.get(inputData, "parameters", {}), {
          key: key,
        });
        if (parameter && parameter.type === "columns") {
          X_Axis_Key = key;
        } else {
          if (flag === false) {
            Y_Axis_Key_1 = key;
            flag = true;
          } else {
            Y_Axis_Key_2 = key;
          }
        }
      }
    }

    for (let i = 0; i < representationData.length; i++) {
      let prevYearVal = lodash.get(representationData[i], Y_Axis_Key_1, 0);
      let currYearVal = lodash.get(representationData[i], Y_Axis_Key_2, 0);

      netSum += currYearVal - prevYearVal;

      if (currYearVal > prevYearVal) {
        netProfit += currYearVal - prevYearVal;
        profitArr.push([
          currYearVal - prevYearVal,
          lodash.get(representationData[i], X_Axis_Key, ""),
        ]);
      } else {
        netLoss += prevYearVal - currYearVal;
        lossArr.push([
          prevYearVal - currYearVal,
          lodash.get(representationData[i], X_Axis_Key, ""),
        ]);
      }
    }

    setProfit(netProfit);
    setLoss(netLoss);
    sortGroup(profitArr, lossArr, netSum);
  };
  const sortGroup = (profit, loss, totalSum) => {
    X_Axis_labels = [];
    X_Axis_neg = [];
    X_Axis_pos = [];

    if (totalSum < 0) {
      profit.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] < b[0] ? -1 : 1;
        }
      });

      loss.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] > b[0] ? -1 : 1;
        }
      });

      for (let i = 0; i < loss.length; i++) {
        X_Axis_neg.push(loss[i][0].toFixed(2));
        X_Axis_labels.push(loss[i][1]);
      }

      for (let i = 0; i < profit.length; i++) {
        X_Axis_pos.push(profit[i][0].toFixed(2));
        X_Axis_labels.push(profit[i][1]);
      }
    } else {
      profit.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] > b[0] ? -1 : 1;
        }
      });

      loss.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        } else {
          return a[0] < b[0] ? -1 : 1;
        }
      });

      for (let i = 0; i < profit.length; i++) {
        X_Axis_neg.push(Number(profit[i][0]).toFixed(2));
        X_Axis_labels.push(profit[i][1]);
      }

      for (let i = 0; i < loss.length; i++) {
        X_Axis_pos.push(Number(loss[i][0]).toFixed(2));
        X_Axis_labels.push(loss[i][1]);
      }
    }

    axisTransfer();
  };

  const axisTransfer = () => {
    let totalData = [0];
    const leftXAxisLen = X_Axis_neg.length,
      rigthXAxisLen = X_Axis_pos.length;
    let totLen = leftXAxisLen + rigthXAxisLen;
    totLen++; // For total bar

    for (let i = 0; i < totLen; i++) {
      if (i < leftXAxisLen) {
        X_Axis_pos.unshift("-");
        if (i > 0) totalData[i] = Number(X_Axis_neg[i - 1]) + totalData[i - 1];
      } else {
        X_Axis_neg.push("-");
        totalData[i] = totalData[i - 1] - Number(X_Axis_pos[i]);
      }
      // handling where breakdown occurs
      if (i === leftXAxisLen) {
        totalData[i] = totalData[i] + Number(X_Axis_neg[leftXAxisLen - 1]);
      }
    }

    // Adding the total bar data to the resultant X-axis after axis transfer
    X_Axis_labels.push("Total");
    X_Axis_complete = [];
    for (let i = 0; i < X_Axis_pos.length; i++) {
      X_Axis_complete.push("-");
    }
    X_Axis_complete.push(Number(totalData[X_Axis_pos.length - 1]).toFixed(2));

    const config = ChartConfig(
      X_Axis_labels,
      totalData,
      X_Axis_pos,
      X_Axis_neg,
      X_Axis_complete,
      netSum
    );
    setChartConfig(config);
  };

  useEffect(() => {
    axios
      .get("https://run.mocky.io/v3/e2ffac92-48e0-4826-a59f-bf76fc727383")
      .then((res) => {
        console.log(res.data);
        setInputJson(res.data);
        setInputData(res.data);
      })
      .then(() => {
        console.log(inputData);
      });
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleClick = async () => {
    // if (!inputJson) {
    //   setAlertMessage(`Can't parse the empty JSON data.`);
    //   setShowAlert(true);
    //   return;
    // }
    RefineJSON_Input();
    console.log(inputData);
    // try {
    //   const obj = JSON.parse(inputJson);
    //   setInputData(obj);
    // } catch (e) {
    //   setAlertMessage(`Invalid JSON data.`);
    //   setShowAlert(true);
    // }
  };
  return (
    <div className="App">
      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <div className="dataInput">
        {!inputData ? (
          <div>Loading . . .</div>
        ) : (
          <div className="dataRepresentation">
            <Button onClick={handleClick} color="primary" variant="contained">
              Show Graph
            </Button>
            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <Chart option={chartConfig} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Summary
                  profit={Number(profit).toFixed(2)}
                  loss={Number(loss).toFixed(2)}
                />
              </Grid>
            </Grid>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
