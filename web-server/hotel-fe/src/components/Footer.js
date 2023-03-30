import React from "react";

export default function Footer({ footerType }) {
  if (footerType === "min") {
    return (
      <div className="flex flex-col items-center text-xs mt-6">
        <div>
          <span className="mx-1">이용약관</span>
          <span className="mx-1">개인정보처리방침</span>
          <span className="mx-1">책임의 한계와 법적고지</span>
          <span className="mx-1">회원정보</span>
          <span className="mx-1">고객센터</span>
        </div>

        <div>
          <span>Copyright STUDY HOTEL Corp. All Rights Reserved.</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center text-xs mt-6">
        <div>
          <span className="mx-1">이용약관</span>
          <span className="mx-1">개인정보처리방침</span>
          <span className="mx-1">책임의 한계와 법적고지</span>
          <span className="mx-1">회원정보</span>
          <span className="mx-1">고객센터</span>
        </div>

        <div>
          <span>Copyright STUDY HOTEL Corp. All Rights Reserved.</span>
        </div>
      </div>
    );
  }
}
