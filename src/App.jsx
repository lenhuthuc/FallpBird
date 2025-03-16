import React, { useState, useEffect, useRef } from "react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // Import Router
import Column from "./Column";
import Bird from "./Bird";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HomeIcon from '@mui/icons-material/Home';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from "axios";
import HistoryIcon from '@mui/icons-material/History';
import Board from "./Board";  // Import bảng lịch sử

function Game({Home, setHome, Hightest, setHightest}) {
  const [point, setPoint] = useState(0);
  const [Pause, setPause] = useState(false);
  
  const [gameOver, setGameOver] = useState(false);
  const [columns, setColumns] = useState([]);
  const BirdRef = useRef(null);
  const navigate = useNavigate(); // Dùng để điều hướng

  const fetchHighestScore = async () => {
    try {
      console.log("Đang lấy điểm cao nhất...");
      const result = await axios.get("http://localhost:3000/"); // Lấy danh sách điểm
      if (result.data.length > 0) {
        setHightest(result.data[0].grade); // Cập nhật điểm cao nhất
      }
    } catch (error) {
      console.log("Lỗi khi lấy điểm cao nhất:", error);
    }
  };

  useEffect(() => {
    if (Home) {
      fetchHighestScore();
    }
  }, [Home]);

  // Cập nhật điểm cao nhất khi đạt điểm mới
  useEffect(() => {
    if (point > Hightest) {
      setHightest(point);
    }
  }, [point]);

  useEffect(() => {
    if (Pause || Home) return;
    const interval = setInterval(() => {
      const topNumber = Math.floor(Math.random() * 4) + 1;
      const bottomNumber = 5 - topNumber;
      const newColumn = {
        id: Date.now(),
        startX: window.innerWidth + columns.length * 50,
        topNumber,
        bottomNumber,
        refTop: React.createRef(),
        refBottom: React.createRef(),
        pass: false
      };
      setColumns((prev) => [...prev, newColumn]);
    }, 3000);
    return () => clearInterval(interval);
  }, [columns, Pause, Home]);

  const handleRemove = (id) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
  };

  function checkCollision() {
    if (!BirdRef.current) return false;
    const bird = BirdRef.current.getBoundingClientRect();
    if (bird.bottom >= window.innerHeight - 1) return true;
    return columns.some((col) => {
      const columnTop = col.refTop.current?.getBoundingClientRect();
      const columnBottom = col.refBottom.current?.getBoundingClientRect();
      if (!columnTop || !columnBottom) return false;
      if (
        (bird.right > columnTop.left && bird.left < columnTop.right) &&
        (bird.top < columnTop.bottom || bird.bottom > columnBottom.top)
      ) return true;
      if (bird.left > columnTop.right && !col.pass) {
        setPoint((prevPoint) => prevPoint + 1);
        col.pass = true;
      }
    });
  }

  useEffect(() => {
    if (gameOver) {
      const updatePoints = async () => {
        try {
          await axios.post("http://localhost:3000/add", { point });
          console.log("Điểm đã được cập nhật:", point);
        } catch (error) {
          console.log("Lỗi khi gửi request:", error);
        }
      };
      updatePoints();
    }
  }, [gameOver]);

  useEffect(() => {
    if (Pause) return;
    const collisionInterval = setInterval(() => {
      if (checkCollision()) {
        setPause(true);
        setGameOver(true);
      }
    }, 50);
    return () => clearInterval(collisionInterval);
  }, [columns, Pause]);

  if (gameOver) {
    fetchHighestScore();
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <img onDragStart={(e) => e.preventDefault()} src={`${import.meta.env.BASE_URL}img/GameStatus.png`} />
        <div className="absolute grid grid-rows-3 gap-y-[10px]">
          <div className="notice"><center>Game Over</center></div>
          <div> <center>Your Grade : {point}</center></div>
          <div className="grid grid-cols-2 gap-x-[40px]">
            <button onClick={() => {
                setHome(false);
                setPoint(0);
                setPause(false);
                setGameOver(false);
                setColumns([]);
              }}  
              className="border-2 border-black py-2 px-4 text-black bg-transparent rounded-md hover:bg-yellow-600">
              Restart <RestartAltIcon />
            </button>
            <button className="border-2 border-black py-2 px-4 text-black bg-transparent rounded-md hover:bg-yellow-600"
              onClick={() => { 
                setHome(true);
                setColumns([]);
                setPoint(0);
                setPause(false);
                setGameOver(false);
              }}>
              Home <HomeIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (Home) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <button className="absolute top-5 left-5" onClick={() => navigate("/history")}>
          <HistoryIcon />
          <br></br>
          History
        </button>
        <img onDragStart={(e) => e.preventDefault()} src={`${import.meta.env.BASE_URL}img/GameStatus.png`} />
        <div className="grid gird-rows-2 absolute gap-y-[40px]">
          <div className="notice">HuYềN ThOạI Về COn ChiM</div>
          <center>
          <button className="border-2 border-black py-2 px-4 text-black bg-transparent rounded-md hover:bg-yellow-600 w-[100px] flex justify-center"
            onClick={() => {
              setHome(false);
            }}>
            <PlayArrowIcon/> Play
          </button>
          </center>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-5 left-5 z-[102] select-none"> Hightest score : {Hightest}</div>
      <div className="absolute select-none z-[101] text-4xl font-bold red-white w-screen">
        <a type="Button"
          className="absolute top-5 right-5 bg-transparent text-white text-xl p-2 rounded-full hover:bg-gray-600"
          onClick={(event) => {
            event.preventDefault();
            setPause(!Pause);
          }}>
          {Pause ? "Resume" : "Pause"}
        </a>
        <center>{point}</center>
      </div>
      <Bird BirdRef={BirdRef} pause={Pause} />
      {columns.map((col) => (
        <Column key={col.id} id={col.id} startX={col.startX} onRemove={handleRemove}
          topNumber={col.topNumber} bottomNumber={col.bottomNumber} 
          ColmnTopRef={col.refTop} ColmnBottomRef={col.refBottom} pause={Pause} />
      ))}
    </div>
  );
}

// Thêm Router để quản lý các route
function App() {
  const [Home, setHome] = useState(true);
  const [Hightest,setHightest] = useState(0);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game Home = {Home} setHome={setHome} Hightest={Hightest} setHightest = {setHightest}/>} />
        <Route path="/history" element={<Board Home = {Home} setHightest = {setHightest}/>} />
      </Routes>
    </Router>
  );
}

export default App;
