import React from 'react'

export default function InputBox({type, id, placeholder, width, readOnly=false}) {
  return (
    <div id={`${id}-box`} className={`py-1 ${width}`}>
    <span className={` flex items-center h-6 border  ${ readOnly ? "bg-read-only":"bg-white"} ${width}`}>
      <input type={type} readOnly={readOnly} className={`w-full h-3 text-xs p-2 ${ readOnly ? "bg-read-only":"bg-white"}`} id={id} placeholder={placeholder} />
    </span>
  </div>
  )
}
