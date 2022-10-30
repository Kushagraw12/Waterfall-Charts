import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const SummaryBox = ({ profit, loss }) => {
  return (
    <div className="summary-card">
      <Card
        style={{
          border: "2px solid rgb(0, 0, 0, 0.6)",
          borderShadow: "1px rgb(0,0,0)",
        }}
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 22, fontWeight: "bold", fontStyle: "italics" }}
            color="text.primary"
          >
            Summary
          </Typography>
          <Typography variant="body2">
            <div className="data">
              <h4>Profit</h4>
              <h4>{profit}</h4>
            </div>
            <div className="data">
              <h4>Loss</h4>
              <h4>{loss}</h4>
            </div>
            <div className="data">
              <h4>Difference</h4>
              <h4>{Number(profit) - Number(loss)}</h4>
            </div>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryBox;
