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
    .on("end", parseData)


/**
 * TODO
 * - Loop through results arr 
 * - If results[n] has any blank fields skip -> store in skippedCache
 * - Elements that don't have blank fields add to seperate object -> store in createdCache
 * - If results[n] has matching SKU id to existing object -> store in skippedCache
 */

const createdCache = {}
const unchangedCache = {}
const skippedCache = {}

// O(n^2) will make more efficient 
function parseData() {
    for (let row of results) {
        for (let key in row) {
            if (!row[key]) {
                skippedCache[key] = row
            }
        }
    }
    log(skippedCache)
}


