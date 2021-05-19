const path = require('path');

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const csrf = require('csurf');

const router = require('./routes/routes');

const PORT = 3000;
const MONGODB_URI = '';

const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/post-images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const csrfProtection = csrf();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: false
}));

app.use(session({
    secret: 'thisStringIsUsedForSigningTheHashAndShouldBeLong',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(csrfProtection);

app.use(
    multer({ storage, fileFilter }).fields([{ name: 'image', maxCount: 1 }, { name: 'avatar-change-file-input', maxCount: 1 }])
);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(router);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
    })