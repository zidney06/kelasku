"use client";

import { createContext, ReactNode, useState } from "react";

interface stateType {
  title: string;
  message: string;
  isShow: boolean;
}

interface PopupContextType {
  state: stateType;
  setPopupState: (newState: stateType) => void;
}

export const PopupContext = createContext<PopupContextType | null>(null);

export default function ContextProvide({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    title: "",
    message: "",
    isShow: false,
  });

  const setPopupState = (newState: stateType) => {
    setState(newState);
  };

  return (
    <PopupContext.Provider value={{ state, setPopupState }}>
      {children}
    </PopupContext.Provider>
  );
}
