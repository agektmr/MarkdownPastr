var hm = new HTML2Markdown();
var mh = new Markdown2HTML();
var debug = chrome.runtime.getManifest().key === undefined ? true : false;

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == 'install') {
    chrome.tabs.create({url:'http://demo.agektmr.com/MarkdownPastr/welcome.html'});
  } else if (details.reason === 'update') {
    chrome.tabs.create({url:chrome.runtime.getURL('/HISTORY.html')});
  }
});

chrome.runtime.onMessage.addListener(function(req, sender, callback) {
  switch(req.command) {
    case 'queryDebug':
      callback(debug);
      break;

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