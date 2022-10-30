import React from "react";
import { LineWave } from "react-loader-spinner";

function Loader() {
  return (
    <LineWave
      height="40vh"
      width="40vw"
      color="#89CFF0"
      ariaLabel="line-wave"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      firstLineColor=""
      middleLineColor="#0000FF"
      lastLineColor=""
    />
  );
}

export default Loader;
