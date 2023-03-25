import React from 'react'

export default function InputBox({type, id, placeholder, width}) {
  return (
    <div className=" mb-3">
    <span className={` flex items-center my-1 h-6 border bg-white ${width}`}>
      <input type={type} className="w-full h-3 text-xs p-2" id={id} placeholder={placeholder} />
    </span>
  </div>
  )
}
