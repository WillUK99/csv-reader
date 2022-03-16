const parse = require("csv-parser")
const fs = require("fs")
const log = console.log

/**
 * TODO
 * - Loop through results arr - done
 * - If results[n] has any blank fields skip -> store in skipped arr - done
 * - Elements that don't have blank fields add to seperate object -> store in created - done
 * - If results[n] has matching SKU id to existing object -> store in skipped arr - done
 */

// Caches and storage
const results = []
const skipped = []

const created = {}

function hasBlankFields(data) {
    return Object.values(data).some((field) => field === "" || field === undefined);
}

function generateCreatedData(data) {
    if (!created[data.SKU]) {
        created[data.SKU] = data
    } else if (created[data.SKU]) {
        skipped.push(data)
    }
}

// Reading stream and piping through csv-parser
fs.createReadStream("DATA.csv")
    .pipe(parse({
        columns: true,
    }))
    .on("data", (data) => {
        results.push(data) // pushing to results arr incase needed somewhere

        if (hasBlankFields(data)) { 
            skipped.push(data)
            log(data, "contains blank data fields, this data has been skipped")
        } else {
            generateCreatedData(data) // will build up new array from non duped sku id's
        }

    })
    .on("error", (err) => log(err))
    .on("end", () => {
        log(`Number of products created: ${Object.entries(created).length}`)
        log(`Number of products unchanged: ${Object.entries(created).length - skipped.length}`)
        log(`Number of products skipped: ${skipped.length}`)
    })
