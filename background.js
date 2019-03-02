console.log("Running!");

chrome.runtime.onInstalled.addListener(function() {
  let forward = {the: "das", a: "ein", it: "dass"};
  let backward = {das: "the", ein: "a", dass: "it"};
  chrome.storage.sync.set({'forward': forward, 'backward': backward}, function() {
    console.log("Vocabulary is: " + String(forward));
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(changeInfo);
  // Don't run on chrome:// or chrome-extension:// pages.
  if (changeInfo.url
        && (changeInfo.url.substring(0, 9) == "chrome://"
              || changeInfo.url.substring(0, 19) == "chrome-extension://")
      || tab.url && (tab.url.substring(0, 9) == "chrome://"
            || tab.url.substring(0, 19) == "chrome-extension://")) {
    return;
  }
  console.log("Listener ran!");
  if (tab.active) {
    console.log("Executing vocab edit.");
    chrome.tabs.executeScript(tabId, {
      file: "editVocab.js"
    });
  }
});

// // var selectionId = chrome.contextMenus.create({"title": "Add word to translation.",
// //                             "contexts": ["selection"],
// //                             "onclick": addWord});
