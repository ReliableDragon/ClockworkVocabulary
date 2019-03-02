"use strict";
window.addEventListener("load", onLoad, false);

function setColor(id, color) {
  document.getElementById(id).style.color = color;
}

function addWord() {
  let wordIn = document.getElementsByName("addWordIn")[0].value.toLowerCase();
  let wordOut = document.getElementsByName("addWordOut")[0].value.toLowerCase();
  if (!wordIn || !wordOut) {
    if (!wordIn) {
      setColor("inPrompt", "#FF5555");
    }
    if (!wordOut) {
      setColor("outPrompt", "#FF5555");
    }
    // TODO(b/1): Better errors.
    alert("You have to give both a word to translate, and a translation!");
    console.log("Ignoring attempt to set word with missing field.");
    return;
  }
  setColor("inPrompt", "#000000");
  setColor("outPrompt", "#000000");
  chrome.storage.sync.get(['forward', 'backward'], function(dict) {
    let forward = dict['forward'];
    let backward = dict['backward'];
    if (backward[wordOut]) {
      // TODO(b/1): Better errors.
      alert("You can't add two words with the same translation.");
    }
    forward[wordIn] = wordOut;
    backward[wordOut] = wordIn;
    chrome.storage.sync.set({'forward': forward, 'backward': backward});
    loadTable();
  })
}

function removeWord() {
  let wordRemove = document.getElementsByName("removeWord")[0].value.toLowerCase();
  if (!wordRemove) {
    setColor("removePrompt", "#FF5555");
    // TODO(b/1): Better errors.
    alert("You must specify a word to stop translating!");
    return;
  }
  setColor("removePrompt", "#000000");
  remove(wordRemove);
}

function remove(word) {
  console.log("Removing " + word);
  chrome.storage.sync.get(['forward', 'backward'], function(dict) {
    let forward = dict['forward'];
    let backward = dict['backward'];
    let translation = forward[word];
    delete forward[word];
    delete backward[translation];
    chrome.storage.sync.set({'forward': forward, 'backward': backward});
    loadTable();
  });
}

var test_dict = {
  bus: "autobus",
  car: "coche",
  dog: "perro"
}
function loadTable() {
  chrome.storage.sync.get('forward', function(dict) {
    dict = dict['forward'];

    let table = document.getElementById("wordTable");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    for (let key in dict) {
      if (!dict.hasOwnProperty(key)) {
        continue;
      }
      let row = document.createElement("TR");
      table.appendChild(row);
      let word = document.createElement("TD");
      word.innerHTML = key;
      row.appendChild(word);
      let translation = document.createElement("TD");
      translation.innerHTML = dict[key];
      row.appendChild(translation);
      let imgTd = document.createElement("TD");
      imgTd.height = 10;
      imgTd.width = 10;
      let image = document.createElement("IMG");
      image.src = "./images/button_cancel.svg";
      image.height = 10;
      image.width = 10;
      image.alt = "delete";
      image.onclick = function() {
        remove(key);
      };
      imgTd.appendChild(image);
      row.appendChild(imgTd);
    }
  });
}

function onLoad() {
  loadTable();
  document.getElementById("addBtn").addEventListener("click", addWord);
  document.getElementById("removeBtn").addEventListener("click", removeWord);
}
