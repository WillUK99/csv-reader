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

// Caches and storage
const results = []
const skipped = []

const created = {}
const unchanged = {}

function hasBlankFields(data) {
    return Object.values(data).some((field) => field === "" || field === undefined);
}

function generateCreatedData(data) {
    if (!created[data.SKU]) {
        created[data.SKU] = data
    } else {
        log(data, "is a duplicate and has been skipped")
        skipped.push(data)
    }
}

// Reading stream and piping through csv-parser
fs.createReadStream("DATA.csv")
    .pipe(parse({
        columns: true,
    }))
    .on("data", (data) => {
        results.push(data)

        if (hasBlankFields(data)) {
            skipped.push(data)
            log(data, "has been skipped due to blank fields")
        }

        generateCreatedData(data)
    })
    .on("error", (err) => log(err))
    .on("end", () => {
        log(`Number of products created: ${Object.entries(created).length}`)
        log(`Number of products unchanged:`)
        log(`Number of products skipped: ${skipped.length}`)
    })
