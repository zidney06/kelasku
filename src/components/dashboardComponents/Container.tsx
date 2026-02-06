"use client";

import ClassCard from "@/components/dashboardComponents/ClassCard";
import { toast, Bounce } from "react-toastify";
import AddClassComponent from "@/components/dashboardComponents/AddClassComponent";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";

interface classList {
  _id: string;
  className: string;
  subjectName: string;
  semester: string | number;
  students: string[];
}

export default function Container({
  username,
  classList,
  remainingDays,
}: {
  username: string;
  classList: classList[];
  remainingDays: number;
}) {
  const context = useContext(AppContext);

  // NOTE: useEffect akan di jalankan 2 kali dimode development jika memakai React.StrictMode
  // tapi tidak mempengaruhi hasil build
  useEffect(() => {
    if (remainingDays <= 7 && remainingDays > 0 && !context?.isShowed) {
      toast.warn(
        `Masa langganan anda akan berakhir dalam ${remainingDays} hari`,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        },
      );
      context?.setIsShowed(true);
    }
  }, [remainingDays, context]);

  return (
    <main className="p-2">
      <p>Halo {username}, selamat Datang</p>

      <AddClassComponent />

      <div className="row">
        {classList.map((item, i) => (
          <ClassCard key={item._id} item={item} i={i} />
        ))}
      </div>
    </main>
  );
}
