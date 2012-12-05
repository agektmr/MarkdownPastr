window.onload = function() {
  var textarea = document.querySelector('#markdown');
  document.body.addEventListener('paste', function(e) {
    for (var i = 0; i < e.clipboardData.items.length; i++) {
      var item = e.clipboardData.items[i];
      if (item.type === 'text/html') {
        item.getAsString(function(html) {
          chrome.extension.sendMessage({command: 'html2md', source: html}, function(result) {
            textarea.value = result;
          });
        });
      }
    }
    e.preventDefault();
    e.stopPropagation();
  });
  textarea.onkeyup = function() {
    var markdown = textarea.value;
    chrome.extension.sendMessage({command: 'md2html', source: markdown}, function(result) {
      document.querySelector('#html').innerHTML = result;
    });
  };
};
