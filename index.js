const express = require('express');
const formidable=require('formidable');
const app = express();
const {spawn} = require('child_process');
path = require('path');
fileSystem = require('fs'),

app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('running at ' + port);
});
app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname,'public/index.html'));
  
})
app.post('/interpret',(req,res) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = 'uploads'
  form.parse(req, function (err, fields, files) {
  

    res.write('File uploaded');
    res.end();
  });
})
app.get('/fetch', (req, res) => {
  const python = spawn('python', ['noisereduce.py','-r','fr','-s','en','-i','microphone-results.wav','-o','microphone-results.mp3']);
  var dataToSend=''
  // collect data from script
  python.stdout.on('data', function (data) {
   console.log('Pipe data from python script ...');
   dataToSend =data.toString();
   console.log(dataToSend)
  });
  python.stderr.on('data', (data) => {
    console.log(data);
  });
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    dataToSend=JSON.parse(dataToSend)
    // send data to browser
    var filePath=path.join(__dirname,'microphone-results.mp3');
    var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.on('open', function() {
        // This just pipes the read stream to the response object (which goes to the client)
        readStream.pipe(res);
    });

    readStream.on('error', function(err) {
        res.end(err);
    });

    });
  });

app.post('/todo', (req, res) => {
  var { str } = req.body;
  console.log(str);
  var ntask = new task({ task: str });
  ntask.save((err, json) => {
    if (err) {
      throw err;
    } else {
      console.log('sucess');
    }
  });
  console.log(ntask);
  res.redirect('/');
});
app.delete('/todo', (req, res) => {
  task.deleteOne({ task: req.query.item }, (err, data) => {
    if (err) throw err;
    else {
      res.json(data);
    }
  });
});
