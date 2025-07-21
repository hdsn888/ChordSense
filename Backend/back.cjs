
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors( {
    origin: /^http:\/\/localhost:\d+$/,
    credentials: true
}));

let con = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Doremi88!!",
    database: "chords_data"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
})

app.get('/chords', (req, res) => {
    console.log("Request received");
    const chord = req.params.chordName;
    const sql = `SELECT * FROM Chords`;
    console.log("About to query")
    con.query(sql, function(err, result) {
        if (err) {
            res.status(500).json({error: "Database error"});
            return;
        } if (result.length === 0) {
            res.status(404).json({error: "Chord not found"});
            return;
        }
        res.json(result);
    });

});
 // const sql = `SELECT Link FROM chords
    //     WHERE Concert_Pitch = \"CMaj\" `;
    // con.query(sql, function(err, result) {
    //     if (err) throw err;
    //     console.log(result[0].Link);
    //     const audio = new Audio(result[0].Link);
    //     audio.play();
    // });

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})