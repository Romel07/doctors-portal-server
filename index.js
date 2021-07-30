const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const port = 5000;
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0fkav.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(express.json())
app.use(cors())
app.use(express.static('doctors'))
app.use(fileUpload());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
  const doctorCollection = client.db("doctorsPortal").collection("doctors");
  // perform actions on the collection object
  // client.close();

  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    appointmentCollection.insertOne(appointment)
    .then(result=>{
        console.log(result)
        res.send(result.insertedCount >0)
    }) })

    app.get('/appointments', (req, res) => {
      appointmentCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
          })
  })

    app.post('/appointmentsByDate', (req, res) => {
      const selectedDate = req.body;
      const email = req.body.email;
      console.log(selectedDate.date, email);
      
      doctorCollection.find({email: email})
        .toArray((err, doctors)=>{
          const filter = {date: selectedDate.date}
          // res.send(doctors)
              if (doctors.length === 0){
                filter.email = email
                }
                  
          appointmentCollection.find(filter)
          .toArray((err, documents)=>{
            res.send(documents)
            console.log(documents);
          })          

          
           
          })


        })

    //  })

        app.post('/addADoctor', (req, res)=>{
          const file = req.files.file;
          const name = req.body.name;
          const email = req.body.email;
          console.log(file, name, email);



          doctorCollection.insertOne({ name, email})
          .then(result=>{
            res.send(result.insertedCount > 0)
          })

          // file.mv(`${__dirname}/doctors/${file.name}`, function(err) {
          //   if (err)
          //     return res.status(500).send(err);
        
          //   // res.send('File uploaded!', {name: file.name, path: `/${file.name}`});
          // });
        })

  //    app.post('/addADoctor', (req, res) => {
  //     const file = req.files.file;
  //     const name = req.body.name;
  //     const email = req.body.email;
  //     const newImg = file.data;
  //     const encImg = newImg.toString('base64');

  //     var image = {
  //         contentType: file.mimetype,
  //         size: file.size,
  //         img: Buffer.from(encImg, 'base64')
  //     };

  //     doctorCollection.insertOne({ name, email, image })
  //         .then(result => {
  //             res.send(result.insertedCount > 0);
  //         })
  // })

  app.get('/doctors', (req, res) => {
      doctorCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
          })
  });

  app.post('/isDoctor', (req, res) => {
      const email = req.body.email;
      doctorCollection.find({ email: email })
          .toArray((err, doctors) => {
              res.send(doctors.length > 0);
          })
  })

  
  
  });


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)