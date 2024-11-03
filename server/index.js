// Installing dependecies:
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const PORT = process.env.PORT;
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

// Inporting the necessary files and module:
const connectDB = require("./config/db");

// Initializing an Express instance:
const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
    res.send("Hello World");
})

// Code to get the Image Url using multer:
// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('file');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Upload endpoint
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ error: 'No file selected' });
            } else {
                res.status(200).json({
                    message: 'File uploaded successfully',
                    url: `/uploads/${req.file.filename}`,
                });
            }
        }
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}---`);
})