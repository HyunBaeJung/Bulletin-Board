import React from 'react'

export default function ButtonBox({width, title,bgColor,onClickEvent}) {
  return (
    <div className={`flex items-center justify-center border text-xs h-6 ${width} ${bgColor}`}>
      <button onClick={onClickEvent} className=' inline-block h-6 font-semibold' >{title}</button>
    </div>
  )
}
