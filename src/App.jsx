import React, { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
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

  return (
    <LanguageProvider>
      <div className="app">{isLoading ? <Preloader /> : <Desktop />}</div>
    </LanguageProvider>
  );
}

export default App;
