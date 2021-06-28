const fs = require('fs');
const path = require('path');
const formidable=require('formidable');
const express = require('express');
const app = express();
const {spawn} = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { extname } = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);
app.set('view engine', 'ejs');
app.use('/css', express.static('views/css'));
app.use('/js', express.static('views/js'));
app.use('/images', express.static('views/images'));
app.use('/output',express.static('output'))
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('running at ' + port);
});
app.get('/',(req,res) => {
  res.render('index');
  
})
app.post('/interpret',(req,res,next) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname,'/uploads');
  var fileName='';
  var nfileName=''
  var dataToSend=''
  var  Origin_lang='';
  var Result_lang=''
  var pathName=''
  form.on('file', function(field, file) {
      //rename the incoming file to the file's name
      fileName= path.join(form.uploadDir, file.name);
      fs.rename(file.path,fileName,(err)=>{
        if(err) throw err;
        if(path.extname(fileName)!='.wav'){
          nfileName=path.join(form.uploadDir,file.name.split('.')[0]+'.wav')
        
        ffmpeg(fileName)
        .toFormat('wav')
        .on('error', (err) => {
          console.log('An error occurred: ' + err.message);})
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.targetSize + ' KB converted');})
        .on('end', () => {
          fs.unlink(fileName,(err)=>{
            if(err) throw err;
            console.log('Original File Deleted');
            
          }); 
        fileName=nfileName;
          console.log('here: '+fileName);
      pathName=path.join('output',path.basename(fileName).split('.')[0]+Result_lang+'.mp3');
      console.log(Result_lang,Origin_lang,fileName,pathName);
       const python = spawn('python', ['noisereduce.py','-r',Result_lang,'-s',Origin_lang,'-i',fileName,'-o',pathName]);
       python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend =data.toString();
        console.log(dataToSend);
       });
       python.stderr.on('data', (data) => {
         console.log(data);
       });
       python.on('close', (code) => {
         console.log(`child process close all stdio with code ${code}`);
         dataToSend=JSON.parse(dataToSend)
         // send data to browser
        res.render('index',{translation:dataToSend,file:pathName})
          console.log('Processing finished !');
    
          
        })})
        .save(nfileName);
      
      }
      else{
      console.log('hello '+fileName);
      pathName=path.join('output',path.basename(fileName).split('.')[0]+Result_lang+'.mp3');
      console.log(Result_lang,Origin_lang,fileName,pathName);
       const python = spawn('python3', ['noisereduce.py','-r',Result_lang,'-s',Origin_lang,'-i',fileName,'-o',pathName]);
       python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend =data.toString();
        console.log(dataToSend);
       });
       python.stderr.on('data', (data) => {
         console.log(data);
       });
       python.on('close', (code) => {
         console.log(`child process close all stdio with code ${code}`);
         dataToSend=JSON.parse(dataToSend)
         // send data to browser
        res.render('index',{translation:dataToSend,file:pathName})
     
         });}
      })
         
   

      
  })
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
});

form.parse(req,(err,fields,files)=>{
  if(err)throw err;
  else{
  var {Origin,resultant}=fields;
  Origin_lang=Origin;
  Result_lang=resultant;
 }
});

})
