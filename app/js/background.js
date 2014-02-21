var hm = new HTML2Markdown();
var mh = new Markdown2HTML();

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