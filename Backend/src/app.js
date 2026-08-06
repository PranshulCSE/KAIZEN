const express = require ("expresss");
const app = express();
const connectDB = require ('./config/connectDB');


connectDB();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});