console.log("Running!");

// let replaceVocab = function() {
//   let docText = document.body.textContent;
//   chrome.storage.sync.get('vocab', function(dict) {
//     Object.keys(dict).forEach(function(element) {
//       let reText = '(\\W)' + element + '(\\W)';
//       let re1 = new RegExp(reText, 'g');
//
//       let replacementFunction = function(match, p1, p2) {
//       	return p1 + dict[element] + p2;
//       }
//
//       docText = docText.replace(re1, replacementFunction);
//       document.body.textContent = docText;
//       console.log(document.body.textContent);
//     });
//   });
// };

chrome.runtime.onInstalled.addListener(function() {
  let vocab = {"the": "das", "The": "Das", "THE": "DAS"}
  chrome.storage.sync.set({'vocab': vocab}, function() {
    console.log("Vocabulary is: " + String(vocab));
  })
});

// "declarativeContent",
// "activeTab",

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  console.log("Listener ran!");
  if (changeInfo.status == 'complete' && tab.active) {
    console.log("Changing page.");
    console.log(document.body.textContent);
    chrome.tabs.executeScript(tabId, {
      file: "editVocab.js"
    });
    // replaceVocab();
  }
})

// chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//   chrome.declarativeContent.onPageChanged.addRules([{
//     conditions: [new chrome.declarativeContent.PageStateMatcher({
//       pageUrl: {hostEquals: 'developer.chrome.com'},
//     })],
//       actions: [new chrome.declarativeContent.ShowPageAction()]
//   }]);
// })
