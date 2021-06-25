const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhcor.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("healthi").collection("events");
  

  app.get("/events", (req, res) => {
    serviceCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })

  })
  app.get("/events/:id", (req, res) => {
    const id = req.params.id;
    serviceCollection.find({_id: ObjectId(id)})
      .toArray((err, document) => {
        res.send(document[0])
      })

  })

  app.post('/addEvents',(req,res)=>{
    const events = req.body;
    serviceCollection.insertMany(events,(err,result)=>{
     console.log(err,result);
     res.send({count: result.insertedCount})
    })
  })


 app.get('/', (req, res) => {
    res.send('Hello World!')
  })
});




app.listen(process.env.PORT || port)