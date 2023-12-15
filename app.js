const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Routes imported
const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premium');
const passwordRoute = require('./routes/password');

const sequelize = require('./util/database');

// Models imported
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequest = require('./models/forgotpassword');
const FilesDownloaded = require('./models/filesDownloaded');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);

app.use((req, res) => {
    console.log(req.url)
    console.log("req is completed ")
    res.sendFile(path.join(__dirname, `public/${req.url}`    )) ;
});

// Relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(FilesDownloaded);
FilesDownloaded.belongsTo(User);

sequelize.sync({ force: false}).then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});