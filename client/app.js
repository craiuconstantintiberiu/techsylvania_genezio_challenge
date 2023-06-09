import {GeneratorService} from "./sdk/generatorService.sdk.js"

const SQLToDoctrineDeclarativeSchemaDataTypes = {
    "TEXT": "string",
    "INTEGER": "integer",
    "FLOAT": "float",
    "DATETIME": "datetime"
}

const inputHeader = document.getElementById('inputHeader');
const inputRow = document.getElementById('inputRow');
const submitButton = document.getElementById('submitButton');
let savedData = [];
const phpColumns = [];
const doctrineColumns = [];
const resetButton = document.getElementById('resetButton');

function goToImportStage() {
    document.getElementById('import').classList.remove('hidden');
    document.getElementById('inferDiv').classList.add('hidden');
    document.getElementById('inputGenerate').classList.add('hidden');
    inputHeader.value = "Company, Ticker, Sector, industry, market cap, Revenue %, Net Income, EBITDA, EPS, P/E, P/S, P/B, dividend yield, ROA, ROE, ROI, Debt Equity Ratio, Current Ratio, Quick Ratio, Operating Margin, Profit Margin, Gross Margin, Asset Turnover, Inventory Turnover, Accounts Receivable Turnover, Days Sales Outstanding, Days Inventory, Days Payable Outstanding, Working Capital, Free Cash Flow, Operating Cash Flow, Investing Cash Flow, Financing Cash Flow, Capital Expenditure, Dividends Paid, Stock Repurchases, Shareholders Equity, Total Assets, Total Liabilities, Long-Term Debt, Short-Term Debt, Cash, Restricted Cash, Accounts Receivable, Inventory, Prepaid Expenses, Property Plant Equipment, Goodwill, Intangible Assets, Long-Term Investments, Other Assets, Accounts Payable, Accrued Expenses, Deferred Revenue, Long-Term Liabilities, Current Portion Of Long-Term Debt, Income Tax Payable, Deferred Tax Liabilities, Other Liabilities, Common Stock, Preferred Stock, Additional Paid-In Capital, Retained Earnings, Treasury Stock, Other Stockholders Equity, Revenue Growth, Net Income Growth, EPS Growth, ROA Growth, ROE Growth, ROI Growth, Dividend Growth, Debt Equity Ratio Growth, Current Ratio Growth, Quick Ratio Growth, Operating Margin Growth, Profit Margin Growth, Gross Margin Growth, Asset Turnover Growth, Inventory Turnover Growth, Accounts Receivable Turnover Growth, Days Sales Outstanding Growth, Days Inventory Growth, Days Payable Outstanding Growth, Working Capital Growth, Free Cash Flow Growth, Operating Cash Flow Growth, Investing Cash Flow Growth, Financing Cash Flow Growth, Capital Expenditure Growth, Dividends Paid Growth, Stock Repurchases Growth, Shareholders Equity Growth, Total Assets Growth, Total Liabilities Growth, Long-Term Debt Growth, Short-Term Debt Growth, Cash Growth, Restricted Cash Growth, Accounts Receivable Growth, Inventory Growth, Prepaid Expenses Growth, Property Plant Equipment Growth, Goodwill Growth, Intangible Assets Growth, Long-Term Investments Growth, Other Assets Growth, Accounts Payable Growth, Accrued Expenses Growth, Deferred Revenue Growth, Long-Term Liabilities Growth, Current Portion Of Long-Term Debt Growth, Income Tax Payable Growth, Deferred Tax Liabilities Growth, Other Liabilities Growth, Common Stock Growth, Preferred Stock Growth, Additional Paid-In Capital Growth, Retained Earnings Growth, Treasury Stock Growth, Other Stockholders Equity Growth, Price, Volume, Market Cap Growth, Price To Earnings Ratio Growth, Price To Sales Ratio Growth, Price To Book Ratio Growth, Dividend Yield Growth, Dividend Payout Ratio Growth, Share Price Growth";
    inputRow.value="Genezio,GNZ,Technology,Software,1500000000,50000000,20000000,30000000,2.5,20.0,1.5,1.2,2.0,0.15,0.08,0.1,1.8,1.2,1.0,0.25,0.18,0.35,1.5,4.5,6.0,40,60,30,1000000,2000000,1500000,1000000,500000,400000,100000,1500000,5000000,3000000,2000000,1000000,500000,200000,300000,150000,250000,100000,500000,200000,100000,800000,1000000,150000,500000,100000,200000,800000,1000000,500000,400000,200000,300000,400000,200000,300000,150000,500000,200000,300000,150000,250000,100000,500000,200000,100000,800000,1000000,150000,500000,100000,200000,800000,1000000,500000,400000,200000,300000,400000,200000,300000,150000,500000,200000,300000,150000,250000,100000,500000,200000,100000,800000,1000000,150000,500000,100000,200000,800000,1000000,500000,400000,200000,300000,400000,200000,300000,150000,500000,200000,300000,150000,250000,100000,500000,200000,100000,800000,1000000,150000,500000,100000,200000"
}

resetButton.addEventListener('click', () => {
    inputHeader.value = "";
    inputRow.value = "";
    savedData = [];
    document.getElementById('tableCont').innerHTML = "";
    goToImportStage();
});

function saveTableData() {
    let tableRows = document.querySelectorAll("#tableCont table tbody tr");
    savedData = [];
    let first = true;
    let iter = 0;
    tableRows.forEach((row) => {
        iter++;
        if(first) {
            first = false;
            return;
        }
        const rowData = {};
        const cells = row.querySelectorAll("th, td");

        rowData.columnName = cells[0].textContent;
        rowData.csvRowValue = cells[1].textContent;
        rowData.doctrineDataType = cells[2].querySelector("select")
            ? cells[2].querySelector("select").value
            : cells[2].textContent;
        rowData.phpPropertyName = cells[3].textContent;
        phpColumns.push(rowData.phpPropertyName);
        rowData.sqlColumnName = cells[4].textContent;
        doctrineColumns.push(rowData.sqlColumnName);
        savedData.push(rowData);
    });
    console.log(savedData);

    return savedData;
}



function transitionToGenerationStage() {

    savedData = saveTableData();
    //delete table
    var tables= document.getElementsByTagName('table');
    while (tables.length>0)
        tables[0].parentNode.removeChild(tables[0]);
    let tableContainer = document.getElementById("tableCont");
    tableContainer.innerHTML = "";
    let inferDiv = document.getElementById("inferDiv");
    inferDiv.classList.add("hidden");

    //unhide inputs
    const inputs = document.getElementById("inputGenerate");
    inputs.classList.remove("hidden");

}

document.getElementById("generateClassButton").addEventListener("click", async function () {
    // Generate download of class file
    let namespace = document.getElementById("namespaceInput").value;
    let className = document.getElementById("classNameInput").value;
    let filename = className + ".php";

    download(filename, await GeneratorService.createSymfonyEntityClass(namespace, className, savedData));
}, false);

document.getElementById("generateXMLOrmFile").addEventListener("click", async function () {
    // Generate download of class file
    let className = document.getElementById("classNameInput").value;
    let tableName = document.getElementById("tableNameInput").value;
    let filename = className + ".orm.xml";

    download(filename, await GeneratorService.createSymfonyXMLFile(className, tableName, JSON.stringify(savedData)));
}, false);

document.getElementById("generateImportService").addEventListener("click", async function () {
    // Generate download of class file
    let className = document.getElementById("classNameInput").value;
    let filename = className + "ImportService.php";


    download(filename, await GeneratorService.createImportService(className, JSON.stringify(savedData)));
}, false);

function transitionToDataInferenceStage() {
    {
        document.getElementById("import").classList.add("hidden");
        document.getElementById("inferDiv").classList.remove("hidden");
        const mapped = mapHeaderToRow(inputHeader.value, inputRow.value);
        console.log(mapped);
        const mappedColumns = mapHeaderToSQLDatatype(mapped);
        const mappedColumnsSQLCompatible = {};
        for (const key in mappedColumns) {
            mappedColumnsSQLCompatible[convertHeaderColumnToSQLCompatibleRow(key)] = mappedColumns[key];
        }
        console.log(mappedColumnsSQLCompatible);
        const mappedColumnsDoctrineCompatible = {};
        for (const key in mapped) {
            mappedColumnsDoctrineCompatible[key] = inferDataType[mapped[key]];
            console.log(mappedColumnsDoctrineCompatible[key])
        }
        console.log(mappedColumnsDoctrineCompatible);
        const mappedColumnsPHPCompatible = {};
        for (const key in mappedColumns) {
            mappedColumnsPHPCompatible[key] = convertHeaderColumnToPHPCompatiblePropertyName(key);
        }
        console.log(mappedColumnsPHPCompatible);


        const tableInfo = document.getElementById("tableInfo");
        tableInfo.classList.remove("hidden");
        const tableContainer = document.getElementById("tableCont");
// Create the table HTML
        const table = document.createElement("table");
        const tableBody = document.createElement("tbody");

        //create table header
        const headerRow = document.createElement("tr");
        const headerCell = document.createElement("th");
        headerCell.textContent = "Column Name";
        headerRow.appendChild(headerCell);
        const headerCell4 = document.createElement("th");
        headerCell4.textContent = "CSV Row value";
        headerRow.appendChild(headerCell4);
        const headerCell2 = document.createElement("th");


        headerCell2.textContent = "Doctrine Datatype";
        headerRow.appendChild(headerCell2);
        const headerCell3 = document.createElement("th");
        headerCell3.textContent = "PHP Property Name";
        headerRow.appendChild(headerCell3);
        tableBody.appendChild(headerRow);
        const headerCell5 = document.createElement("th");
        headerCell5.textContent = "SQL Column name";
        headerRow.appendChild(headerCell5);


// Create the table rows
        for (const columnName in mappedColumns) {
            const row = document.createElement("tr");

            const headerCell = document.createElement("th");
            headerCell.textContent = columnName;
            row.appendChild(headerCell);

            const csvCell = document.createElement("td");
            csvCell.textContent = mapped[columnName];
            row.appendChild(csvCell);

            const dataCell = document.createElement("td");
            const select = document.createElement("select");
            select.innerHTML = `
        <option value=${SQLToDoctrineDeclarativeSchemaDataTypes.TEXT}>string</option>
        <option value="${SQLToDoctrineDeclarativeSchemaDataTypes.INTEGER}">integer</option>
        <option value="${SQLToDoctrineDeclarativeSchemaDataTypes.FLOAT}">float</option>
        <option value="${SQLToDoctrineDeclarativeSchemaDataTypes.DATETIME}">datetime</option>
    `;
            select.value = mappedColumns[columnName];
            dataCell.appendChild(select);
            row.appendChild(dataCell);


            const propertyCell = document.createElement("td");
            propertyCell.textContent = mappedColumnsPHPCompatible[columnName];
            propertyCell.contentEditable = true;
            row.appendChild(propertyCell);

            const sqlCell = document.createElement("td");
            sqlCell.textContent = convertHeaderColumnToSQLCompatibleRow(columnName);
            sqlCell.contentEditable = true;
            row.appendChild(sqlCell);

            tableBody.appendChild(row);
        }

// Add the table to the document
        table.appendChild(tableBody);
        tableContainer.appendChild(table);
        // document.getElementById("app").appendChild(table);


        // Hide the input div
        const importDiv = document.getElementById("import");
        importDiv.classList.add("hidden");
        //unhide the generate button
        let generateButton = document.getElementById("generateButton");
        generateButton.classList.remove("hidden");

    }

}
document.getElementById("generateButton").addEventListener('click', () => {
    transitionToGenerationStage();
});

// add event listener to submit button
submitButton.addEventListener('click', () => {
    //validate CSV
    if (!validateCSV(inputHeader.value, inputRow.value)) {
        alert("Invalid CSV - non-empty CSV rows must be added, containing same number of columns. Header row must not contain empty or duplicate column names, this is not allowed => Col1,,Col3");
    } else transitionToDataInferenceStage();
});

function validateCSV(csvHeader, csvRow) {
    if (!csvHeader || !csvRow) {
        console.log("empty csv")
        return false;
    }

    // header and row must have the same number of columns.  That is, same number of commas
    let headerCommas = csvHeader.split(",").length;
    let rowCommas = csvRow.split(",").length;
    if (headerCommas !== rowCommas) {
        console.log("header and row must have the same number of columns")
        return false;
    }

    //header column must not have identical columns
    let headerColumns = csvHeader.split(",");
    let uniqueHeaderColumns = [...new Set(headerColumns)];
    if (headerColumns.length !== uniqueHeaderColumns.length) {
        console.log("header column must not have identical columns")
        return false;
    }

    // header column must also not have empty columns
    for (const column of headerColumns) {
        if (column === "") {
            console.log("header column must not have identical columns")
            return false;
        }
    }
    return true;
}

function inferDataType(str) {

    // Check for INTEGER
    if (/^\d+$/.test(str)) {
        return SQLToDoctrineDeclarativeSchemaDataTypes.INTEGER;
    }

    // Check for FLOAT
    if (/^(\d+\.\d+|\.\d+|\d+\.|\d+)$/.test(str)) {
        return SQLToDoctrineDeclarativeSchemaDataTypes.FLOAT;
    }

    // Check for DATETIME
    if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(str) || /\d{4}-\d{2}-\d{2}/.test(str)) {
        return SQLToDoctrineDeclarativeSchemaDataTypes.DATETIME;
    }

    // If no match, default to TEXT
    return SQLToDoctrineDeclarativeSchemaDataTypes.TEXT;
}

function convertHeaderColumnToSQLCompatibleRow(headerColumn) {
    // Remove special characters
    let noSpecialChars = headerColumn.replace(/[^\w\s]/g, ' ');

    // Remove leading and trailing spaces
    let trimmed = noSpecialChars.trim();

    // Remove consecutive spaces
    let noConsecutiveSpaces = trimmed.replace(/\s+/g, ' ');

    // Convert to lowercase
    let lowercase = noConsecutiveSpaces.toLowerCase();

    // Replace spaces with underscores
    let converted = lowercase.replace(/\s+/g, '_');

    return converted;
}


function convertHeaderColumnToPHPCompatiblePropertyName(headerColumn) {

    // Remove special characters
    let noSpecialChars = headerColumn.replace(/[^\w\s]/g, ' ');


    // Remove leading and trailing spaces
    let trimmed = noSpecialChars.trim();

    // Remove consecutive spaces
    let noConsecutiveSpaces = trimmed.replace(/\s+/g, ' ');

    console.log(noSpecialChars)

    // Convert to lowercase
    let lowercase = noConsecutiveSpaces.toLowerCase();

    console.log(lowercase)

    // Remove spaces, capitalize first letter of each word, and remove underscores
    let words = lowercase.split(' ');
    let converted = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    console.log(converted)

    // Convert first letter to lowercase
    let convertedCamelCase = converted[0].toLowerCase() + converted.slice(1);

    return convertedCamelCase;

}

function mapHeaderToRow(csvHeader, csvRow) {
    const header = csvHeader.split(",");
    const row = csvRow.split(",");
    const mapped = {};
    for (let i = 0; i < header.length; i++) {
        mapped[header[i]] = row[i];
    }
    return mapped;
}

function mapHeaderToSQLDatatype(headerColumns) {
    const mapped = {};
    for (const key in headerColumns) {
        mapped[key] = inferDataType(headerColumns[key]);
    }
    return mapped;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

