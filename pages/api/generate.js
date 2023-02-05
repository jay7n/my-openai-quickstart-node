import fs from 'fs';
import path from 'path';

import { Configuration, OpenAIApi } from "openai";

const DRY_RUN_OPENAI = false;

const roleName = 'Jayson';
const gender = 'him';
const aiName = 'Jarvis';
const greeting = `${aiName}: Hello ${roleName}, how can I help you today?"`;
const maxRecordsToRead = 5;
const models = [
  'text-ada-001',
  'text-babbage-001',
  'text-curie-001',
  'text-davinci-003',
];
const chosenModelIdx = 3;
let currentSid = '';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const {
    prompt = '',
    sid = '',
  } = req.body;

  if (sid == '') {
    res.status(400).json({
      error: {
        message: "The req param 'sid' is not provided",
      }
    });
    return;
  }

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }
  const roleRecordsObj = initPromptRecords(roleName);

  writePromptToRecords(roleRecordsObj, roleName, sid, `${roleName}: ${prompt}`);
  const generatedPrompt = generatePrompt(roleRecordsObj, roleName, sid);

  try {
    let completionResText = '';
    if (DRY_RUN_OPENAI == false) {
      const completion = await openai.createCompletion({
        model: models[chosenModelIdx],
        prompt: generatedPrompt,
        temperature: 0.6,
        max_tokens: 200,
      });
      console.log('completion.data.choices = ', JSON.stringify(completion.data.choices));
      completionResText = completion.data.choices[0].text.trim();
    } else {
      completionResText = 'I am a dog.';
    }

    writePromptToRecords(roleRecordsObj, roleName, sid, `${aiName}: ${completionResText}`);
    currentSid = sid;

    res.status(200).json({ result: completionResText });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


function generatePrompt(roleRecordsObj, roleName, sid) {
  const res = `
  There is an AI assistant named Jarvis. He is helpful, creative, and friendly. 
  It can talk with ${roleName} and also teach ${gender} learning English.

  Their daily conversations look like this:
  ${aiName}: ${greeting}
  ${roleName}: "He are here". is there something wrong with this sentence?
  ${aiName}: Yes. It should be "He is here".
  ${roleName}: "我的头越来越疼" translate it in English.
  ${aiName}: "My head is getting more and more painful."
  ${roleName}: is "hurt" an adjective here? 
  ${aiName}: Yes. "hurt" is used as an adjective to describe the state of the head. 
  ${readPromptRecords(roleRecordsObj, roleName, sid)}
  ${aiName}: `;

  console.log('generated prompt to openAI =', res);

  return res;
}

function initPromptRecords(roleName) {
  const roleRecordsPath = path.join(__dirname, '..', '..', '..', '..', 'pages', 'records', `${roleName.toLowerCase()}.json`);
  const roleRecordsTxt = fs.readFileSync(roleRecordsPath, 'utf8');
  if (roleRecordsTxt == '') {
    return {};
  } else {
    const roleRecordsObj = JSON.parse(roleRecordsTxt);
    return roleRecordsObj;
  }
}

function writePromptToRecords(roleRecordsObj, roleName, sid, prompt) {
  if (roleRecordsObj[roleName] == undefined) {
    roleRecordsObj[roleName] = {};
  }
  if (roleRecordsObj[roleName][sid] == undefined) {
    roleRecordsObj[roleName][sid] = [];
  }
  roleRecordsObj[roleName][sid].push(prompt);

  const roleRecordsPath = path.join(__dirname, '..', '..', '..', '..', 'pages', 'records', `${roleName.toLowerCase()}.json`);
  fs.writeFileSync(roleRecordsPath, JSON.stringify(roleRecordsObj, null, 2));
}

function readPromptRecords(roleRecordsObj, roleName, sid) {
  const allRecords = roleRecordsObj[roleName][sid];
  const latestKRecords = allRecords.slice(allRecords.length - maxRecordsToRead);
  return latestKRecords.join('\n');
}