"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface stateType {
  title: string;
  message: string;
  isShow: boolean;
}

interface AppContextType {
  state: stateType;
  setPopupState: (newState: stateType) => void;
  isShowed: boolean;
  setIsShowed: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export default function ContextProvide({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    title: "",
    message: "",
    isShow: false,
  });
  const [isShowed, setIsShowed] = useState(false);

  const setPopupState = (newState: stateType) => {
    setState(newState);
  };

  return (
    <AppContext.Provider
      value={{ state, setPopupState, isShowed, setIsShowed }}
    >
      {children}
    </AppContext.Provider>
  );
}
