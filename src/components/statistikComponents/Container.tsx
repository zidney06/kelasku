"use client";

import { useState } from "react";
import PresensiSiswaComponent from "./PresensiSiswaComponent";
import NilaiSiswaComponent from "./NilaiSiswaComponent";

interface IStudent {
  _id: string;
  name: string;
  absence: number;
  permission: number;
  attendance: number;
  total: number;
  scores: number[];
  average: number;
}

export default function Container({ students }: { students: IStudent[] }) {
  const [isPresence, setIsPresence] = useState<boolean>(true);

  return (
    <>
      {isPresence ? (
        <PresensiSiswaComponent
          students={students}
          isPresence={isPresence}
          setIsPresence={setIsPresence}
        />
      ) : (
        <NilaiSiswaComponent
          students={students}
          isPresence={isPresence}
          setIsPresence={setIsPresence}
        />
      )}
    </>
  );
}
