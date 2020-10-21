import * as React from "react";
import {
  Context,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { addCustomListener } from "./utils";

export interface BoxDefinition {
  id: string;
  type: string;
  content: Array<string>;
  source: string;
  target: string;
  labels: Array<string>;
}

export interface DataResponse {
  boxes: Array<BoxDefinition>;
}

export interface IState {
  boxes: Array<BoxDefinition>;
  search: string;
  filtered: Array<string>;
}

const State: Context<IState> = createContext({
  boxes: undefined,
  search: "",
  filtered: [],
});

export function useGlobalState() {
  return useContext(State);
}

export function useStateProvider() {
  const [state, setState] = useState<IState>({
    boxes: undefined,
    filtered: [],
    search: "",
  });

  useEffect(() => {
    const listeners = [
      addCustomListener("change-search", (evt) => {
        setState((state) => ({
          ...state,
          search: evt.detail.input,
          filtered: evt.detail.results,
        }));
      }),
      addCustomListener("reset-search", () => {
        setState((state) => ({
          ...state,
          search: "",
          filtered: state.boxes.map((m) => m.id),
        }));
      }),
    ];
    return () => listeners.forEach((dispose) => dispose());
  }, []);

  useEffect(() => {
    fetch("/data/items.json")
      .then((res) => res.json())
      .then((data: DataResponse) => {
        const boxes = data.boxes.sort((a, b) => +a.id - +b.id);
        setState((state) => ({
          ...state,
          filtered: boxes.map((m) => m.id),
          boxes,
        }));
      });
  }, []);

  return state;
}

export const GlobalStateProvider: FC = ({ children }) => {
  const state = useStateProvider();
  return <State.Provider value={state}>{children}</State.Provider>;
};
