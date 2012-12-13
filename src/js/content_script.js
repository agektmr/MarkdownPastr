var onpaste = function(e) {
  for (var i = 0; i < e.clipboardData.items.length; i++) {
    var item = e.clipboardData.items[i];

    if (item.type === 'text/html') {
      item.getAsString(function(html) {
        chrome.extension.sendMessage({command: 'html2md', source: html}, function(markdown) {
          if (markdown) {
            var start = e.target.selectionStart,
                end = e.target.selectionEnd,
                text = e.target.value;

            e.target.value = text.substr(0, start) + markdown + text.substr(end);
            e.target.selectionStart = e.target.selectionEnd = start+markdown.length;
          }
        });
      });
      e.preventDefault();
    }
  }
};

var textarea = document.querySelectorAll('textarea');
for (var i = 0; i < textarea.length; i++) {
  textarea[i].addEventListener('paste', onpaste);
}
