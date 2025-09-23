import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader/Preloader";
import Desktop from "./components/Desktop/Desktop";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return <div className="app">{isLoading ? <Preloader /> : <Desktop />}</div>;
}

export default App;
