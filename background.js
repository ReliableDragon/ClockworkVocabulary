console.log("Running!");

chrome.runtime.onInstalled.addListener(function() {
  let vocab = {}
  chrome.storage.sync.set({'vocab': vocab}, function() {
    console.log("Vocabulary is: " + String(vocab));
  })

});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  console.log("Listener ran!");
  if (tab.active) {
    chrome.tabs.executeScript(tabId, {
      file: "editVocab.js"
    });
  }
});

function addWord(info, tab) {
  chrome.storage.sync.get('vocab', function(dict) {
    dict = dict['vocab'];
    let word = info.selectionText;
    console.log("Adding word to ClockworkVocabulary: " + word);
    let firstChar = word[0];
    let lower_word = word.toLowerCase();
    let upper_word = word.toUpperCase();
    let cap_word = firstChar.toUpperCase() + word.substring(1);
    dict[lower_word] = "MONSTER TRUCKS";
    dict[upper_word] = "MONSTER TRUCKS";
    dict[cap_word] = "MONSTER TRUCKS";
    chrome.storage.sync.set({'vocab': dict});
    chrome.tabs.executeScript(tab.id, {
      file: "editVocab.js"
    });
  });
  console.log("Add word to ClockworkVocabulary: " + info.selectionText);
}

function removeWord(info, tab) {
  chrome.storage.sync.get('vocab', function(dict) {
    dict = dict['vocab'];
    let word = info.selectionText;
    console.log("Removing word from ClockworkVocabulary: " + word);
    let firstChar = word[0];
    let lower_word = word.toLowerCase();
    let upper_word = word.toUpperCase();
    let cap_word = firstChar.toUpperCase() + word.substring(1);
    delete dict[lower_word];
    delete dict[upper_word];
    delete dict[cap_word];
    chrome.storage.sync.set({'vocab': dict});
  });
}
// var selectionId = chrome.contextMenus.create({"title": "Add word to translation.",
//                             "contexts": ["selection"],
//                             "onclick": addWord});
