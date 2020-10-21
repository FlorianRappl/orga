import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Loading } from "carbon-components-react";
import { useGlobalState } from "./State";

const Home = React.lazy(() => import("./Home"));
const Details = React.lazy(() => import("./Details"));
const Reader = React.lazy(() => import("./Reader"));

export const Router: React.FC = () => {
  const state = useGlobalState();

  if (!state.boxes) {
    return <Loading description="Loading data ..." />;
  }

  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading description="Loading page ..." />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/box/:id" component={Details} />
          <Route exact path="/qrcode" component={Reader} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
