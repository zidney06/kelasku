"use client";

import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

export default function Popup() {
  const context = useContext(AppContext);

  const close = () => {
    context?.setPopupState({
      isShow: false,
      title: "",
      message: "",
    });
  };

  if (context?.state.isShow === false) {
    return null;
  }

  return (
    <div className="pop-up-container d-flex justify-content-center align-items-center red">
      <div className="pop-up-box">
        <h5 className="text-dark">{context?.state.title}</h5>
        <p className="text-dark">{context?.state.message}</p>
        <button className="btn btn-danger" onClick={close}>
          close
        </button>
      </div>
    </div>
  );
}
