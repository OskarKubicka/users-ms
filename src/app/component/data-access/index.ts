import {
  insertOneDocument,
  updateDocument as makeUpdateDocument,
  findDocuments as makeFindDocuments 
} from '../../libs/mongodb';

const insertDocument = ({ document, dbConfig }) => insertOneDocument({ document, ...dbConfig });

const updateDocument = ({ query, values, dbConfig }) => makeUpdateDocument({ query, values, ...dbConfig });

const findDocuments = ({ query, dbConfig }) => makeFindDocuments({ query, ...dbConfig });

export {
  findDocuments,
  insertDocument,
  updateDocument
}