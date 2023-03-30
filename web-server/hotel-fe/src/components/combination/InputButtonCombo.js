import React from "react";

export default function InputButtonCombo({ inputBox, buttonBox, title }) {
  return (
    <div>
      <p className=" font-bold text-xs mb-3">{title}</p>
      <div className="flex w-52 h-6 justify-between items-center">
        {inputBox}
        {buttonBox}
      </div>
    </div>
  );
}
