const express = require('express');
const bodyParser = require('body-parser');
const DiaryEntryModel = require('./entry-schema');
const mongoose = require('mongoose');

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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})

app.delete('/remove-entry/:id', (req, res) => {
    DiaryEntryModel.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({
            message: "Post Deleted"
        })
    })
    .catch(() => {
        console.log("Error: cannot delete");
    })
})

app.put('/update-entry/:id', (req, res) => {
    const updatedEntry = new DiaryEntryModel({_id: req.body.id, date: req.body.date, entry: req.body.entry})
    DiaryEntryModel.updateOne({_id: req.body.id}, updatedEntry)
    .then(() => {
        res.status(200).json({
            message: "Update completed"
        })
    })
    .catch(() => {
        console.log("Error: cannot update");
    })
})

app.post("/add-entry", (req, res) => {
    const diaryEntry = new DiaryEntryModel({date: req.body.date, entry: req.body.entry});
    diaryEntry.save();
    res.status(200).json({
        message: "Post submitted"
    })
})

app.get('/diary-entries',(req, res, next) => {
    DiaryEntryModel.find()
    .then((data) => {
        res.json({'diaryEntries': data});
    })
    .catch(() => {
        console.log("Error: cannot fething entries");
    })
})

module.exports = app;