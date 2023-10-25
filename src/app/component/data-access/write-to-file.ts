export default function createWriteToFile({ writeFile, logger }) {
    return Object.freeze({ writeToFile });
    async function writeToFile({ content, filePath, filename }) {
      try {
        logger.info(`[DATA-ACCESS][WRITE-TO-FILE] Writing to ${ filename } - START!`);
        const newContent = JSON.stringify(content);
        await writeFile(filePath, newContent);
        logger.info(`[DATA-ACCESS][WRITE-TO-FILE] Writing to ${ filename } - DONE!`);
        return;
      } catch(e) {
        throw e
      }
    }
  }