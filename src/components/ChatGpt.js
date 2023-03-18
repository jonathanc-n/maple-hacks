//OPENAI Stuff
import { update } from '@tensorflow/tfjs-layers/dist/variables';
import { useState } from 'react';
import React, { Component }  from 'react';

const cpInput = 'string';

function ChatGpt(cpInput) {
    const { Configuration, OpenAIApi } = require("openai");
    require('dotenv').config()

    const configuration = new Configuration({
    apiKey: "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"
    });
    const openai = new OpenAIApi(configuration);

    const [hi, updateHi] = useState(0);

    async function runCompletion(cpInput) {
        
        const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "how does a " + {cpInput} + " relate to climate change",
        });
        console.log(completion.data.choices[0].text);
        updateHi(completion.data.choices[0].text);
    }
    runCompletion();
    return(<h1>{hi}</h1>);

}
export default ChatGpt;