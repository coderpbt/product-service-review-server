const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
require('dotenv').config()
var jwt = require('jsonwebtoken');

const port = process.env.PORT || 4000;




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
    app.get('/services', async (req, res) => {
      const query = {}
      const sort = { _id: -1 };
      const limit = 3;
      const cursor = fitzeosCollection.find(query).sort(sort).limit(limit);
      const result = await cursor.toArray()
      // const result = results
      res.send(result)
    })
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await fitzeosCollection.insertOne(service)
      res.send(result)
    })
    app.get('/servicesall', async (req, res) => {
      const query = {}
      const cursor = fitzeosCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/services/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) }
      const result = await fitzeosCollection.findOne(query)
      res.send(result)
    })
    //ui to db data
    app.get('/reviews', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        }
      }
      const cursor = fitzeosReviewCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await fitzeosReviewCollection.insertOne(review)
      res.send(result)

    })
    app.get('/reviews', async (req, res) => {
      const query = {}
      const sort = { time : time };
      const cursor = fitzeosReviewCollection.find(query).sort(sort)
      const result = await cursor.toArray()
      res.send(result)
    })

    //spe new
    app.get('/reviews/:id', async (req, res) => {
      const id  = req.params.id;
      const query = {reviewIds : id}
      const sort = { _id: -1 };
      const result = await fitzeosReviewCollection.find(query).sort(sort).toArray()
      res.send(result)

    })

      //data update user
      app.patch('/reviews/:id', async (req,res) => {
        const id = req.params.id;
        const filter = { _id : ObjectId(id)};
        const user = req.body;
        console.log('hello', user);
        const option = {upsert : true};

        const updsteUser = {
          $set : {
            serviceName : user.name,
            textarea : user.review
          }
        }

        const result = await fitzeosReviewCollection.updateOne(filter,updsteUser,option)
        console.log(result);
        res.send(result)
        
      })


    //delete Review
    app.delete('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fitzeosReviewCollection.deleteOne(query)
      res.send(result)
     
    })

  } finally {

  }
}
run().catch(err => console.log(err));




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Fitness app listening on port ${port}`)
})