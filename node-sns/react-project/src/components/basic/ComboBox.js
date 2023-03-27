import React from "react";

export default function ComboBox({ contents, width, title }) {
  
  return (
    <div className=" mb-3">
      <p className=" font-bold text-xs ">{title}</p>
      <div
        className={`flex h-6 my-1 border text-ssx items-center bg-white ${width}`}
      >
        <select className={`inline-block h-3 w-full `} name="month">
          {contents.map((data) => (
            <option value={data.value}>{data.face}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
