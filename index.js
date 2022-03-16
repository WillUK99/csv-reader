const parse = require("csv-parser")
const fs = require("fs")
const log = console.log

/**
 * TODO
 * - Loop through results arr 
 * - If results[n] has any blank fields skip -> store in skipped arr
 * - Elements that don't have blank fields add to seperate object -> store in createdCache
 * - If results[n] has matching SKU id to existing object -> store in skipped arr
 */

const results = []

const createdCache = {}
const unchangedCache = {}
const skipped = []

function hasBlankFields(data) {
    return Object.values(data).some((field) => field === "" || field === undefined);
}

fs.createReadStream("DATA.csv")
    .pipe(parse({
        columns: true,
    }))
    .on("data", (data) => {
        results.push(data)
        hasBlankFields(data)
        if (hasBlankFields(data)) {
            skipped.push(data)
            log(data, "has been skipped due to blank fields")
        }
    })
    .on("error", (err) => log(err))
    .on("end", () => {
        log(`Number of products created`)
        log(`Number of products unchanged`)
        log(`Number of products skipped: ${skipped.length}`)
    })





// O(n^2) will make more efficient 
// function parseData() {
    // for (let row of results) {
        // for (let key in row) {
            // if (!row[key]) {
                // log( row, "has been skipped due to blank values")
                // skipped.push(row)
            // }
        // }
    // }
    // log(`Number of rows skipped: ${skipped.length}`)
// }


