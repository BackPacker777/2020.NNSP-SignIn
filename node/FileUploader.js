'use strict';

const FORMIDABLE = require('formidable').IncomingForm;

class FileUploader {

    static receiveFiles(request) {
        let form = new FORMIDABLE.IncomingForm();
        form.parse(request);

        form.on('fileBegin', (name, file) => {
            console.log(file.name);
            file.path = `data/${file.name}`;
        });

        form.on('file', (name, file) => {
            console.log(`Uploaded ${file.name}`);
        });
    }
}

module.exports = FileUploader;