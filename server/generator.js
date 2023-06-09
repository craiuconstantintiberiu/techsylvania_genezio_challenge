
export class GeneratorService {
    constructor() {
        console.log("Constructor called!")
    }


     createImportService(className, savedData) {
        savedData = JSON.parse(savedData);
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

            entity += `\n\t\t$object->set${dataPart[0].toUpperCase()+dataPart.slice(1)}($row['${savedData[i].columnName}']);`
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

     createSymfonyXMLFile(entityName, tableName, data) {
        data = JSON.parse(data);

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

     createSymfonyEntityClass(namespace, className, data) {
       data = JSON.parse(data);
        let entity = `<?php`
        entity += `\n\nnamespace ${namespace};`
        entity += `\n\nuse Doctrine\\ORM\\Mapping as ORM;`
        entity += `\n\n`
        entity += '\n use DateTimeInterface;'
        entity += `\n class ${className}`
        entity += '\n {'
        entity += '\n\tprivate $id;'

        for (let i=1; i<data.length; i++) {
            let dataPart = data[i];
            entity += `\n\tprivate $${dataPart.phpPropertyName};`
        }

        //add setters and getters
        for (let i=1; i<data.length; i++) {
            let dataPart = data[i];
            console.log(dataPart);
            entity += `\n`
            entity += `\n\t public function get${dataPart.phpPropertyName}():`
            entity += `\n\t {`
            entity += `\n\t\t return $this->${dataPart.phpPropertyName};`
            entity += `\n\t }`
            entity += `\n`
            entity += `\n\t public function set${dataPart.phpPropertyName[0].toUpperCase()+dataPart.phpPropertyName.slice(1)}(${dataPart.phpPropertyName}): self`
            entity += `\n\t {`
            entity += `\n\t\t $this->${dataPart.phpPropertyName} = $${dataPart.phpPropertyName};`
            entity += `\n\t\t return $this;`
            entity += `\n\t }`
        }
        entity += `\n }`

        return entity;
    }
}
