export default function createPost({
  makeInputObj,
  findDocuments,
  insertDocument,
  get,
  logger,
}) {
  return Object.freeze({ post });
  
  async function post({
    params,
    dbConfig,
    errorMsgs
  }){
    try {
      let user;
        logger.info('[POST][USE-CASE] Inserting object process - START!');
        const userFactory = makeInputObj({ params });
  
        user = {
          username: userFactory.username(),
          password: userFactory.password(),
          email: userFactory.email(),
          role: userFactory.role(),
          usernameHash: userFactory.usernameHash(),
          emailHash: userFactory.emailHash(),
          usernamePasswordHash: userFactory.usernamePasswordHash(),
          created: userFactory.created(),
          modified: userFactory.modified()
        }
        
        // 'or' query
        let query = { $or: [{username: user.username}, { email: user.email }] }
        const checkDuplicate = await findDocuments({ query, dbConfig })
        if (checkDuplicate.length) throw new Error(errorMsgs.EXISTING_USER);
        
        await insertDocument({ document: user, dbConfig });
        logger.info('[POST][USE-CASE] Inserting object process - DONE!');
        
        const inserted = get({ params: { username: user.username }});
  
        return inserted;
      } catch (err) {
        throw err.message;
      }
    }
}