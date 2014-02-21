var hm = new HTML2Markdown();
var mh = new Markdown2HTML();

chrome.runtime.onInstalled.addListener(function(details) {
  // Pop up history page only if the version changes in major (ex 2.0.0) or minor (ex 2.1.0).
  // Trivial change (ex 2.1.1) won't popu up.
  if (chrome.runtime.getManifest().version.match(/0$/)) {
    if (details.reason === 'update' || details.reason === 'install') {
      chrome.tabs.create({url:chrome.extension.getURL('/README.html')});
    }
  }
});

chrome.runtime.onMessage.addListener(function(req, sender, callback) {
  switch(req.command) {
    case 'html2md':
      hm.convert(req.source, function(result) {
        console.log(hm);
        callback(result);
      });
      break;

    case 'md2html':
      mh.convert(req.source, function(result) {
        console.log(hm);
        callback(result);
      });
      break;

    default:
      break;
  }
  return true;
});