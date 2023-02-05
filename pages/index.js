import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

import speechReco from './speech/recoSimple';
import speechSyns from './speech/synsSimple';

let pageSid = '';
let prompt = '';

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState();

  useEffect(() => {
    async function init() {
      const response = await fetch("/api/init", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      pageSid = data.sid;
      console.log('pageSid = ', pageSid);

    }
    init();

    let Response_Returned = false;

    // begin speech recognition
    const cbOnSpeech = (transcript) => {
      if (Response_Returned) {
        setPromptInput("");
        Response_Returned = false;
      }
      console.log('transcript=', transcript);
      setPromptInput(transcript);
      prompt = transcript;
      console.log('speech!!!', promptInput);
    };
    const cbOnOver = async () => {
      console.log('over!!!', promptInput);
      await onSubmit(prompt);
      Response_Returned = true;
    }
    speechReco(cbOnSpeech, cbOnOver);
  }, []);

  async function onSubmitLegacy(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          sid: pageSid,
          prompt: promptInput
         }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function onSubmit(prompt) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          sid: pageSid,
          prompt: prompt
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      await speechSyns(data.result);

    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error?.message || error);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmitLegacy}>
          <input
            type="text"
            name="prompt"
            placeholder="Hi Jarvis."
            value={promptInput}
            onChange={(e) => { setPromptInput(e.target.value) }}
          />
          <input type="submit" value="Generate names" />
          <div>{promptInput}</div>
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
