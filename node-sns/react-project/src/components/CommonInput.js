import React from "react";

export default function CommonInput({title,id,type,frontPH,backPH}) {
  return (
    <div className=" mb-3">
      <p className=" font-bold text-xs">{title}</p>
      <span className=" my-1 flex items-center justify-between w-52 h-6 border bg-white">
        <input type={type} className="w-28 h-3 text-xs p-2" id={id} placeholder={frontPH} />
        <span className=" inline-block pr-2 font-thin text-xs text-gray-400">
           {backPH}
        </span>
      </span>
    </div>
  );
}
