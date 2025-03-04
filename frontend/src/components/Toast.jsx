import React from "react";
import { SiTicktick } from "react-icons/si";
import { MdOutlineError } from "react-icons/md";
import { toastType } from "../helper/helper";
import { useEffect } from "react";
export default function Toast({ isShown, message, type, onClose }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);
  return (
    <div
      className={`transition-all duration-400 absolute left-1/2 transform -translate-x-1/2 bg-white p-2 border-2 border-black rounded-lg ${
        isShown ? "opacity-100 top-5" : "opacity-0 top-0"
      }`}
    >
      <div className="flex-col items-center justify-center">
        <div
          className={`flex gap-2 items-center ${
            type == toastType.NULL
              ? "text-transparent"
              : type == toastType.SUCCESS
              ? "text-green-500"
              : "text-red-600"
          }`}
        >
          {type == toastType.NULL ? (
            <div></div>
          ) : type == toastType.SUCCESS ? (
            <SiTicktick />
          ) : (
            <MdOutlineError />
          )}
          <p className="text-xs font-semibold">
            {type == toastType.NULL
              ? ""
              : type == toastType.SUCCESS
              ? "SUCCESS"
              : "ERROR"}
          </p>
        </div>
        <p className=" text-sm">{message}</p>
      </div>
    </div>
  );
}
