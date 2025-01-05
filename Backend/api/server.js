const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000; 

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); 

app.post('/askbot', async (req, res) => {
  try {
    const token = `Bearer ${req.headers['authtoken']}`;
    const tweaks = {
        "ChatInput-ZSUrb": {},
        "ParseData-sc17t": {},
        "File-qET6r": {},
        "SplitText-Bn2be": {},
        "AstraDB-81Or2": {},
        "AstraDB-Hs0sN": {},
        "Prompt-3RMi2": {},
        "ChatOutput-sb0iA": {},
        "Google Generative AI Embeddings-cBpqg": {},
        "Google Generative AI Embeddings-PD2SJ": {},
        "GoogleGenerativeAIModel-abUcV": {}
      };
      const langflowId = req.headers['langflowid'];
      const flowId = req.headers['flowid'];
      console.log(req.body);
      const data = {
        input_value: req.body.input,
        inputType: "chat",
        outputType: "chat",
        tweaks: tweaks,
      }
      const checks = {
        token,
        langflowId,
        flowId
      }
      console.log(checks);
    const apiResponse = await axios.post(`https://api.langflow.astra.datastax.com/lf/${langflowId}/api/v1/run/${flowId}?stream=false`,data,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    res.status(200).json(apiResponse.data);
  } catch (error) {
    console.error('Error while calling the API:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
