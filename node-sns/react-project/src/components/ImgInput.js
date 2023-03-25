import React from "react";

export default function ImgInput({title,id,frontPH,src,type}) {
  return (
    <div className=" mb-3">
      <p className=" font-bold text-xs">{title}</p>
      <span className=" my-1 flex h-6 w-52 border justify-between bg-white items-center">
        <input type={type} className="w-full h-3 text-xs p-2" id={id} placeholder={frontPH} />
        <img className="pr-3 h-3 justify-self-end backdrop-opacity-60" src={src} alt=""/>
      </span>
    </div>
  );
}
