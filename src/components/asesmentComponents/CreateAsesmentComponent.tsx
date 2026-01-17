"use client";

import {
  type KeyboardEvent,
  type ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { confirmAlert } from "react-confirm-alert";

interface IStudent {
  _id: string;
  name: string;
  score: number;
}

export default function CreateAsesmentComponent({
  student,
  students,
  setStudents,
  i,
}: {
  student: IStudent;
  students: IStudent[];
  setStudents: Dispatch<SetStateAction<IStudent[]>>;
  i: number;
}) {
  const blockInvalidChar = (event: KeyboardEvent<HTMLInputElement>) => {
    const blockedChars = ["e", "E", "+", "-"];

    if (blockedChars.includes(event.key)) {
      event.preventDefault();
    }
  };

  const hndlNilai = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);

    const newStudents = [...students];

    newStudents[index].score = value;

    if (value < 0) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Minimal nilai adalah 0!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      newStudents[index].score = 0;
    } else if (value > 100) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Error!</h3>
            <p>Nilai maksimal adalah 100!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
      newStudents[index].score = 100;
    }
    setStudents(newStudents);
  };

  return (
    <li className="list-group-item d-sm-flex justify-content-between align-items-center">
      <p className="">{student.name}</p>

      <div className="justify-content-end d-md-flex">
        <input
          type="number"
          placeholder="Nilai"
          className="form-control"
          style={{ width: 200 }}
          onKeyDown={blockInvalidChar}
          value={student.score.toString()}
          onChange={(e) => hndlNilai(e, i)}
        />
      </div>
    </li>
  );
}
