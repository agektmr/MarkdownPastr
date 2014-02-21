var global = window;

/**
 * `Elem` object representing an element
 * @param {string}          tag       A tag name string
 * @param {HTMLNode}        dom       DOM Element of this element
 * @param {Array.<Elem>}    children  An array of descendant `Elem`s
 * @param {Array.<string>}  parents   An array of ancestor tag name strings
 */
var Elem = function(tag, dom, children, parents) {
  /** @public */
  this.tag = tag;
  /** @public */
  this.dom = dom;
  /** @public */
  this.children = children;
  /** @public */
  this.parents = parents;
};

Elem.prototype.recursivelyRemoveTopParent = function() {
  if (this.parents.length > 0) {
    this.parents.splice(0, 1);
  }
  if (this.children.length > 0) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].recursivelyRemoveTopParent();
    }
  }
  return this;
};

/**
 * Prepend prefix depending on parent tags
 * @param  {Array.<string>} parents An array of strings of html tag
 * @param  {string}         tag     A string of html tag
 * @return {string}                 A string of Markdown prefix
 */
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
        // Remember `pre` expecting `code` is coming after this
        pre_flag = true;
        break;

      case 'gdoc_code': // special tag for gdocs
        prefix.push('    ');
        break;

      case 'ul':
      case 'ol':
        // Remember number of nests
        ul_count++;
        // Remember last list tag
        last_list = parents[i];
        // Indent nested lists
        if (ul_count > 1) prefix.push('    ');
        break;

      default:
        break;
    }
  }

  if (tag === 'li' && last_list !== '') {
    prefix.push(last_list === 'ul' ? '* ' : '1. ');
  }
  if (tag === 'code' && pre_flag) {
    prefix.push('    ');
  }
// console.log('prefix for', parents, prefix);
  return prefix.join('');
};

/**
 * Generates Markdown code from `Elem`
 * @param  {Elem}     elem    `Elem` object to be converted
 * @param  {boolean}  gdocs   Google Docs mode flag
 * @return {string}           Markdown string
 */
var parse = function(elem, gdocs) {
  var text = '',
      content = '',
      prefix = get_prefix(elem.parents, elem.tag);

  if (elem.children.length > 0) {
    // Recursively parse
    content = parseArray(elem.children, gdocs);
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
      elem.tag !== 'input' &&
      content.length === 0) return '';

  switch(elem.tag) {
    case 'h1':
      text += '\n# '+content+'\n';
      break;

    case 'h2':
      text += '\n## '+content+'\n';
      break;

    case 'h3':
      text += '\n### '+content+'\n';
      break;

    case 'h4':
      text += '\n#### '+content+'\n';
      break;

    case 'a':
      text += '['+content+']('+elem.dom.href+')';
      break;

    case 'img':
      text += '!['+elem.dom.alt+']('+elem.dom.src+')';
      break;

    case 'li':
    case 'blockquote':
      text += prefix+content+'\n';
      break;

    case 'input':
      switch(elem.dom.type) {
        case 'checkbox':
          text += '['+(elem.dom.checked ? 'x' : ' ')+'] ';
          break;
        default:
          break;
      }
      break;

    case 'dl':
    case 'dt':
    case 'dd':
    case 'table':
      text += '<'+elem.tag+'>'+content+'</'+elem.tag+'>\n';
      break;

    case 'tbody':
    case 'tr':
    case 'td':
    case 'th':
      text += '<'+elem.tag+'>'+content+'</'+elem.tag+'>';
      break;

    case 'p':
      text += gdocs ? content+'  \n' : content+'\n\n';
      break;

    case 'hr':
      text += '\n----\n';
      break;

    case 'div':
    case 'section':
    case 'article':
    case 'nav':
    case 'ul':
    case 'ol':
      text += '\n'+content+'\n';
      break;

    case 'br':
      text += '  \n';
      break;

    case 'i':
      text += '_'+content+'_';
      break;

    case 'strong':
    case 'b':
      text += '**'+content+'**';
      break;

    case 'code':
      if (prefix.length !== 0) {  // if this is code block
        var lines = content.split('\n');
        for (var i = 0; i < lines.length; i++) {
          lines[i] = prefix+lines[i];
        }
        content = lines.join('\n');
        text += content+'\n\n';
      } else {                    // if this is inline code
        text += '`'+content+'`';
      }
      break;

    case 'code_line':
      text += content+'\n';
      break;
    case 'gdoc_code':
      text += prefix+content;
      break;

    default:
      text += content;
      break;
  }
  return text;
};

/**
 * Returns parsed Markdown
 * @param  {Array.<Elem>} arr   An array of `Elem`s
 * @param  {boolean}      gdocs Google Docs mode flag
 * @return {string}             A string of Markdown
 */
var parseArray = function(arr, gdocs) {
  var text = '';
  for (var i = 0; i < arr.length; i++) {
    text += parse(arr[i], gdocs);
  }
  return text;
};

/**
 * Recursively traverse DOM. Returns structured objects.
 * @param  {HTMLNode}     elem    Root DOM object to be traversed
 * @param  {HTMLNode}     parents An array of tag names to store parents
 * @return {Array.<Elem>}         An array of `Elem`s
 */
var traverse = function(elem, parents) {
  var result = [],
      length = elem.childNodes.length,
      parent = elem.nodeName.toLowerCase();
  parents.push(parent);

  for (var i = 0; i < length; i++) {
    var child = elem.childNodes[i];
    var tag = child.nodeName.toLowerCase();
    // Detect code like line
    if (tag === 'span' && child.style.fontFamily === "'Courier New'") {
      tag = 'code';
    }
    // parse child's children
    var gchild = [];
    if (child.childNodes.length > 0) {
      gchild = traverse(child, parents.slice(0));
      if (tag === 'p' && child.childNodes.length === 1 && gchild[0].tag === 'code') {
        tag = 'code_line';
        gchild[0].tag = 'gdoc_code';
      }
    }

    result.push(new Elem(tag, child, gchild, parents));
  }
  return result;
};

var HTML2Markdown = function() {
  this.original = '';
  this.root = null;
  this.result = '';
};

HTML2Markdown.prototype.convert = function(html, callback) {
  var gdocs = false;
  this.original = html;
  this.root = document.createElement('div');
  this.root.innerHTML = html;
  this.result = traverse(this.root, []);

  if (this.result.length === 2 && this.result[1].tag === 'b') {
    this.convert2GDocMode();
    gdocs = true;
  } else if (this.result.length === 3 && this.result[1].tag === 'b' && this.result[2].tag === 'br') {
    this.convert2GDocMode();
    gdocs = true;
  }

  callback(parseArray(this.result, gdocs));
};

HTML2Markdown.prototype.convert2GDocMode = function() {
  var children = this.result[1].children;
  this.result.splice(1, 2);
  for (var i = 0; i < children.length; i++) {
    this.result.push(children[i].recursivelyRemoveTopParent());
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

var Markdown2HTML = function() {
  this.original = '';
  this.converted = '';
};

Markdown2HTML.prototype.convert = function(md, callback) {
  this.original = md;

  fetch(md, (function(result) {
    this.converted = result;
    callback(result);
  }).bind(this));
};
