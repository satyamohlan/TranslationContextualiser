const recorder = document.getElementById('recorder');
  const player = document.getElementById('player');

  recorder.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    // Do something with the audio file.
    // player.src = url;
  });
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const startbtn=document.querySelector('.btn.btn-outline-primary');startbtn.addEventListener('click',()=>{
  startbtn.innerHTML='Stop';
  startbtn.classList.replace('btn-outline-primary','btn-outline-dark')
  // navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  // navigator.mediaDevices.getUserMedia({video: false, audio: true})
  // .then(stream=> {
  //   const context = new AudioContext();
  //   const source = context.createMediaStreamSource(stream);
  //   const processor = context.createScriptProcessor(1024, 1, 1);

  //   source.connect(processor);
  //   processor.connect(context.destination);

  //   processor.onaudioprocess = function(e) {
  //     // Do something with the data, e.g. convert it to WAV
  //     console.log(e.inputBuffer);
  //   };
  //   if (window.URL) {
  //     player.srcObject = stream;
  //   } else {
  //     player.src = stream;
  //   }
  // })



})






// const target = document;

// target.addEventListener('drop', (e) => {
//   e.stopPropagation();
//   e.preventDefault();
//   // act(e.dataTransfer.files[0]);
//   document.getElementById('overlay').classList.remove('on')


// });

// target.addEventListener('dragover', (e) => {
//   e.stopPropagation();
//   e.preventDefault();

//   e.dataTransfer.dropEffect = 'copy';
//   document.getElementById('overlay').classList.add('on')
//   window.clearTimeout(dragTimer);
// });
// target.addEventListener('dragleave', (e) => {
//     dragTimer = window.setTimeout(function() {
//         e.stopPropagation();
//   e.preventDefault();

//   e.dataTransfer.dropEffect = 'copy';
//   document.getElementById('overlay').classList.remove('on')
//   }, 85);

// });
