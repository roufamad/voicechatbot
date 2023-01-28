// sketch.js
let recognition;
let synth;
let textVal;
let myTextArea;
var apiKey = process.env.API_KEY;


function setup() {
  // Create a speech object
  recognition = new p5.SpeechRec('fr-FR');
  synth = new p5.Speech('fr-FR');
  
}

// check if the microphone is available and if the user has granted permission
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function (stream) {
    // microphone is available and permission is granted
    // start recognition
    recognition.start();
    // listen for the 'result' event and process the result
    recognition.onResult = function () {
      // get the transcript of the result
      let message = recognition.resultString;
      //console.log(message);
       myTextArea = document.getElementById("request");
      // set the value of the text area to the response text
      myTextArea.value = message;
  
      // send the message to the chatbot
      askGPT3(message);
    }
  })
  .catch(function (error) {
    // microphone is not available or permission is not granted
    console.error('The microphone is not available or permission is not granted');
  });

async function askGPT3(message) {
  // send the message to GPT-3's API
  var url = "https://api.openai.com/v1/engines/text-davinci-003/completions";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer"+apikey);                                                
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      let jsonData = xhr.responseText;
      let data = JSON.parse(jsonData);
      let text = data.choices[0].text;
      let textArea = document.getElementById("text-input");
      // set the value of the text area to the response text
      textArea.value = text;
      textVal = textArea.value;
      //console.log(textVal);
      // create a promise to wait for the text to be generated
      let textPromise = new Promise((resolve, reject) => {
        resolve(textVal);
      });      
      // wait for the text to be generated
      textPromise.then(text => {
        // check if the browser is compatible with the Web Speech API
        if (synth) {
          // speak the text using text-to-speech
          synth.setVoice("Google français");
          synth.speak(text);
        } else {
          // fallback solution
          console.error("The browser does not support text-to-speech or you have denied microphone access. Please type your answer in the textarea below.");
          document.getElementById("speak-button").disabled = true;
        }
      });
    }
  };

  var data = `{
    "prompt": "${message}",
    "temperature": 0.7,
    "max_tokens": 1000,
    "top_p": 1,
    "frequency_penalty": 0.75,
    "presence_penalty": 0
  }`;

  xhr.send(data);
}

