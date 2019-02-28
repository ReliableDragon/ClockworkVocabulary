function addWord() {
  let wordIn = document.getElementByName("addWordIn");
  let wordOut = document.getElementByName("addWordOut");
  chrome.storage.sync.get('vocab', function(dict) {
    dict = dict['vocab'];
    dict[wordIn] = wordOut;
    chrome.storage.sync.set({'vocab': dict});
  })
}

function removeWord() {
  let wordRemove = document.getElementByName("removeWord");
  chrome.storage.sync.get('vocab', function(dict) {
    dict = dict['vocab'];
    delete dict[wordRemove];
  });
}
