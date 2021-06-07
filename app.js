var fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const start = new Date();
const inputFile = './inputs/t8.shakespeare.txt';
const findFile = './inputs/find_words.txt';
const replaceFile = './inputs/french_dictionary.csv';
const outputFile = './output/t8.shakespeare-translated.txt';

var inputData = fs.readFileSync(inputFile, 'utf8');
var findData = fs.readFileSync(findFile, 'utf8')
var replaceData = fs.readFileSync(replaceFile, 'utf8')

var findArr = findData.toString().split('\n');
var replaceArr = replaceData.toString().split('\n');
var replaceArrObj = [];

replaceArr.forEach((row) => {
    var rowObj = {};
    var rowData = row.split(',');
    rowObj.englishWord = rowData[0];
    rowObj.frenchWord = rowData[1];
    replaceArrObj.push(rowObj);
});

var frequencyData = [];
findArr.forEach((findingWord) => {
    var wordCount = inputData.split(findingWord).length - 1;
    replaceArrObj.filter((word) => {
        if (word.englishWord == findingWord) {
            var data={};
            var frenchWord = word.frenchWord;
            inputData = inputData.replace(new RegExp(findingWord, "ig"), frenchWord);
            data.englishWord = findingWord;
            data.frenchWord = frenchWord;
            data.frequency = wordCount;
            frequencyData.push(data);
            return word;
        }
    })
});
fs.writeFileSync(outputFile, inputData);

const csvWriter = createCsvWriter({
    path: './output/frequency.csv',
    header: [
        { id: 'englishWord', title: 'English word' },
        { id: 'frenchWord', title: 'French word' },
        { id: 'frequency', title: 'Frequency' }
    ]
});
csvWriter.writeRecords(frequencyData);

const stop = new Date();
const used = process.memoryUsage().heapUsed / 1024 / 1024;
const timeTaken = (stop-start)/1000;
console.log("Time taken to complete ",timeTaken, " seconds");
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

const performanceData = "Time to process: "+((timeTaken/60)<1?0:(timeTaken/60))+" minutes "+timeTaken+" seconds"+"\n"+"Memory used: "+(Math.round(used * 100) / 100)+" MB";
fs.writeFileSync('./output/performance.txt', performanceData);