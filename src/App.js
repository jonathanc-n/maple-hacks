import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import Button from "./components/Button";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);

const prompts = [
  ["how does this ", " impact climate change?"],
  ["give me an interesting fact about a ", " that relates to climate change. Start the response by saying An interesting fact about"],
  ["how can I help climate change using a", "? Start the response by saying You can help climate change using a"],
  ["how can a", " be sustainable? Start the response by saying A..."]
]

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [classArray, setClassArray] = useState([]);
  const [object, setObject] = useState('');
  const [stuff, setStuff] = useState('I am the description box! Point your camera at an object and click the button below to find out more info on how that object is related to climate change!');

  async function runCompletion(object) {
    setStuff("object = " + object + ". Loading...")
    let promptNum = Math.floor(Math.random() * prompts.length);
    //promptNum = 3;
    let string = prompts[promptNum][0] + object + prompts[promptNum][1] + " Limit this response to under 50 words"
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: string,
      max_tokens: 100,
    });
    //console.log(completion.data.choices);
    setStuff(object + ": " + completion.data.choices[0].text);
    //desc = completion.data.choices[0].text;
    //return(completion.data.choices[0].text);
  }
  //runCompletion("person")

  //setStuff(runCompletion("tree"));

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 10);
  };

  useEffect(() => {
    //console.log(object);
  }, [object]);

  const handleClick = (className) => {
    setObject(className)
    runCompletion(className);
    //console.log(object)
  }

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);

      const ctx = canvasRef.current.getContext("2d");

      drawRect(obj, ctx);

      setClassArray([...new Set(obj.map(obj => obj.class))]);
      // const classes = obj.map(obj => obj.class)
      // console.log(classes)
    }
  };

  useEffect(()=>{runCoco()},[]);

  return (
    <>
    <div className="App">
      <p>{stuff}</p>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

       
      </header>
      <div>
        {classArray.map(className => (
          // <Button onClick={() => handleClick(className)} key={className} className={className}/>
          <button onClick={() => handleClick(className)}>{className}</button>
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
