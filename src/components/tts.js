import React, { useState } from "react";

function TextToSpeech({ response }) {
  const [audioSrc, setAudioSrc] = useState("");

  const convertTextToSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(response);
    window.speechSynthesis.speak(utterance);
  };

  const handleConvertClick = async () => {
    const settings = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "fdea18cffemsh8474eb8d0916d92p151528jsnea07e04a2220",
        "X-RapidAPI-Host": "large-text-to-speech.p.rapidapi.com",
      },
      body: JSON.stringify({
        text: response,
      }),
    };

    try {
      const response = await fetch(
        "https://large-text-to-speech.p.rapidapi.com/tts",
        settings
      );
      const data = await response.blob();
      setAudioSrc(URL.createObjectURL(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={convertTextToSpeech}>Speak response</button>
      <button onClick={handleConvertClick}>Convert Text to Speech</button>
      {audioSrc && <audio controls src={audioSrc} />}
    </div>
  );
}

export default TextToSpeech;
