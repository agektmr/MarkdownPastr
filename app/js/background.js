var hm = new HTML2Markdown();
var mh = new Markdown2HTML();

chrome.runtime.onInstalled.addListener(function(details) {
  // Pop up history page only if the version changes in major (ex 2.0.0) or minor (ex 2.1.0).
  // Trivial change (ex 2.1.1) won't popu up.
  if (details.reason == 'install') {
    chrome.tabs.create({url:'http://demo.agektmr.com/MarkdownPastr/welcome.html'});
  } else if (details.reason === 'update') {
    chrome.tabs.create({url:chrome.runtime.getURL('/HISTORY.html')});
  }
});

chrome.runtime.onMessage.addListener(function(req, sender, callback) {
  switch(req.command) {
    case 'html2md':
      hm.convert(req.source, function(result) {
        callback(result);
      });
      break;

    case 'md2html':
      mh.convert(req.source, function(result) {
        callback(result);
      });
      break;

    default:
      break;
  }
  return true;
});