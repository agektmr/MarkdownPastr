(function() {
  var shiftKey = false;
  var onpaste = function(e) {
    if (shiftKey) return;
    for (var i = 0; i < e.clipboardData.items.length; i++) {
      var item = e.clipboardData.items[i];

      if (item.type === 'text/html') {
        item.getAsString(function(html) {
          chrome.runtime.sendMessage({command: 'html2md', source: html}, function(markdown) {
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
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 16) {
      shiftKey = true;
    }
  });
  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 16) {
      shiftKey = false;
    }
  });
})();