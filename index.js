const parse = require("csv-parser")
const fs = require("fs")
const log = console.log

const results = []

fs.createReadStream("DATA.csv")
    .pipe(parse({
        columns: true,
    }))
    .on("data", (row) => results.push(row))
    .on("error", (err) => log(err))
    .on("end", () => console.log(results))

