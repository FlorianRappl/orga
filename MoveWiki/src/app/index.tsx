import "./style.scss";
import * as React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { savePrompt } from "./Install";

window.addEventListener("load", () => {
  render(<App />, document.querySelector("#app"));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
});

window.addEventListener("beforeinstallprompt", (e: any) => {
  e.preventDefault();
  savePrompt(e);
});
