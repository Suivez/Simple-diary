const express = require('express');
const bodyParser = require('body-parser');
const DiaryEntryModel = require('./entry-schema');
const mongoose = require('mongoose');
const UserModel = require('./user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const uri = "mongodb+srv://jakub:kuba123@cluster0.jqklitn.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(() => {
        console.log("Error connecting to MongoDB");
    })

app.use(bodyParser.json());
app.use((req, res, next) => {
    // Serwer informuje klienta jakie domeny uprawnione sa do uzycia odpowiedzi
    res.setHeader("Access-Control-Allow-Origin", "*");
    // wskazuje ktore naglowki moga byc uzywane podczas rzeczywistego dzialania
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); 
    // serwer informuje jakie inne czasowniki sa dozwolone
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); 
    next();
})


// usuniecie wydarzenia
app.delete('/remove-entry/:id', (req, res) => {
    DiaryEntryModel.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: "Post Deleted"
            })
        })
        .catch(() => {
            console.log("Error: cannot delete");
        })
})

// edytowanie wydarzenia
app.put('/update-entry/:id', (req, res) => {
    const updatedEntry = new DiaryEntryModel({ _id: req.body.id, date: req.body.date, entry: req.body.entry })
    DiaryEntryModel.updateOne({ _id: req.body.id }, updatedEntry)
        .then(() => {
            res.status(200).json({
                message: "Update completed"
            })
        })
        .catch(() => {
            console.log("Error: cannot update");
        })
})

// dodanie wydarzenia
app.post("/add-entry", (req, res, next) => {
    try{
        const token = req.headers.authorization;
        jwt.verify(token, "secret-string")
        next();
    }
    catch(err){
        res.status(401).json({
            message: "Error with Authentication token"
        })
    }

}, (req, res) => {
    const diaryEntry = new DiaryEntryModel({ date: req.body.date, entry: req.body.entry });
    diaryEntry.save();
    res.status(200).json({
        message: "Post submitted"
    })
})

// wyswietlenie danych/wydarzen
app.get('/diary-entries', (req, res, next) => {
    DiaryEntryModel.find()
        .then((data) => {
            res.json({ 'diaryEntries': data });
        })
        .catch(() => {
            console.log("Error: cannot fething entries");
        })
})

// rejestracja
app.post('/sign-up', (req, res) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userModel = new UserModel({
                username: req.body.username,
                password: hash
            })

            userModel.save()
                .then(result => {
                    res.status(201).json({
                        message: "User created",
                        result: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
})

// logowanie
app.post('/login', (req, res) => {

    let userFound;

    UserModel.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'User not found'
                })
            }
            userFound = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Password is incorrect'
                })
            }

            const token = jwt.sign({ username: userFound.username, userId: userFound._id }, "secret-string", { expiresIn: "1h" })
            return res.status(200).json({
                token: token,
                expiresIn: 3600
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Error with authentication'
            })
        })
})

module.exports = app;