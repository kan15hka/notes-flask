import React from "react";
import positiveNoteImg from "../assets/positive-note.png";
import negativeNoteImg from "../assets/negative-note.png";
import { displayMsgType } from "../helper/helper";

export default function DisplayMsg({ type, message }) {
  return (
    <div>
      <div className="mt-40 flex flex-col gap-2 items-center justify-center">
        <img
          src={
            type == displayMsgType.POSITIVE ? positiveNoteImg : negativeNoteImg
          }
          className="h-16 w-16"
        />
        <p className="text-center text-base font-semibold">{message} </p>
      </div>
    </div>
  );
}
