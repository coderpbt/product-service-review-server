const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
require('dotenv').config()

var jwt = require('jsonwebtoken');

const port = process.env.PORT || 4000


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
    const fitzeosReviewCollection = client.db("fitzeosUserDb").collection("reviews");
    //server to ui data
    app.get('/services', async(req,res)=> {
      const query = {}
      const cursor = fitzeosCollection.find(query)
      const result = await cursor.limit(3).toArray()
      res.send(result)
    })
    app.get('/servicesall', async(req,res)=> {
      const query = {}
      const cursor = fitzeosCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/services/:id', async(req,res)=> {
      const {id} = req.params;
      const query = {_id : ObjectId(id)}
      const result = await fitzeosCollection.findOne(query)
      res.send(result)
    })
    //ui to db data
    app.post('/reviews', async(req,res)=> {
      const review = req.body;
      const result = await fitzeosReviewCollection.insertOne(review)
      res.send(result)
    })

    
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