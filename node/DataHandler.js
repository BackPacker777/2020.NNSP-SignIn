//   todo:

`use strict`;

const FS = require(`fs`);

class DataHandler {

    static renderDom(path, contentType, callback, encoding) {
        FS.readFile(path, encoding ? encoding : `utf-8`, (error, string) => {
            callback(error, string, contentType);
        });
    }

    static setBaseData(callback) {
        let filePath = `data/patrollers.csv`, columns = 8;
        FS.readFile(filePath, `utf8`, (err, file) => {
            let tempArray, finalData = [];
            tempArray = file.split(/\r?\n/); //remove newlines
            tempArray.shift(); //To remove the csv file headers
            for (let i = 0; i < tempArray.length; i++) {
                finalData[i] = tempArray[i].split(/,/).slice(0, columns);
            }
            finalData = JSON.stringify(finalData);
            callback(finalData);
            return finalData;
        });
    }

    static updatePatrollerDays(patrollerData, callback) {
        const results = patrollerData;
        patrollerData = JSON.parse(patrollerData);
        const tempFilePath = `data/temp.csv`;
        const COLUMNS = 8;
        const finalFilePath = `data/patrollers.csv`;
        let changed = false;
        FS.readFile(finalFilePath, `utf8`, (err, file) => {
            let tempArray, finalData = [];
            tempArray = file.split(/\r?\n/); //remove newlines
            for (let i = 0; i < tempArray.length; i++) {
                finalData[i] = tempArray[i].split(/,/).slice(0, COLUMNS);
            }
            for (let i = 0; i < finalData.length; i++) {
                for (let j = 0; j < patrollerData.length; j++) {
                    if (Number(finalData[i][0]) === Number(patrollerData[j].ID)) {
                        finalData[i][4] = patrollerData[j].DAYS;
                        patrollerData.splice(j, 1);
                        changed = true;
                    }
                }
            }
            let cells = [];
            finalData.forEach((writeData) => {
                let row = writeData.join(`,`);
                cells += `${row}\n`;
            });
            cells = cells.replace(/\n*$/, ``);
        });
    }

    static updatePatrollerDays2(patrollerData, callback) {
        const results = patrollerData;
        patrollerData = JSON.parse(patrollerData);
        const tempFilePath = `data/temp.csv`;
        const columns = 5;
        const finalFilePath = `data/patrollers.csv`;
        let changed = false;
        FS.readFile(finalFilePath, `utf8`, (err, file) => {
            let tempArray, finalData = [];
            tempArray = file.split(/\r?\n/); //remove newlines
            for (let i = 0; i < tempArray.length; i++) {
                finalData[i] = tempArray[i].split(/,/).slice(0, columns);
            }
            for (let i = 0; i < finalData.length; i++) {
                for (let j = 0; j < patrollerData.length; j++) {
                    if (Number(finalData[i][0]) === Number(patrollerData[j].ID)) {
                        finalData[i][4] = patrollerData[j].DAYS;
                        patrollerData.splice(j, 1);
                        changed = true;
                    }
                }
            }
            let cells = [];
            finalData.forEach((writeData) => {
                let row = writeData.join(`,`);
                cells += `${row}\n`;
            });
            cells = cells.replace(/\n*$/,``);

            /*FS.openSync(tempFilePath, 'w');
            FS.chmodSync(tempFilePath, 0o777);
            FS.writeFileSync(tempFilePath, cells, `utf8`);
            if (changed === true && tempFilePath) {
                FS.unlinkSync(finalFilePath);
                FS.openSync(finalFilePath, 'w');
                FS.chmodSync(finalFilePath, 0o777);
                FS.renameSync(tempFilePath, finalFilePath);*/

            FS.writeFile(tempFilePath, cells, `utf8`, (err) => {
                if (err) throw err;
            });
            if (changed === true && tempFilePath) {
                FS.unlinkSync(finalFilePath);
                FS.renameSync(tempFilePath, finalFilePath);
            } else {
                console.log(`File missing.`);
            }
            callback(results);
        });
    }
}

module.exports = DataHandler;