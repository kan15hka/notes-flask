import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

export default function InputField({
  isPasswordField,
  value,
  setValue,
  placeholder,
}) {
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  return (
    <div
      className="mb-3"
      //   className={`mb-3 flex items-center bg-transparent rounded  ${
      //     isPasswordField && "border-[1.5px] pr-3 "
      //   }`}
    >
      <input
        type={!isPasswordField ? "text" : "password"}
        placeholder={placeholder}
        // className={` input-box ${!isPasswordField && "border-[1.5px]"}`}
        className="input-box "
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(target) => {
          if (target.key == "Enter") {
          }
        }}
      />
      {/* <div className="">
        {isPasswordField &&
          (isEyeOpen ? (
            <FaRegEye
              size={20}
              className="text-black cursor-pointer"
              onClick={() => {
                setIsEyeOpen(false);
              }}
            />
          ) : (
            <FaRegEyeSlash
              size={20}
              className="text-slate-500 cursor-pointer"
              onClick={() => {
                setIsEyeOpen(true);
              }}
            />
          ))}
      </div> */}
    </div>
  );
}
