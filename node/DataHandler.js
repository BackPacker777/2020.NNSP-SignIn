`use strict`;

const UPLOADER = require('./FileUploader');
const FS = require(`fs`);
const SQL = require('sqlite3').verbose();

class DataHandler {
    constructor() {
        this.initDB();
    }

    static renderDom(path, contentType, callback, encoding) {
        FS.readFile(path, encoding ? encoding : `utf-8`, (error, string) => {
            callback(error, string, contentType);
        });
    }

    static getKey() {
        return FS.readFileSync(`data/encryption/privatekey.key`, `utf8`);
    }

    static getCert() {
        return FS.readFileSync(`data/encryption/certificate.crt`, `utf8`);
    }

    static setBaseData(callback) {
        let filePath = `data/patrollers.csv`;
        FS.readFile(filePath, `utf8`, (err, file) => {
            let tempArray, protoArray = [];
            let finalData = [];
            tempArray = file.split(/\r?\n/); //remove newlines
            tempArray.shift(); //To remove the csv file headers
            const COLUMNS = 14;
            for (let i = 0; i < tempArray.length; i++) {
                protoArray[i] = tempArray[i].split(/,/).slice(0, COLUMNS);
                finalData[i] = {
                    ID: protoArray[i][0],
                    LAST_NAME: protoArray[i][1],
                    FIRST_NAME: protoArray[i][2],
                    RATING: protoArray[i][3],
                    LEADER: protoArray[i][4],
                    DAYS: protoArray[i][5],
                    NIGHTS: protoArray[i][6],
                    HALF_DAYS: protoArray[i][7],
                    SNOWMOBILE: protoArray[i][8],
                    TOBOGGAN: protoArray[i][9],
                    SCAVENGER: protoArray[i][10],
                    CPR: protoArray[i][11],
                    CHAIR: protoArray[i][12],
                    OEC: protoArray[i][13],
                }
            }
            let len = finalData.length - 1;
            finalData.splice(len, 1);
            finalData = JSON.stringify(finalData);
            finalData = finalData.trim();
            callback(finalData);
        });
    }

    static updatePatrollerDays(patrollerData) {
        console.log("Updating days....");
        patrollerData = JSON.parse(patrollerData);
        const finalFilePath = `data/patrollers.csv`;
        let stuff = `ID,LastName,FirstName,Rating,Leader,Days,Nights,HalfDays,snowmobile,toboggan,scavenger,cpr,chair,oec\n`;
        FS.writeFile(finalFilePath, stuff, `utf8`, (err) => {
            if (err) throw err;
            for (let i = 0; i < patrollerData.length; i++) {
                stuff = `${patrollerData[i].ID},${patrollerData[i].LAST_NAME},${patrollerData[i].FIRST_NAME},${patrollerData[i].RATING},${patrollerData[i].LEADER},${patrollerData[i].DAYS},${patrollerData[i].NIGHTS},${patrollerData[i].HALF_DAYS},${patrollerData[i].SNOWMOBILE},${patrollerData[i].TOBOGGAN},${patrollerData[i].SCAVENGER},${patrollerData[i].CPR},${patrollerData[i].CHAIR},${patrollerData[i].OEC}\n`;
                FS.appendFile(finalFilePath, stuff, `utf8`, (err) => {
                    if (err) console.log(err);
                });
            }
        });
    }

    static updateAllPatrollerData(patrollerData) {
        patrollerData = JSON.parse(patrollerData);
        const finalFilePath = `data/patrollers2.csv`;
        let writeLine = `ID,LastName,FirstName,Rating,Leader,Days,Nights,HalfDays,snowmobile,toboggan,scavenger,cpr,chair,oec\n`;
        FS.writeFile(finalFilePath, writeLine, `utf8`, (err) => {
            if (err) throw err;
            for (let i = 0; i < patrollerData.length; i++) {
                writeLine = `${patrollerData[i].ID},${patrollerData[i].LAST_NAME},${patrollerData[i].FIRST_NAME},${patrollerData[i].RATING},${patrollerData[i].LEADER},${patrollerData[i].DAYS},${patrollerData[i].NIGHTS},${patrollerData[i].HALF_DAYS},${patrollerData[i].SNOWMOBILE},${patrollerData[i].TOBOGGAN},${patrollerData[i].SCAVENGER},${patrollerData[i].CPR},${patrollerData[i].CHAIR},${patrollerData[i].OEC},${patrollerData[i].TODAY_HALF}\n`;
                writeLine = writeLine.replace(/null/gi, '');
                FS.appendFile(finalFilePath, writeLine, `utf8`, (err) => {
                    if (err) console.log(err);
                });
            }
        });
    }

    initDB() {
        this.db = new SQL.Database(`data/nnsp_shifts.db`, (err) => {
            this.db.run(`PRAGMA foreign_keys = on`);
            this.db.run(`PRAGMA AUTO_VACUUM = FULL`);
            if (err) {
                return console.error(err.message);
            } else {
                console.log(`Connected to -nnsp_shifts.db- Sqlite3 DB`);
            }
        });
    }

    insertRowSQL(data) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            this.db.run(`INSERT INTO patrollers (id, last_name, first_name, leadership, rating, days, nights, halfs, cpr, snowmobile, chair, toboggan, oec, scavenger)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [data[i].ID, data[i].LAST_NAME, data[i].FIRST_NAME, data[i].LEADER, data[i].RATING, data[i].DAYS, data[i].NIGHTS, data[i].HALF_DAYS, data[i].CPR, data[i].SNOWMOBILE, data[i].CHAIR, data[i].TOBOGGAN, data[i].OEC, data[i].SCAVENGER],
                function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                }
            );
            this.db.run(`INSERT INTO shifts (patroller_id, date_time, team, guest, radio, is_half)
             VALUES(?, ?, ?, ?, ?, ?)`,
                [data[i].ID, data[i].DATE_TIME, data[i].TEAM, data[i].GUEST, data[i].RADIO, data[i].TODAY_HALF],
                function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                }
            );
        }
    }

    returnShift(date__time, callback) {
        const DAY_NIGHT_DELIMITER = '16';
        date__time = JSON.parse(date__time);
        /*let requestedYear = date_time[0].substring(0,4);
        let requestedMonth = date_time[0].substring(5,7);
        let requestedDay = date_time[0].substring(8,10);*/
        let sql = null;
        let requestedDate = `${date__time[0].substring(0,4)}-${date__time[0].substring(5,7)}-${date__time[0].substring(8,10)}`;
        if (date__time[1] === "day") {
            sql = `SELECT * FROM shifts
                    LEFT JOIN patrollers p on shifts.patroller_id = p.id
                    WHERE SUBSTR(shifts.date_time, 1, 10) = ? AND SUBSTR(shifts.date_time, 12, 13) < ?`;
        } else {
            sql = `SELECT * FROM shifts
                    LEFT JOIN patrollers p on shifts.patroller_id = p.id
                    WHERE SUBSTR(shifts.date_time, 1, 10) == ? AND SUBSTR(shifts.date_time, 12, 13) >= ?`;
        }
        let data = [];
        this.db.all(sql, [requestedDate, DAY_NIGHT_DELIMITER], (err, rows) => {
            if (err) {
                console.log(`DATE ERR = ${err}`);
            } else {
                data.push(rows);
                callback(data);
            }
        });
    }

    static receiveFile(request) {
        UPLOADER.receiveFiles(request);
    }
}

module.exports = DataHandler;