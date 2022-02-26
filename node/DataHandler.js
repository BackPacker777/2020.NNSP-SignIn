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
            const COLUMNS = 13;
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
        patrollerData = JSON.parse(patrollerData);
        const finalFilePath = `data/patrollers.csv`;
        let stuff = `ID,LastName,FirstName,Rating,Leader,Days,Nights,HalfDays,snowmobile,toboggan,scavenger,cpr,chair\n`;
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
        let writeLine = `ID,LastName,FirstName,Rating,Leader,Days,Nights,HalfDays,snowmobile,toboggan,scavenger,cpr,chair\n`;
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
        this.db.run(`INSERT INTO patrollers (id, last_name, first_name, leadership, rating, days, nights, halfs, cpr, snowmobile, chair, toboggan, oec, scavenger)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.ID, data.LAST_NAME, data.FIRST_NAME, data.LEADER, data.RATING, data.DAYS, data.NIGHTS, data.HALF_DAYS, data.CPR, data.SNOWMOBILE, data.TOBOGGAN, data.OEC],
            function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }
        );
    }

    static receiveFile(request) {
        UPLOADER.receiveFiles(request);
    }
}

module.exports = DataHandler;