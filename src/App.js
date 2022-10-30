import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chart from "./components/chart";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);
  console.log("Current User: ", user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="/" element={<Chart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
