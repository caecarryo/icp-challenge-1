import express, { Request, Response } from "express";
import path from "path";

interface Attendance {
  id: string;
  employeeName: string;
  date: string;
  status: "present" | "leave" | "sick";
}

let db: Attendance[] = []; // Array untuk menampung data absensi

const app = express();
app.use(express.json());

// CREATE: Menambahkan catatan absensi baru
app.post("/attendance", (req: Request<any, any, Attendance>, res: Response) => {
  const newAttendance: Attendance = {
    id: `${db.length + 1}`, // Auto increment ID
    employeeName: req.body.employeeName,
    date: req.body.date,
    status: req.body.status,
  };

  db.push(newAttendance);
  res.status(201).json(newAttendance);
});

// READ: Mendapatkan semua catatan absensi
app.get("/attendances", (_req, res: Response) => {
  res.json(db);
});

// DELETE: Menghapus catatan absensi berdasarkan ID
app.delete("/attendance/:id", (req: Request, res: Response) => {
  const attendanceIndex = db.findIndex((a) => a.id === req.params.id);

  if (attendanceIndex !== -1) {
    db.splice(attendanceIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Attendance not found" });
  }
});

// Static file untuk frontend di folder /dist
app.use(express.static(path.join(__dirname, "dist")));

// Listening port
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
