

// /* istanbul ignore file */
// require('dotenv').config();
// import { rm, readFile } from 'node:fs/promises';
// const expect = require('chai').expect;
// import * as path from 'path';
// import config from '../config';
// import { logger } from '../../app/libs/logger';
// import { makeInputObj } from '../../app/component/entities';
// import {
//     checkDir,
//     readFromFile,
//     writeToFile
// } from '../../app/component/data-access';
// import createPost from '../../app/component/use-cases/post';


// const post = ({ params }) =>
//     createPost({
//         makeInputObj,
//         checkDir,
//         readFromFile,
//         writeToFile,
//         logger
//     })
//         .post({
//             params,
//             filename: config.FILE_DB_NAME,
//             fileDirPath: config.FILE_FOLDER_PATH,
//             fileDirName: config.FILE_FOLDER_NAME,
//             filePath: config.FILE_DB_PATH,
//             errorMsgs: config.ERROR_MSG.post
//         });

// describe('Post', () => {
//     after(() => rm(config.FILE_FOLDER_PATH, { recursive: true }))

//     it('should insert a user', async () => {
//         const params = {
//             username: config.TEST_DATA.user1.username,
//             password: config.TEST_DATA.user1.password,
//             email: config.TEST_DATA.user1.email
//         }
//         const results = await post({ params });
//         const fileContentbuffer = await readFile(config.FILE_DB_PATH);
//         const fileContent = fileContentbuffer.toString('utf8')
//         const users = JSON.parse(fileContent)
//         expect(results).to.have.property('username').equal(params.username);
//         expect(users.length).to.equal(1);
//         expect(users[0]).to.have.property('username').equal(params.username);
//     });

//     it('should not insert an empty user', async () => {
//         const params = {
//             username: undefined,
//             password: undefined,
//             email: undefined
//         }
//         try {
//             let results = await post({ params });
//         } catch (err) {
//             logger.info('Error:', err);
//             expect(err.message).to.equal(`${config.ERROR_MSG.post.MISSING_PARAMETER}`);
//         }
//     });

//     it('should not insert an existing user', async () => {
//         const params = {
//             username: config.TEST_DATA.user1.username,
//             password: config.TEST_DATA.user1.password,
//             email: config.TEST_DATA.user1.email
//         }
//         try {
//             let results = await post({ params });
//         } catch (err) {
//             expect(err.message).to.equal(config.ERROR_MSG.post.EXISTING_USER);
//         }
//     });

//     it('should insert another user', async () => {
//         const params = {
//             username: config.TEST_DATA.user2.username,
//             password: config.TEST_DATA.user2.password,
//             email: config.TEST_DATA.user2.email
//         }
//         await post({ params });
//         const results = await readFile(config.FILE_DB_PATH, { encoding: 'utf8' })
//         expect(Object.keys(JSON.parse(results)).length).to.equal(2)
//     });
// })

/* istanbul ignore file */
require('dotenv').config();

import { findDocuments as dbFindDocuments, dropDb } from '../../app/libs/mongodb'
const expect = require('chai').expect;
import config from '../config';
import { logger } from '../../app/libs/logger';
import { makeInputObj } from '../../app/component/entities';
import {
  insertDocument,
  findDocuments,
} from '../../app/component/data-access';
import createPost from '../../app/component/use-cases/post';

const post = ({ params }) => 
  createPost({
    makeInputObj,
    insertDocument,
    findDocuments,
    logger,
    get: undefined
  })
  .post({
    params,
    dbConfig: config.DB_CONFIG,
    errorMsgs: config.ERROR_MSG.post
  });

describe('Post', () => {
  after(async () => {
    await dropDb({ test: true, ...config.DB_CONFIG })
  })

  it('should insert a user', async () => {
		const params = {
      username: config.TEST_DATA.user1.username,
      password: config.TEST_DATA.user1.password,
      email: config.TEST_DATA.user1.email
    }
    const results = await post({ params });
    const query = { username: params.username, email: params.email }
    console.log(query)
    const dbContent = await dbFindDocuments({ query, ...config.DB_CONFIG });
    expect(dbContent[0]).to.have.property('username').equal(params.username);
    expect(dbContent.length).to.equal(1);
	});

  it('should not insert an empty user', async () => {
		const params = {
      username: undefined,
      password: undefined,
      email: undefined
    }
    try {
      let results = await post({ params });
    } catch (err) {
      expect(err.message).to.equal(`${ config.ERROR_MSG.post.MISSING_PARAMETER }username`);
    }
	});

  it('should not insert a user without password', async () => {
		const params = {
      username: config.TEST_DATA.user1.username,
      password: undefined,
      email: undefined
    }
    try {
      let results = await post({ params });
    } catch (err) {
      expect(err.message).to.equal(`${ config.ERROR_MSG.post.MISSING_PARAMETER }password`);
    }
	});

  it('should not insert a user without email', async () => {
		const params = {
      username: config.TEST_DATA.user1.username,
      password: config.TEST_DATA.user1.password,
      email: undefined
    }
    try {
      let results = await post({ params });
    } catch (err) {
      expect(err.message).to.equal(`${ config.ERROR_MSG.post.MISSING_PARAMETER }email`);
    }
	});

  it('should not insert an existing user', async () => {
		const params = {
      username: config.TEST_DATA.user1.username,
      password: config.TEST_DATA.user1.password,
      email: config.TEST_DATA.user1.email
    }
    try {
      let results = await post({ params });
    } catch (err) {
      expect(err.message).to.equal(config.ERROR_MSG.post.EXISTING_USER);
    }
	});

  it('should insert another user', async () => {
		const params = {
      username: config.TEST_DATA.user2.username,
      password: config.TEST_DATA.user2.password,
      email: config.TEST_DATA.user1.email
    }
    await post({ params });
    const query = {}
    const dbContent = await dbFindDocuments({ query, ...config.DB_CONFIG });
    expect(dbContent.length).to.equal(2)
	});
})