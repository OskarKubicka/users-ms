export default function makeReadFromFile({
    readFile,
    logger
  }) {
    return Object.freeze({ readFromFile })
    
    async function readFromFile({ filePath, filename }) {
      try {
        logger.info(`[DATA-ACCESS][READ-FROM-FILE] Reading from ${ filename } - START!`);
        const content = await readFile(filePath, { encoding: 'utf8'});
        logger.info(`[DATA-ACCESS][READ-FROM-FILE] Reading from ${ filename } - DONE!`);
        return content && content.length ? JSON.parse(content) : []
      } catch (e) {
        logger.info(`[DATA-ACCESS][READ-FROM-FILE] ${ filename } - Does not exists!`);
        if (e.message.includes('no such')) return []
        throw e
      }
    }
  }