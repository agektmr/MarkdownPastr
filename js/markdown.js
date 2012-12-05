(function(context) {

  var get_prefix = function(parents, tag) {
    if (tag === '#text') return '';
    var prefix = [],
        pre_flag = false,
        ul_count = 0,
        last_list = '';
    parents.push(tag);
    for (var i = 0; i < parents.length; i++) {
      switch(parents[i]) {
        case 'blockquote':
          prefix.push('> ');
          break;
        case 'pre':
          pre_flag = true;
          break;
        case 'code':
          if (pre_flag) prefix.push('    ');
          break;
        case 'gdoc_code': // special tag for gdocs
          prefix.push('    ');
          break;
        case 'ul':
        case 'ol':
          ul_count++;
          last_list = parents[i];
          if (ul_count > 1) prefix.push('    ');
          break;
        default:
          break;
      }
    }
    if (tag === 'li' && last_list !== '') {
      prefix.push(last_list === 'ul' ? '* ' : '1. ');
    }
// console.log('prefix for', parents, prefix);
    return prefix.join('');
  };

  var parse = function(elem) {
    var text = '';
    var content = '';
    var prefix = get_prefix(elem.parents.slice(0), elem.tag);
    if (elem.children.length > 0) {
      content = parseArray(elem.children);
    } else {
      content = elem.dom.textContent;
      // content = content.replace(/</g, '&lt;')
      //                  .replace(/>/g, '&gt;')
      //                  .replace(/&/g, '&amp;')
      //                  .replace(/"/g, '&quot;');
    }
    if (elem.tag !== 'img' &&
        elem.tag !== 'br' &&
        elem.tag !== 'hr' &&
        elem.tag !== 'td' &&
        elem.tag !== 'th' &&
        content.length === 0) return '';
    switch(elem.tag) {
      case 'h1':
        text += '\n';
        text += '# ';
        text += content;
        text += '\n';
        break;
      case 'h2':
        text += '\n';
        text += '## ';
        text += content;
        text += '\n';
        break;
      case 'h3':
        text += '\n';
        text += '### ';
        text += content;
        text += '\n';
        break;
      case 'h4':
        text += '\n';
        text += '#### ';
        text += content;
        text += '\n';
        break;
      case 'a':
        text += '[';
        text += content;
        text += '](';
        text += elem.dom.href;
        text += ')';
        break;
      case 'img':
        text += '![';
        text += elem.dom.alt;
        text += '](';
        text += elem.dom.src;
        text += ')';
        break;
      case 'ul':
      case 'ol':
        text += '\n';
        text += content;
        text += '\n';
        break;
      case 'li':
        text += prefix;
        text += content;
        text += '\n';
        break;
      case 'dl':
      case 'dt':
      case 'dd':
      case 'table':
      case 'tr':
      case 'td':
      case 'th':
        text += '<'+elem.tag+'>';
        text += content;
        text += '</'+elem.tag+'>';
        text += '\n';
        break;
      case 'p':
        text += content;
        text += '\n\n';
        break;
      case 'hr':
        text += '\n';
        text += '----';
        text += '\n';
        break;
      case '#text':
        text += content;
        break;
      case 'div':
      case 'section':
      case 'article':
      case 'nav':
        text += '\n';
        text += content;
        text += '\n';
        break;
      case 'blockquote':
        text += prefix;
        text += content;
        text += '\n';
        break;
      case 'br':
        text += '  \n';
        break;
      case 'i':
        text += '_';
        text += content;
        text += '_';
        break;
      case 'strong':
      case 'b':
        text += '**';
        text += content;
        text += '**';
        // TODO
        break;
      case 'code':
        if (prefix.length !== 0) {  // if this is code block
          var lines = content.split('\n');
          for (var i = 0; i < lines.length; i++) {
            lines[i] = prefix+lines[i];
          }
          content = lines.join('\n');
          // text += '```\n';
          // text += content;
          // text += '\n```\n';
          text += '\n';
          text += content;
          text += '\n';
        } else {                    // if this is inline code
          text += '`';
          text += content;
          text += '`';
        }
        break;
      case 'gdoc_code':
        text += prefix;
        text += content;
        break;
      default:
        text += content;
        break;
    }
      return text;
  };

  var parseArray = function(arr) {
    var text = '';
    for (var i = 0; i < arr.length; i++) {
      text += parse(arr[i]);
    }
    return text;
  };

  var traverse = function(elem, parents) {
    var result = [];
    var length = elem.childNodes.length;
    parents.push(elem.nodeName.toLowerCase());
    for (var i = 0; i < length; i++) {
      var child = elem.childNodes[i];
      var tag = child.nodeName.toLowerCase();
      if (tag === 'span' && child.style['font-family'] === '\'Courier New\'') {
        tag = 'gdoc_code';
      }
      // parse child's children
      var gchild = [];
      if (child.childNodes.length > 0) {
        gchild = traverse(child, parents.slice(0));
      }
      result.push({
        tag: tag,
        dom: child,
        children: gchild,
        parents: parents
      });
    }
    return result;
  };

  context.HTML2Markdown = function(html) {
    this.original = '';
    this.root = null;
    this.result = '';
  };
  context.HTML2Markdown.prototype = {
    convert: function(html, callback) {
      this.original = html;
      this.root = document.createElement('div');
      this.root.innerHTML = html;
      this.result = traverse(this.root, []);
      callback(parseArray(this.result));
    }
  };

  var fetch = function(markdown, callback) {
    var ENDPOINT = 'https://api.github.com/markdown/raw';
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      callback(xhr.responseText);
    };
    xhr.onerror = function() {
      callback('Error!');
    };
    xhr.open('POST', ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(markdown);
  };

  context.Markdown2HTML = function() {
    this.original = '';
    this.converted = '';
  };
  context.Markdown2HTML.prototype = {
    convert: function(md, callback) {
      this.original = md;
      fetch(md, (function(result) {
        this.converted = result;
        callback(result);
      }).bind(this));
    }
  };
})(this);