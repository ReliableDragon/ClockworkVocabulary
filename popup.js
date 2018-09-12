// let replaceVocab = function() {
//   let docText = document.body.textContent;
//   chrome.storage.sync.get('vocab', function(data) {
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
//     });
//   });
// };
//
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.executeScript(
//     tabs[0].id,
//     {code: 'document.body.style.backgroundColor = "#ffffff";'}
//     // {code: replaceVocab}
//   )
// })
