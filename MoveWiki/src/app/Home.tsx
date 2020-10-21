import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { History } from "history";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tooltip,
} from "carbon-components-react";
import { BoxDefinition, useGlobalState } from "./State";
import { emitCustomEvent } from "./utils";

interface AvailableBoxesProps {
  rows: Array<BoxDefinition>;
  all: Array<BoxDefinition>;
  history: History;
  search: string;
  description: React.ReactNode;
}

const headers = [
  {
    header: "ID",
    key: "id",
  },
  {
    header: "Type",
    key: "type",
  },
  {
    header: "Source",
    key: "source",
  },
  {
    header: "Target",
    key: "target",
  },
  {
    header: "",
    key: "content",
  },
  {
    header: "",
    key: "labels",
  },
];

const emptyHeaders = headers.filter((m) => m.header === "").map((m) => m.key);

function isAvailable(value: any, input: string) {
  if (Array.isArray(value)) {
    value = value.join("\n");
  }

  return `${value}`.toLowerCase().includes(input);
}

function getFilter(input: string) {
  const search = input.toLowerCase();
  return (box: BoxDefinition) =>
    headers.some(({ key }) => isAvailable(box[key], search));
}

function changeSearch(input: string, rows: Array<BoxDefinition>) {
  const results = rows.filter(getFilter(input)).map((box) => box.id);

  emitCustomEvent("change-search", {
    input,
    results,
  });
}

const AvailableBoxes: React.FC<AvailableBoxesProps> = ({
  history,
  rows,
  all,
  search,
  description,
}) => {
  const runSearch = React.useCallback(
    (ev) => changeSearch(ev.currentTarget?.value ?? "", all),
    [all]
  );

  return (
    <DataTable rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getToolbarProps,
        getTableProps,
        getTableContainerProps,
      }) => (
        <TableContainer
          title="Overview"
          description={description}
          {...getTableContainerProps()}
        >
          <TableToolbar {...getToolbarProps()}>
            <TableToolbarContent>
              <TableToolbarSearch
                tabIndex={0}
                persistent
                value={search}
                onChange={runSearch}
              />
              <Button
                onClick={() => history.push("/qrcode")}
                size="small"
                kind="primary"
              >
                Scan Box
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHeader
                    key={i}
                    {...getHeaderProps({ header })}
                    hidden={!header.header}
                  >
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={i}
                  {...getRowProps({ row })}
                  onClick={() => history.push(`/box/${row.id}`)}
                >
                  {row.cells.map((cell) => (
                    <TableCell
                      key={cell.id}
                      hidden={emptyHeaders.includes(cell.info.header)}
                    >
                      {cell.value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const { search, filtered, boxes } = useGlobalState();
  const cancel = React.useCallback(
    (e: React.SyntheticEvent) => e.preventDefault(),
    []
  );

  const rows = React.useMemo(
    () => boxes.filter((box) => filtered.includes(box.id)),
    [boxes, filtered]
  );

  const description = React.useMemo(() => {
    const allRows = boxes.length;
    const nextId = +(boxes[allRows - 1]?.id || "0") + 1;

    return (
      <Tooltip triggerText={`of all moving boxes`}>
        <p>In total there are {allRows} registered boxes.</p>
        <p>The next free ID for registration is {nextId}.</p>
      </Tooltip>
    );
  }, [boxes]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem isCurrentPage href="/" onClick={cancel}>
          Home
        </BreadcrumbItem>
      </Breadcrumb>
      <AvailableBoxes
        rows={rows}
        all={boxes}
        history={history}
        search={search}
        description={description}
      />
    </>
  );
};

export default Home;
