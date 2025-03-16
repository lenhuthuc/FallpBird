import express from "express";
import pg from "pg";
import cors from "cors"; //truy cập 2 địa chỉ khác nhau
import { useParams } from "react-router-dom";


const app = express();
app.use(cors()); 
app.use(express.json()); 

app.use(cors({
    origin: "http://localhost:5173",  // Chỉ cho phép React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],  // Chỉ cho phép các phương thức này
    credentials: true
}));


const db = new pg.Client({
  user: 'postgres',   
  host: 'localhost',        
  database: 'FlappyBird', 
  password: '27022006', 
  port: 5432,    
});

db.connect()
  .then(() => console.log("✅ Kết nối thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối:", err.stack));

app.post("/add",async(req,res)=>{
    try {
        const {point} = req.body;
        console.log("điểm ",point);
        const result = await db.query("INSERT INTO videogame (grade) VALUES ($1) RETURNING *",[point]);
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
})

app.get("/", async(req,res)=>{
    try {
        const result = await db.query("SELECT * FROM videoGame ORDER BY grade DESC");
        console.log(result);
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
})

app.delete("/delete/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const result = await db.query("DELETE FROM videogame WHERE id = $1 RETURNING *",[id]);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000,()=>{
    console.log(`sever đang chạy trên cổng 3000`);
})