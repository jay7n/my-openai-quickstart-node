// const curLang = 'zh-CN';
// const curLang = 'en-US';
// const voiceName = curLang == 'en-US' ? 'Samantha' : 'Mei-Jia';

// const utterList = [];
async function utter(text) {
  return new Promise(async (resolve, reject) => {
    console.log('utter text=', text);
    // const msg = new window.SpeechSynthesisUtterance("Shit");
    // utterThis.text = text;
    const msg = new window.SpeechSynthesisUtterance(text);
    msg.onend = (event) => {
      resolve();
    };
    msg.onerror = (event) => {
      reject();
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
    // utterList.push({utterThis, text, onEnd});
  });
}

// let beingSilent = null;
// let lastSentenceFinished = false;
// async function pollingCheckUtter() {
//   const toUtter = utterList.splice(0, 1);
//   if (toUtter.length > 0) {
//     const {utterThis, text, onEnd} = toUtter[0];
//     await new Promise(resolve => {
//       utterThis.onend = (event) => {
//         console.log('utterThis.onend', event);
//         const showTryAgainButton = document.querySelector('.btn.gap-2');
//         if (showTryAgainButton && utterList.length == 0 && event.utterance.text == text) {
//           console.log('FUCKFUCKFUCKFUCKFUCKFUCKFUCKFUCKFUCKFUCKFUCKFUCK');
//           lastSentenceFinished = true;
//         }
//         resolve();
//         if (onEnd) {
//           onEnd();
//         }
//       }
//       utterThis.text = text;
//       window.speechSynthesis.speak(utterThis);
//       beingSilent = false;
//     });
//     pollingCheckUtter();
//   } else {
//     if (beingSilent !== null) {
//       beingSilent = true;
//     }
//     setTimeout(pollingCheckUtter, 200);
//   }
// }
// pollingCheckUtter();

// let syntStarted = false;

export default async function syntMain(text) {
  // if (syntStarted) {
  //   return;
  // }

  // const pitch = 0.8;
  // const rate = 0.8;
  // // const aiVoice = window.speechSynthesis.getVoices().find(v => v.name == voiceName);
  // const utterThis = new SpeechSynthesisUtterance();
  // utterThis.pitch = pitch;
  // utterThis.rate = rate;
  // // utterThis.voice = aiVoice;

  // syntStarted = true;

  console.log('syntMain is being called');

  await utter(text);

  // let cache = '';
  // let count = 0;
  // let timeoutID;
  // let sentenceIdx = 0;
  // const pollFunc = () => {
  //   console.log('polling', count);
  //   timeoutID = setTimeout(async () => {
  //     console.log('timeoutID = ', timeoutID);
  //     const conversationList = document.querySelectorAll('.markdown.prose');
  //     if (conversationList.length > 0) {
  //       const lastConversation = conversationList[conversationList.length - 1];
  //       const lastCText = lastConversation.textContent;
  //       const sentenceList = lastCText.split(/[,.:?!，。：？！]/);
  //       console.log('1 sentenceList = ', sentenceList);
  //       console.log('1 sentenceIdx = ', sentenceIdx);
  //       console.log('lastCText = ', lastCText);
  //       console.log('cache = ', cache);
  //       if (
  //         lastCText == null ||
  //         lastCText.trim() == '' ||
  //         lastCText.charCodeAt(0) == 8203
  //       ) {
  //         // do nothing

  //         // console.log(
  //         //   'lastCText =' , lastCText, 
  //         //   'type =', typeof lastCText, 
  //         //   'code =', lastCText.charCodeAt(0)
  //         // );
  //         // pollFunc();
  //         // return;
  //       } else if (lastCText !== cache && sentenceList.length - 1 != sentenceIdx) {
  //         console.log('2 sentenceList = ', sentenceList);
  //         console.log('2 sentenceIdx = ', sentenceIdx);
  //         utter(utterThis, sentenceList[sentenceIdx]);
  //         sentenceIdx = sentenceList.length-1;
  //         // console.log('not same!');
  //         count = 0;
  //         cache = lastCText;
  //         // pollFunc();
  //         // return;
  //       } else if (utterList.length == 0 && beingSilent == true) {
  //         count++;
  //         // console.log('count++', count, 'and cache = ', cache);
  //       }

  //       if (lastSentenceFinished) {
  //         count = 0;
  //         clearTimeout(timeoutID);
  //         await new Promise((resolve) => {
  //           // console.log('begin utter');
  //           // utter(utterThis, cache, () => {
  //             resolve();
  //             console.log('utter end');
  //             count = 0;
  //             sentenceIdx = 0;
  //             lastSentenceFinished = false;
  //             beingSilent = null;
  //             utterList.length = 0;
  //             if (recoMain) {
  //               setTimeout(() => {
  //                 syntStarted = false;
  //                 recoMain();
  //               }, 500);
  //             }
  //           // });
  //         });
  //         console.log('after waiting utter');
  //       } else {
  //         console.log('begin pollFunc() again');
  //         pollFunc();
  //       }
  //     }
  //   }, 500);
  // }
  // pollFunc();
}
