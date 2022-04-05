const fs = require("fs");
const path = require("path");

const generateID = require("../utils").generateID;
const root = require("../utils").root;

class DbContext {
    constructor() {
        this.collection = null;
    }

    useCollection(collection = "") {
        this.collection = path.join(root, `database/${collection}`);
    }

    getOne(id, successCb, errorCb) {
        fs.readFile(this.collection, "utf8", (err, data) => {
            if (err) errorCb();

            const records = JSON.parse(data);
            const record = records.filter((record) => record.id == id)[0];
            successCb(record);
        });
    }

    getAll(successCb, errorCb) {
        fs.readFile(this.collection, "utf8", (err, data) => {
            if (err) errorCb();

            const records = JSON.parse(data);
            const validRecords = records.filter((record) => record.isRented != true);
            successCb(validRecords);
        });
    }


    saveOne(newRecord, date, successCb, errorCb) {
        fs.readFile(this.collection, "utf8", (err, data) => {
            if (err) errorCb();

            const records = JSON.parse(data);

            records.push({
                id: generateID(),
                author: newRecord.author,
                date: date,
                title: newRecord.title,
                body: newRecord.body,
                isRented: false,
            });

            fs.writeFile(this.collection, JSON.stringify(records), (err) => {
                if (err) errorCb();
                successCb();
            });
        });
    }

    deleteOne(id, successCb, errorCb) {
        fs.readFile(this.collection, "utf8", (err, data) => {
            if (err) errorCb();

            const records = JSON.parse(data);

            const filtered = records.filter((record) => record.id !== id) || [];

            fs.writeFile(this.collection, JSON.stringify(filtered), (err) => {
                if (err) errorCb();
                successCb();
            });
        });
    }
}

module.exports = DbContext;
