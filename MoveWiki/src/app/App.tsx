import * as React from "react";
import { Install } from "./Install";
import { Layout } from "./Layout";
import { GlobalStateProvider, useStateProvider } from "./State";

export const App: React.FC = () => {
  return (
    <GlobalStateProvider>
      <>
        <Layout />
        <Install />
      </>
    </GlobalStateProvider>
  );
};
