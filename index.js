const {
  buildConnection,
  closeConnection,
  findUsers,
  insertUser,
  insertUniqueUser,
  updateUser,
  findMessages,
  insertMessages,
  updateMessages
} = require('./app');

(()=>{
  insertUniqueUser(
    {"account" : "yc13",
    "password" : "at575dang350",
    "firstName" : "Xin",
    "lastName" : "Chang",
    "email" : "j123456159@gmail.com",
    "id" : "1"}
  ).then(async (result)=>{
    await closeConnection()
  })
})()
