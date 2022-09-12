const { MongoClient } = require("mongodb");
const { getCurrentTime } = require("./utils.js");

// Connection URI
const uri = "mongodb://127.0.0.1:27017";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Default connected status
let connected = false;

// Connect the client to the server
async function buildConnection() {
  connected = connected ? true : await client.connect();
}

async function closeConnection() {
  await client.close();
}

async function findUsers(filter = {}) {
  await buildConnection();
  const db = client.db("users");
  const usersCollection = db.collection("users");
  const user = usersCollection.find(filter);
  const usertoArray = await user.toArray();
  console.log(usertoArray);
  return usertoArray;
}

async function insertUniqueUser(newUser) {
  await buildConnection();
  const db = client.db("users");
  const usersCollection = db.collection("users");
  const existedUser = await findUsers({ account: newUser["account"] });

  if (existedUser.length > 0) {
    console.log("User existed");
    await client.close();
    return false;
  } else {
    const user = await usersCollection.insertOne(newUser);
    console.log(user["ops"]);
    return true;
  }
}

// async function updateUser(user,attributes) {
//   await buildConnection()
//   const db = client.db('users')
//   const usersCollection = db.collection('users');
//   const updatedUser = await usersCollection.updateOne(user,{$set:attributes});
//   console.log(updatedUser)
// }

async function findMessages(user, channel) {
  await buildConnection();
  const db = client.db("chat");
  const usersCollection = db.collection("users");
  const users = usersCollection.find(user);
  const usertoArray = await users.toArray();
  console.log(usertoArray);
  if (usertoArray.length > 0) {
    const userAccount = usertoArray[0]["account"];
    const messagesCollection = db.collection("messages");
    const allMessages = messagesCollection.find({ account: userAccount });
    const allMessagestoArray = await allMessages.toArray();
    console.log(allMessagestoArray);
    return allMessagestoArray;
  } else {
    return false;
  }
}

async function insertMessages(user, newMessages) {
  await buildConnection();
  const db = client.db("chat");
  const messagesCollection = db.collection("messages");
  const userAccount = user["account"];
  const messageContent = newMessages["text"];
  const currentTime = getCurrentTime();
  const messages = {
    account: userAccount,
    text: messageContent,
    cdate: currentTime,
    updatedDatetime: currentTime,
  };
  console.log(messages);
  await messagesCollection.insertOne(messages);
  return true;
}

async function updateMessages(messageId, newText) {
  await buildConnection();
  const db = client.db("chat");
  const messagesCollection = db.collection("messages");
  const updateContent = {
    $set: {
      text: newText,
    },
  };
  await messagesCollection
    .updateOne({ _id: messageId }, updateContent, { upsert: false })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });

  // const targetMessage = messagesCollection.find({_id: messageId});
  // const targetMessagestoArray = await targetMessage.toArray();
  // console.log(targetMessagestoArray)
  // const userAccount = user["account"];
  // const messageContent = message["text"];
}

// findMessages({account:'yc9'})
// .then(async (result)=>{
//   await closeConnection()
// })

// updateMessages('60bd9c7b2b7712e25e5f3746','12345tyhnmlo87trdsxcvbnjkuy')
// .then(async (result)=>{
//   await closeConnection()
// })

module.exports = {
  buildConnection,
  closeConnection,
  findUsers,
  insertUniqueUser,
  findMessages,
  insertMessages,
  updateMessages,
};
// insertUniqueUser(
//   {"account" : "yc12",
//   "password" : "at575dang350",
//   "firstName" : "Xin",
//   "lastName" : "Chang",
//   "email" : "j123456159@gmail.com",
//   "id" : "1"}
// ).then(async (result)=>{
//   await closeConnection()
// })

// insertMessages(
//   {"account":"yc9"},
//   {"text":"So Sad!!"}
// ).then(async (result)=>{
//   await closeConnection()
// })
