import React from 'react'

export default function InputBox({type, id, placeholder, width, readOnly=false}) {
  return (
    <div className={`${width}`}>
    <span className={` flex items-center my-1 h-6 border  ${ readOnly ? "bg-slate-200":"bg-white"} ${width}`}>
      <input type={type} readOnly={readOnly} className={`w-full h-3 text-xs p-2 ${ readOnly ? "bg-slate-200":"bg-white"}`} id={id} placeholder={placeholder} />
    </span>
  </div>
  )
}
