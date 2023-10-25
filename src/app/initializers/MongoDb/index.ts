const { MongoClient } = require('mongodb');

const { logger } = require('../../libs/logger');

class mongoDBClient {
	dbName;
	dbUri;
	dbColl;
	db;
	connection;

	constructor({ dbName, dbUri, dbColl }) {
		this.dbName = dbName;
		this.dbUri = dbUri;
		this.dbColl = dbColl;
	}

	async connect() {
		const connection = await MongoClient.connect(this.dbUri);
		this.db = connection.db();
		logger.info('[MONGODB] Connection successfull.');
		return;
	}

	async findDocumentsByQuery({ query }) {
		await this.connect()
		const results = await this.db.collection(this.dbColl).find(query).toArray()
		this.close();
		return results
	}
	
	async insertDocument({ document }) {
		if (!isObject(document)) {
			throw new Error(
				'[MONGODB] insertDocumentWithIndex: document is not an object'
			);
		}
		await this.connect()
		const results = await this.db.collection(this.dbColl).insertOne(document);
		this.close();
		return results
	}

	async updateDocument({ query, values }) {
		logger.info(`[MONGODB] Modifying ${query}.`);
		if (!(isObject(values) && isObject(query))) {
			throw Error(
				'mongoClient.upsert: values, query and option should be an object.'
			);
		}
		logger.info(`[MONGODB] ${query} modified successfully.`);
		await this.connect();
		const res = await this.db
			.collection(this.dbColl)
			.updateOne(query, values, {} || {});

		this.close();
		return res;
	}

	async close() {
		logger.info(`[MONGODB] Closing connection...`);
		if (this.connection) this.connection.close();
		logger.info(`[MONGODB] Connection closed...`);
		return;
	}

	async dropDB() {
		logger.info(`[MONGODB] Dropping DB ${this.dbName}...`);
		await this.connect();
		await this.db.dropDatabase();
		logger.info(`[MONGODB] Dropped DB ${this.dbName}`);
		return;
	}
}

function isObject(obj) {
	return Object.keys(obj).length > 0 && obj.constructor === Object;
}

export default mongoDBClient;
            