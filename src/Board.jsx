import { div } from "framer-motion/client";
import React from "react";
import { useState } from "react";
import { useEffect } from "react"
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
function Board({Home, setHightest}) {
    const [data, setData] = useState([]);
    function DeleteItem(id) {
        axios.delete(`http://localhost:3000/delete/${id}`)
          .then(response => {
            setData(preValue => preValue.filter(item => item.id !== id));
            console.log("Đã xoá thành công!", response.data);
          })
          .catch(error => {
            console.error("Lỗi khi xoá dữ liệu:", error);
          });
    }
    //lấy danh sách
  
  useEffect(()=>{
    if(Home) {
      const GetData = async () => {
        try {
          console.log("đang lấy danh sách.....");
          const result = await axios.get("http://localhost:3000/");
          setData(result.data);
          if (result.data.length > 0) {
            setHightest(result.data[0].grade);
          }
        } catch (error) {
          console.log("Lấy danh sách thất bại ",error);
        }
      }
      GetData();
    }
  },[Home,data])
  const navigate = useNavigate();
  return (
    <div>
    <div className="flex justify-between items-center w-full p-2">
        <button className="text-sm p-2" onClick={()=>{navigate("/")}}>
            Back 
            <br></br>
            <ArrowBackIcon/>
        </button>
        <center className="text-lg font-bold">History</center>
        <div className="w-[10px]"></div> {/* Chỉ để giữ khoảng cách đều */}
    </div>
    <table className="border-collapse border border-gray-400 w-full mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-400 px-4 py-2">ID</th>
          <th className="border border-gray-400 px-4 py-2">Điểm</th>
          <th className="border border-gray-400 px-4 py-2">Ngày tạo</th>
          <th className="border border-gray-400 px-4 py-2">Xóa</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="text-center">
            <td className="border border-gray-400 px-4 py-2">{item.id}</td>
            <td className="border border-gray-400 px-4 py-2">{item.grade}</td>
            <td className="border border-gray-400 px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
            <td className="border border-gray-400 px-4 py-2 w-[10px] hover:bg-red-500 transition duration-200">
                <button onClick={()=>{DeleteItem(item.id)}}>X</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
        
    </div>
  );
}

export default Board;