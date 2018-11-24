`use strict`;

const FS = require(`fs`);

class DataHandler {

    static renderDom(path, contentType, callback, encoding) {
        FS.readFile(path, encoding ? encoding : `utf-8`, (error, string) => {
            callback(error, string, contentType);
        });
    }

    static setBaseData(callback) {
        let filePath = `data/patrollers.csv`;
        FS.readFile(filePath, `utf8`, (err, file) => {
            let tempArray, protoArray = [];
            let finalData = [];
            tempArray = file.split(/\r?\n/); //remove newlines
            tempArray.shift(); //To remove the csv file headers
            const COLUMNS = 11;
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
                    SPLINT: protoArray[i][10],
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
        let stuff = `ID,LastName,FirstName,Rating,Leader,Days,Nights,HalfDays\n`;
        FS.writeFile(finalFilePath, stuff, `utf8`, (err) => {
            if (err) throw err;
            for (let i = 0; i < patrollerData.length; i++) {
                stuff = `${patrollerData[i].ID},${patrollerData[i].LAST_NAME},${patrollerData[i].FIRST_NAME},${patrollerData[i].RATING},${patrollerData[i].LEADER},${patrollerData[i].DAYS},${patrollerData[i].NIGHTS},${patrollerData[i].HALF_DAYS},${patrollerData[i].SNOWMOBILE},${patrollerData[i].TOBOGGAN},${patrollerData[i].SPLINT}\n`;
                FS.appendFile(finalFilePath, stuff, `utf8`, (err) => {
                    if (err) console.log(err);
                });
            }
        });
    }
}

module.exports = DataHandler;