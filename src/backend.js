const OpenAI = require('openai');
const { Configuration, OpenAIApi } = OpenAI;


const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const port = 3001;

const configuration = new Configuration({
    organization: "org-dCV8SSKqMUHKT533nPn1mM4r",
    apiKey: "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"
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json())
app.use(cors());

app.post('/', async (req, res) => {
    // console.log("Hi")
    // console.log(message.string)
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.string,
        max_tokens: 100,
    });
    //console.log(response)
    if(response.data.choices[0].text) {
        res.json({
            message: response.data.choices[0].text
        });
    }
})

app.listen(port, () => {
    console.log("example app listening at" + port)
})