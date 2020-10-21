import * as React from "react";
import { Router } from "./Router";
import {
  Content,
  Header,
  HeaderGlobalBar,
  HeaderName,
} from "carbon-components-react";

export const Layout: React.FC = () => (
  <>
    <Header aria-label="MoveWiki">
      <HeaderName prefix="Move">Wiki</HeaderName>
      <HeaderGlobalBar>
        {/* <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
          <Search20 />
        </HeaderGlobalAction> */}
      </HeaderGlobalBar>
    </Header>
    <Content>
      <Router />
    </Content>
  </>
);
