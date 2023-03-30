import React from "react";
import ComboBox from "./ComboBox";
import InputBox from "./InputBox";

export default function BirthYearInput() {
  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const contents = month.map((num) => ({ value: num, face: num + "월" }));

  console.log(contents);

  return (
    <div>
      <p className=" font-bold text-xs">생년월일</p>
      <div className=" flex justify-between w-52">
        <InputBox type="number" id="year" placeholder="년(4자)" width="w-16" />
        <ComboBox contents={contents} width="w-16" />
        <InputBox type="number" id="year" placeholder="일" width="w-16" />
      </div>
    </div>
  );
}
