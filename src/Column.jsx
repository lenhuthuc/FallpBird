import React, { useState, useEffect } from "react";

function Column({ id, startX, onRemove, topNumber, bottomNumber, ColmnBottomRef, ColmnTopRef , pause}) {
  const colSpan = {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
    4: "row-span-4",
  };

  const [posX, setPosX] = useState(startX); // Khởi tạo vị trí cột

  useEffect(() => {
    if(pause) return;
    const interval = setInterval(() => {
      //
      setPosX((preValue) => {
        
        if (preValue < -1000) {
          onRemove(id); 
          return preValue; // Không cập nhật nữa
        }
        return preValue - 2; // Tiếp tục di chuyển sang trái
      });
    }, 15);

    return () => clearInterval(interval); // Dọn dẹp khi unmount
  }, [id, onRemove]);

  return (
    <div
      className="grid grid-rows-7 h-screen will-change-transform absolute"
      style={{
        left: `${posX}px`,
      }}
    >
      <div ref={ColmnTopRef} className={`w-[100px] bg-green-500 ${colSpan[topNumber]}`}></div>
      <div className="row-span-2"></div>
      <div ref={ColmnBottomRef} className={`w-[100px] bg-green-500 ${colSpan[bottomNumber]}`}></div>
    </div>
  );
}

export default Column;
