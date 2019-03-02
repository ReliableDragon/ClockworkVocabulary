function storageReplace() {
  console.log("Running edit function.");
  chrome.storage.sync.get('forward', function(dict) {
    dict = dict['forward'];
    replaceVocab(dict);
  });
}

function replaceVocab(dict) {
  console.log("Vocab replacement dict: %s", JSON.stringify(dict));

  var treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  var currentNode = treeWalker.nextNode();

  while (currentNode != null) {
    if (!currentNode.nodeType == 3) {
      return;
    }
    let regString = "(\\W|^)(" + Object.keys(dict).join("|") + ")(\\W|$)";
    let re1 = new RegExp(regString, "gi");

      // Translations are converted to lower case before storage.
      // Note: This *should* work for most Eastern translated words,
      // since their upper and lower cases are the same.
      let replacementFunction = function(match, p1, p2, p3) {
        let replacement;
        let translated = p2.toLowerCase();
        if (p2[0].toLowerCase() == p2[0]) {
          // lower case
          replacement = dict[translated];
        } else if (p2.length > 1
                  && p2[1].toUpperCase() == p2[1]) {
          // ALL CAPS
          replacement = dict[translated].toUpperCase();
        } else {
          // Initial Capitals
          let word = dict[translated];
          replacement = word[0].toUpperCase() + word.substring(1);
        }
        return p1 + replacement + p3;
      };

      currentNode.textContent = currentNode.textContent.replace(re1, replacementFunction);
    currentNode = treeWalker.nextNode();
  };
}

document.addEventListener("selectionchange", function() {
  console.log("MouseDown listener running!");
  let selection = window.getSelection().toString();
  console.log("Sending message: " + selection);
  chrome.runtime.sendMessage({
    "selected": selection
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Got a message: " + JSON.stringify(request));
    if (!request || !request["replacement"]) {
      return;
    }
    replaceVocab(request["replacement"]);
    sendResponse({done: "true"});
  });

storageReplace();
