import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const Summary = ({ profit, loss }) => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography
            sx={{ fontSize: 20, fontWeight: "bold" }}
            color="text.secondary"
            gutterBottom
          >
            Summary
          </Typography>
          <Typography variant="body2">
            <div className="dataEntry">
              <h5>Profit</h5>
              <h5>{profit}</h5>
            </div>
            <div className="dataEntry">
              <h5>Loss</h5>
              <h5>{loss}</h5>
            </div>
            <div className="dataEntry">
              <h5>Difference</h5>
              <h5>{Number(profit) - Number(loss)}</h5>
            </div>
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default Summary;
