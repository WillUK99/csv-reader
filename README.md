# CSV Reader Challenge
This is a node script which parses a given CSV file, skipping any duplicate SKU id's and also any rows with blank data fields. In the event of a skip a message is displayed to alert the use why. 
Once the CSV data stream has come to an end, the script will log out the number of created, unchanged and also skipped rows from the piped in CSV, a new CSV string is then generated and written for subsequent runs of this script.

## Instructions
After cloning this repo, type `node index.js`to run the script.

## What did I do?
In order to parse and skip invalid CSV rows, I first had to read a given `.csv` file and pipe it through the `csv-parser`. 

```
const parse = require("csv-parser")

fs.createReadStream("DATA.csv")
    .pipe(parse({
        columns: true,
    }))
```

Once I had parsed that had been done I could then listen to the data being streamed in and pass each chunk of data off to a `hasBlankFields` function, which returns true if the data has blank fields. This data is then pushed to a `skipped []` array for later processing.

```
const skipped = []

if (hasBlankFields(data)) {
    skipped.push(data)
    log(data, "contains blank data fields, this dathas been skipped")
}

function hasBlankFields(data) {
    return Object.values(data).some((field) => field === "" || field === undefined);
}
```

When the data had been passed through the `hasBlankFields` function, the other data which passed this initial test is then passed to a `generateCreatedData` function. This function checks to see if the cache called 'created' does *not* have an object with its key === SKU. If it is not present in the `created {}` cache then that row is added to the `created {}` cache. Else the data is pushed into the `skipped []` array, a message will also be displayed when this occurs.

```
const created = {}

function generateCreatedData(data) {
    if (!created[data.SKU]) {
        created[data.SKU] = data
    } else if (created[data.SKU]) {
        log(data, "contains a duplicate sku code, this data has been skipped")
        skipped.push(data)
    }
}
```

Once the CSV data has been parsed the script will log out the number of products created, unchanged and skipped.

The script then generates a new CSV string from the created products array, this CSV string is then written to the original CSV file for any subsequent re-runs of the script. 

## Further Improvements
To further develop this script I have created, I would firstly break up my code a bit more to increase reusability. A good example of this would be when I am generating a new CSV file to write over the previous CSV file. This should really be in its own function.

If I had more time I would like to implement some testing for this script as at the moment if a SKU code is not present then there could be some bugs within my code. 

Furthermore with some more time I would like to model the data to a database in order to store this CSV data instead of having a hardcoded `DATA.csv` file I am reading and writing to. 

And lastly I would like to implement some sort of front end, to enable a user to more easily select and filter through the data which is pulled from a database.

## Problems
The first problem I faced was coming up with a good tactic in order to handle the data which had been streamed in. Initially at the end of the data stream I was calling a `parseData` function. `.on("end", parseData)`. However I quickly realised that this is not the best way to handle the data, the function had nested loops and would be very slow at high loads. 

Instead I would handle the data as the data flowed in to increase the speed of the script and to be more readable. 

```
.on("data", (data) => {
     results.push(data)

    if (hasBlankFields(data)) {
        skipped.push(data)
        log(data, "contains blank data fields, this data has beenskipped")
    } else {
        generateCreatedData(data)
    }
 })
```

Another issue I faced was how was I going to make the code as readable and efficient as a could? Initially my idea was to just make one big function and then split it up once everything worked. But I soon realised that this would cause a bit of a headache. Therefore I started to handle the data as it came in with seperate functions (and avoiding nested loops).

The last issue I had was how was I going to acheive the expected outcome on subsequent runs of the script? Personally from what I did this was the crux of the challenge. Had I used a database I feel it wouldn have been a more elegant solution. However due to time restrictions, I instead decided to generate a new CSV string to then override the old CSV string. 

Whilst this does allow for the expected outcome of subsequent runs of the script. It means that the initial data is lost, and if this was needed somewhere else there would be no way of retrieving it without backups.

If I had more time my first priority would be tofind out what the most performant and best option would be in order to fix this issue.

## Some final words
Completing this challenge was a great and rewarding experience for myself. I learnt alot about node in the process and I'm very happy with my solution (for the most part). On to sharpening my node and react/next skills :rocket:

# Thank you for taking your time to go through this solution.

