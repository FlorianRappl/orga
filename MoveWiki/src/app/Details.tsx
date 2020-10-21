import * as React from "react";
import { RouteChildrenProps } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  InlineNotification,
  FormLabel,
  UnorderedList,
  ListItem,
  Tag,
  Button,
} from "carbon-components-react";
import { useGlobalState } from "./State";

interface InfoProps {
  id: string;
  type: string;
  source: string;
  target: string;
  content: Array<string>;
  labels: Array<string>;
}

const colors = {
  Glas: "blue",
  Keramik: "red",
};

const Info: React.FC<InfoProps> = ({
  type,
  source,
  target,
  content,
  labels,
}) => (
  <>
    <div>
      <p style={{ height: "1em" }} />
      {labels.length > 0 && (
        <>
          <div>
            <FormLabel>Labels</FormLabel>
            <br />
            {labels.map((label, i) => (
              <Tag key={i} color={colors[label]}>
                {label}
              </Tag>
            ))}
          </div>
          <p style={{ height: "1em" }} />
        </>
      )}
      <div>
        <FormLabel>Type</FormLabel>
        <br />
        <strong>{type}</strong>
      </div>
      <p style={{ height: "1em" }} />
      <div>
        <FormLabel>Source</FormLabel>
        <br />
        <strong>{source}</strong>
      </div>
      <p style={{ height: "1em" }} />
      <div>
        <FormLabel>Target</FormLabel>
        <br />
        <strong>{target || "(undetermined)"}</strong>
      </div>
      <p style={{ height: "1em" }} />
      <div>
        <FormLabel>Contents</FormLabel>
        <br />
        <UnorderedList>
          {content.map((line, i) => (
            <ListItem key={i}>{line}</ListItem>
          ))}
        </UnorderedList>
      </div>
    </div>
  </>
);

export const Details: React.FC<RouteChildrenProps<{ id: string }>> = ({
  match,
  history,
  location,
}) => {
  const { id } = match.params;
  const { boxes, filtered } = useGlobalState();
  const cancel = React.useCallback(
    (e: React.SyntheticEvent) => e.preventDefault(),
    []
  );
  const [item] = boxes.filter((m) => m.id === id);
  const toHref = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();

      if (e.target instanceof HTMLElement) {
        history.push(e.target.getAttribute("href"));
      }
    },
    [history]
  );
  const length = filtered.length;
  const index = filtered.indexOf(id) || 0;
  const previous = filtered[(length + index - 1) % length];
  const next = filtered[(length + index + 1) % length];

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem href="/" onClick={toHref}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href={location.pathname} onClick={cancel}>
          Details
        </BreadcrumbItem>
      </Breadcrumb>
      <h2>{id}</h2>
      {item && <Info {...item} />}
      {!item && (
        <InlineNotification
          title="Not Found"
          subtitle={`No box with ID "{id}" has been registered yet.`}
          kind="error"
          hideCloseButton
        />
      )}
      <br />
      {length > 1 && (
        <div className="bx--btn-set">
          <Button href={`/box/${previous}`} onClick={toHref} kind="secondary">
            Previous ({previous})
          </Button>
          <Button href={`/box/${next}`} onClick={toHref} kind="primary">
            Next ({next})
          </Button>
        </div>
      )}
    </>
  );
};

export default Details;
