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

function createImportService(className, savedData) {
    console.log(savedData);
    let entity = `<?php`
    entity += `\n\ndeclare(strict_types=1);`
    entity += `\n\nnamespace App\Service;`
    entity += `\n\nuse App\Entity\\${className};`
    entity += `\nuse DateTime;`
    entity += `\nuse Doctrine\ORM\EntityManagerInterface;`
    entity += `\nuse Exception;`
    entity += `\nuse Psr\Log\LoggerInterface;`
    entity += `\nuse Symfony\Component\Validator\Validator\ValidatorInterface;`
    entity += `\n\nreadonly class ${className}ImporterService`
    entity += `\n{`
    entity += `\n\n\t/**`
    entity += `\n\t * @param EntityManagerInterface $entityManager`
    entity += `\n\t * @param ValidatorInterface $validator`
    entity += `\n\t * @param LoggerInterface $logger`
    entity += `\n\t */`
    entity += `\n\tpublic function __construct(private EntityManagerInterface $entityManager,`
    entity += `\n\t\t\t\t\t\tprivate ValidatorInterface     $validator,`
    entity += `\n\t\t\t\t\t\tprivate LoggerInterface        $logger)`
    entity += `\n\t{`
    entity += `\n\t}`
    entity += `\n\n\t/**`
    entity += `\n\t * Imports object from a CSV file that matches specifications, persisting them in the database.`
    entity += `\n\t *`
    entity += `\n\t * @param string $csvFilePath The path to the CSV file to import.`
    entity += `\n\t * @param int $batchSize The number of items to persist in a batch. This is used to prevent memory issues, as a`
    entity += `\n\t * large number of items written to the DB at once will use up a lot of memory. The default value is 20, but it can`
    entity += `\n\t * be tweaked for better performance.`
    entity += `\n\t * @return void`
    entity += `\n\t * @throws Exception`
    entity += `\n\t */`
    entity += `\n\tpublic function persistObjects(string $csvFilePath, int $batchSize = 20): int`
    entity += `\n\t{`
    entity += `\n\t\t$totalPersistedItems = 0;`
    entity += `\n\t\t/** @var false|resource $handle */`
    entity += `\n\t\t$handle = fopen($csvFilePath, "r");`
    entity += `\n\n\t\tif ($handle !== false) {`
    entity += `\n\t\t\t$header = $this->obtainHeaderFromCSV($handle);`
    entity += `\n\n\t\t\twhile (($row = $this->obtainCurrentRowFromCSV($handle)) !== FALSE) {`
    entity += `\n\t\t\t\t$object = $this->createObject(array_combine($header, $row));`
    entity += `\n\n\t\t\t\t$errors = $this->validator->validate($object);`
    entity += `\n\t\t\t\tif (count($errors) > 0) {`
    entity += `\n\t\t\t\t\t$this->logger->error((string)$errors);`
    entity += `\n\t\t\t\t} else {`
    entity += `\n\t\t\t\t\t$this->entityManager->persist($object);`
    entity += `\n\t\t\t\t\t$this->writeToDatabaseIfBatchIsFull($totalPersistedItems++, $batchSize);`
    entity += `\n\t\t\t\t}`
    entity += `\n\t\t\t}`
    entity += `\n\t\t\tfclose($handle);`
    entity += `\n\t\t\t$this->entityManager->flush();`
    entity += `\n\t\t\t$this->entityManager->clear();`
    entity += `\n\t\t}`
    entity += `\n\t\treturn $totalPersistedItems;`
    entity += `\n\t}`
    entity += `\n\n\t/**`
    entity += `\n\t * Obtains the header of a CSV file. The header is the first row of the CSV file, and it contains the names of the`
    entity += `\n\t * columns. This function also returns the header with the BOM removed if it exists at the beginning of the file.`
    entity += `\n\t * @param resource $handle`
    entity += `\n\t * @return array`
    entity += `\n\t */`
    entity += `\n\tpublic function obtainHeaderFromCSV($handle): array`
    entity += `\n\t{`
    entity += `\n\t\t$header = fgetcsv($handle);`
    entity += `\n\t\t$header[0] = $this->removeBomUtf8IfItExists($header[0]);`
    entity += `\n\t\treturn $header;`
    entity += `\n\t}`
    entity += `\n\n\t/**`
    entity += `\n\t * CSV files are encoded in UTF-8, but sometimes they have a BOM at the beginning of the file. This might happen`
    entity += `\n\t * if you save a CSV file in Excel. This function removes the BOM if it exists at the beginning of a string and`
    entity += `\n\t * can ensure that the first row of a CSV file is read correctly.`
    entity += `\n\t * @param string $s`
    entity += `\n\t * @return string`
    entity += `\n\t */`
    entity += `\n\tfunction removeBomUtf8IfItExists(string $s): string`
    entity += `\n\t{`
    entity += `\n\t\tif (substr($s, 0, 3) ==`
    entity += `\n\t\t\tchr(hexdec('EF')) .`
    entity += `\n\t\t\tchr(hexdec('BB')) .`
    entity += `\n\t\t\tchr(hexdec('BF'))) {`
    entity += `\n\t\t\treturn substr($s, 3);`
    entity += `\n\t\t} else {`
    entity += `\n\t\t\treturn $s;`
    entity += `\n\t\t}`
    entity += `\n\t}`
    entity += `\n\n\t/**`
    entity += `\n\t * Retrieves the next row from the CSV file and returns it as an associative array, replacing empty strings with null.`
    entity += `\n\t * If the end of the file is reached, it returns false.`
    entity += `\n\t * @param resource $handle`
    entity += `\n\t * @return array | false`
    entity += `\n\t */`
    entity += `\n\tprivate function obtainCurrentRowFromCSV($handle): array|false`
    entity += `\n\t{`
    entity += `\n\t\t/** @var array|false $row */`
    entity += `\n\t\t$row = fgetcsv($handle);`
    entity += `\n\t\treturn $row === false ? false : array_map(function ($value) {`
    entity += `\n\t\t\treturn $value === '' ? null : $value;`
    entity += `\n\t\t}, $row);`
    entity += `\n\t}`
    entity += `\n\n\t/**`
    entity += `\n\t * Create an object from a well-formed associative array`
    entity += `\n\t * @param array $match`
    entity += `\n\t * @throws Exception`
    entity += `\n\t */`
    entity += `\n\tpublic function createObject(array $row)`
    entity += `\n\t{`
    entity += `\n\t\t$object = new ${className}();`

    for(let i = 1; i < savedData.length; i++) {
        let dataPart = savedData[i].phpPropertyName;

        entity += `\n\t\t$object->set${dataPart[0].toUpperCase()+dataPart.slice(1)}($row['${savedData[i].name}']);`
    }
    entity += `\n\t\treturn $object;`
    entity += `\n\t}`
entity += `\n\n\t/**`
    entity += '\n    /**';
    entity += '\n     * Writes the object to the database, if enough have been created to fill a batch.';
    entity += '\n     * @param int $totalPersistedItems';
    entity += '\n     * @param int $batchSize';
    entity += '\n     * @return void';
    entity += '\n     */';
    entity += `\n    private function writeToDatabaseIfBatchIsFull(int $totalPersistedItems, int $batchSize): void`;
    entity += '\n    {';
    entity += '\n        if ($totalPersistedItems % $batchSize === 0) {';
    entity += '\n            $this->entityManager->flush();';
    entity += '\n            $this->entityManager->clear();';
    entity += '\n        }';
    entity += '\n    }';

entity +='\n}';
    return entity;
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

document.getElementById("generateClassButton").addEventListener("click", function(){
    // Generate download of class file
    let namespace = document.getElementById("namespaceInput").value;
    let className = document.getElementById("classNameInput").value;
    let filename = className + ".php";

    download(filename, createSymfonyEntityClass(namespace, className, savedData));
}, false);

document.getElementById("generateXMLOrmFile").addEventListener("click", function(){
    // Generate download of class file
    let className = document.getElementById("classNameInput").value;
    let tableName = document.getElementById("tableNameInput").value;
    let filename = className + ".orm.xml";

    download(filename, createSymfonyXMLFile(className, tableName, savedData));
}, false);

document.getElementById("generateImportService").addEventListener("click", function(){
    // Generate download of class file
    let className = document.getElementById("classNameInput").value;
    let filename = className + "ImportService.php";

    download(filename, createImportService(className, savedData));
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
    // Remove leading and trailing spaces
    let trimmed = headerColumn.trim();

    // Remove consecutive spaces
    let noConsecutiveSpaces = trimmed.replace(/\s+/g, ' ');

    // Remove special characters
    let noSpecialChars = noConsecutiveSpaces.replace(/[^\w\s]/g, '');

    // Convert to lowercase
    let lowercase = noSpecialChars.toLowerCase();

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

function createSymfonyXMLFile(entityName, tableName, data) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<doctrine-mapping xmlns="http://doctrine-project.org/schemas/orm/doctrine-mapping"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://doctrine-project.org/schemas/orm/doctrine-mapping
                                      https://doctrine-project.org/schemas/orm/doctrine-mapping.xsd">`
    xml += `\n\n\t<entity name="${entityName}" table="${tableName}">`
    xml += `\n\n\t\t<id name="id" type="integer" column="id">`
    xml += `\n\t\t\t<generator strategy="AUTO"/>`
    xml += `\n\t\t</id>`
    for (let i=1; i<data.length; i++) {
        let dataPart = data[i];
        xml += `\n\n\t\t<field name="${dataPart.phpPropertyName}" column="${dataPart.sqlColumnName}" nullable="true" type="${dataPart.doctrineDataType}"/>`
    }
    xml += `\n\n\t</entity>`
    xml += `\n\n</doctrine-mapping>`
    return xml;
}

function createSymfonyEntityClass(namespace, className, data) {
    let entity = `<?php`
    entity += `\n\nnamespace ${namespace};`
    entity += `\n\nuse Doctrine\\ORM\\Mapping as ORM;`
    entity += `\n\n`
    entity += '\n use DateTimeInterface;'
    entity += `\n class ${className}`
    entity += '\n {'
    entity += '\n private $id;'

    for (let i=1; i<data.length; i++) {
        let dataPart = data[i];

        entity += `\n`
        entity += `\n private $${dataPart.phpPropertyName};`
    }

    //add setters and getters
    for (let i=1; i<data.length; i++) {
        let dataPart = data[i];
        console.log(dataPart);
        entity += `\n\n`
        entity += `\n public function get${dataPart.phpPropertyName}():`
        entity += `\n {`
        entity += `\n return $this->${dataPart.phpPropertyName};`
        entity += `\n }`
        entity += `\n\n`
        entity += `\n public function set${dataPart.phpPropertyName[0].toUpperCase()+dataPart.phpPropertyName.slice(1)}(${dataPart.phpPropertyName}): self`
        entity += `\n {`
        entity += `\n $this->${dataPart.phpPropertyName} = $${dataPart.phpPropertyName};`
        entity += `\n\n return $this;`
        entity += `\n }`
    }
    entity += `\n }`

    return entity;
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

