console.log("Running!");

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(["forward", "backward"], function(dict) {
    let forward = {
      the: "das",
      a: "ein",
      it: "dass"
    };
    if (dict["forward"]) {
      forward = dict["forward"];
    }
    let backward = {
      das: "the",
      ein: "a",
      dass: "it"
    };
    if (dict["backward"]) {
      backward = dict["backward"];
    }
    chrome.storage.sync.set({
      'forward': forward,
      'backward': backward
    }, function() {
      console.log("Vocabulary is: " + JSON.stringify(forward));
    });
  });
});

chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
  if (details.url &&
    (details.url.substring(0, 9) == "chrome://" ||
      details.url.substring(0, 19) == "chrome-extension://")) {
    return;
  }
  console.log("Executing vocab edit.");
  chrome.tabs.executeScript(details.tabId, {
    file: "editVocab.js"
  });
});

var selectionId = chrome.contextMenus.create({
  "id": "context-menu",
  "title": "Placeholder menu item. If you're seeing this, there's a bug - sorry.",
  "contexts": ["selection"]
});

function addWord(wordIn, sendMessage) {
  chrome.storage.sync.get(['forward', 'backward'], function(dict) {

    let wordOut = prompt("What should " + wordIn + " translate to?");

    let forward = dict['forward'];
    let backward = dict['backward'];
    if (backward[wordOut]) {
      // TODO(b/1): Better errors.
      alert("There's already a word with that translation!");
      return;
    }
    forward[wordIn] = wordOut;
    backward[wordOut] = wordIn;
    chrome.storage.sync.set({
      'forward': forward,
      'backward': backward
    }, function() {
      updatePage(wordIn, wordOut);
    });
  })
}

function removeWord(toRemove, sendMessage) {
  console.log("Removing " + toRemove);
  chrome.storage.sync.get(['forward', 'backward'], function(dict) {
    let forward = dict['forward'];
    let backward = dict['backward'];
    let translated = backward[toRemove];
    delete forward[translated];
    delete backward[toRemove];
    console.log("New vocab: %s", JSON.stringify(forward));
    chrome.storage.sync.set({
      'forward': forward,
      'backward': backward
    }, function() {
      updatePage(toRemove, translated)
    });
  });
}

function updatePage(toChange, changed) {
  console.log("Sending message!");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    replacementDict = {};
    replacementDict[toChange] = changed;
    chrome.tabs.sendMessage(tabs[0].id, {replacement: replacementDict}, function(response) {
      console.log(response);
  });
});
}

console.log("Adding message listener.");
chrome.runtime.onMessage.addListener(
  function(request, sender, sendMessage) {
    let selection = request["selected"];
    console.log("Messaged with selection: {" + selection + "}.");
    if (selection) {
      selection = selection.trim();
      selection = selection.toLowerCase();
    }
    chrome.storage.sync.get(['forward', 'backward'], function(dict) {
      let forward = dict['forward'];
      let backward = dict['backward'];
      if (!selection) {
        chrome.contextMenus.update(
          "context-menu", {
            title: "No word selected to translate.",
            enabled: false
          });
      } else if (backward[selection]) {
        chrome.contextMenus.update(
          "context-menu", {
            title: "Stop translating '" +
              selection + "'.",
            enabled: true,
            onclick: function(_, _) {
              removeWord(selection, sendMessage);
            }
          });
      } else if (forward[selection]) {
        chrome.contextMenus.update(
          "context-menu", {
            title: "This word already translates to " +
              forward[selection] + ".",
            enabled: false
          });
      } else {
        chrome.contextMenus.update(
          "context-menu", {
            title: "Add a translation for '" +
              selection + "'.",
            enabled: true,
            onclick: function(_, _) {
              addWord(selection, sendMessage);
            }
          });
      }
    });
  });
