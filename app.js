const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const Error = require("./middleware/error");
const cors = require("cors");
const ParentRoute = require("./routes/parent");
const ChildrenRoute = require("./routes/children");
const AdminRoute = require("./routes/admin");


mongoose.connect(process.env.DATABASE_MONGO_URL).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
})
app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use('/api/parent', ParentRoute);
app.use('/api/children', ChildrenRoute);
app.use('/api/admin', AdminRoute);

app.use(Error);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
