// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
// 2. TODO - Import drawing utility here
import { drawRect } from "./utilities";
import imagething from "./images/wp10650609.jpg";

function App() {
<<<<<<< Updated upstream
  // runCompletion();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [classArray, setClassArray] = useState([]);
  const [object, setObject] = useState('')
=======
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
>>>>>>> Stashed changes

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  useEffect(() => {
    console.log(object);
  }, [object]);

  const handleClick = (className) => {
    setObject(className)
  }

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);
      const obj = await net.detect(video);
      console.log(obj);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
<<<<<<< Updated upstream
      // Apply horizontal flip to the context
      ctx.translate(videoWidth, 0);
      ctx.scale(-1, 1);
      drawRect(obj, ctx, "", videoWidth);

      setClassArray([...new Set(obj.map((obj) => obj.class))].sort());
=======

      // 5. TODO - Update drawing utility
      drawRect(obj, ctx);
>>>>>>> Stashed changes
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
<<<<<<< Updated upstream
      {/* <ChatGpt cpInput = 'rock'/> */}
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
            width: 800,
            height: 600,
            transform: "scaleX(-1)",
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
            width: 800,
            height: 600,
            transform: "scaleX(-1)",
          }}
        />
=======
      <header className="App-header">
        <div className="header1">
          <div class="gradient"></div>
          <img src={imagething} alt="" class="background" />
          <nav>
            <div class="nav-bar">
              <ul>
                <li>
                  <a href="">About</a>
                </li>
                <li>
                  <a href="">Purpose</a>
                </li>
                <li>
                  <a href="#header2">OUR APPLICATION</a>
                </li>
              </ul>
            </div>
          </nav>
          <div class="bigTitle">
            <div class="title1">ClimateSnap</div>
            <a class="" href="#header2">
              <button class="toApplication">TRY IT OUT!!</button>
            </a>
          </div>
        </div>

        <section className="header2" id="header2">
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
>>>>>>> Stashed changes

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
        </section>
      </header>
<<<<<<< Updated upstream
      <div>
        {classArray.map(className => (
          // <Button onClick={() => handleClick(className)} key={className} className={className}/>
          <button onClick={() => handleClick(className)}>{className}</button>
        ))}
      </div>
=======
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
