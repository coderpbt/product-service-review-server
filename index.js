const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
var cors = require('cors')
require('dotenv').config()

var jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000

//middleware 
app.use(cors())
app.use(express.json())

/*
  mongodb conect
*/



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wwzdrm6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    const fitzeosCollection = client.db("fitzeosUserDb").collection("services");
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }
    const result = await fitzeosCollection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    
  } finally {

  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Fitness app listening on port ${port}`)
})