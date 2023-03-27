import React from 'react'

export default function ButtonBox({width, title,bgColor}) {
  return (
    <div className={`flex items-center justify-center border text-xs h-6 ${width} p-2 ml-1 ${bgColor}`}>
      <button className=' inline-block h-3 font-semibold' >{title}</button>
    </div>
  )
}
