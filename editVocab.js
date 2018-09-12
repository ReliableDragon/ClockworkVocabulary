let replaceVocab = function() {

  chrome.storage.sync.get('vocab', function(dict) {
    var nodeIterator = document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_TEXT
      // function(node) {
      //     return node.nodeName.toLowerCase() === 'p' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      // }
    );

    dict = dict['vocab'];
    var currentNode = nodeIterator.nextNode();

    while (currentNode != null) {
        Object.keys(dict).forEach(function(element) {

          let reText = '(\\W)' + element + '(\\W)';
          let re1 = new RegExp(reText, 'g');

          let replacementFunction = function(match, p1, p2) {
          	return p1 + dict[element] + p2;
          }

          currentNode.textContent = currentNode.textContent.replace(re1, replacementFunction);
        });
      currentNode = nodeIterator.nextNode();
    }
  });
};

replaceVocab();
