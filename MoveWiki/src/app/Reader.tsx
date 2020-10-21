import * as React from "react";
import * as QrReader from "react-qr-reader";
import { RouteComponentProps } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "carbon-components-react";

export const Reader: React.FC<RouteComponentProps> = ({
  history,
  location,
}) => {
  const cancel = React.useCallback(
    (e: React.SyntheticEvent) => e.preventDefault(),
    []
  );
  const toHome = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      history.push("/");
    },
    [history]
  );

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem href="/" onClick={toHome}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href={location.pathname} onClick={cancel}>
          Reader
        </BreadcrumbItem>
      </Breadcrumb>
      <QrReader
        delay={300}
        onError={(err) => {
          console.log(err);
        }}
        onScan={(data) => {
          if (data && data.startsWith("@orga/move-wiki:")) {
            const [, id] = data.split(":");
            history.replace(`/box/${id}`);
          }
        }}
        style={{ width: "100%" }}
      />
    </>
  );
};

export default Reader;
