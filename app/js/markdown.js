var Elem = (function() {
  /**
   * `Elem` object representing an element
   * @param {string}          tag       A tag name string
   * @param {HTMLNode}        dom       DOM Element of this element
   * @param {Array.<Elem>}    children  An array of descendant `Elem`s
   * @param {Array.<string>}  parents   An array of ancestor tag name strings
   */
  var Elem = function(elem, parents) {
    var gchildren = [];

    /** @public */
    this.tag = elem.nodeName.toLowerCase();

    if (this.tag === 'span' && elem.style.fontFamily === "'Courier New'") {
      this.tag = 'code';
    }

    /** @public */
    this.dom = elem;

    if (elem.parentNode) {
      parents.push(elem.parentNode.nodeName.toLowerCase());
    }

    /** @public */
    this.parents = parents.slice();

    for (var i = 0; i < elem.childNodes.length; i++) {
      gchildren.push(new Elem(elem.childNodes[i], parents.slice()));
    }

    if (this.tag === 'code' && gchildren.length === 1) {
      gchildren[0].parents.splice(-1, 1, this.tag);
    }

    // If this is the single child node of `p` and is `code`
    if (this.tag === 'p' && gchildren.length === 1 && gchildren[0].tag === 'code') {
      this.tag = 'code_line';
      gchildren[0].parents.splice(-1, 1, this.tag);
      gchildren[0].tag = 'code_block';
    }

    /** @public */
    this.children = gchildren;
  };

  Elem.prototype.recursivelyRemoveTopParent = function() {
    var removed = this.parents.splice(0, 1);
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].recursivelyRemoveTopParent();
    }
  };

  /**
   * Returns parsed Markdown
   * @param  {Array.<Elem>} arr   An array of `Elem`s
   * @param  {boolean}      gdocs Google Docs mode flag
   * @return {string}             A string of Markdown
   */
  Elem.prototype.convertChildren = function(gdocs) {
    var text = '';
    for (var i = 0; i < this.children.length; i++) {
      text += this.children[i].convert(gdocs);
    }
    return text;
  };

  /**
   * Generates Markdown code from `Elem`
   * @param  {boolean}  gdocs   Google Docs mode flag
   * @return {string}           Markdown string
   */
  Elem.prototype.convert = function(gdocs) {
    if (debug) console.log('input: %o', this);
    var text = '',
        content = '',
        prefix = get_prefix(this.parents.slice(), this.tag);

    if (this.children.length > 0) {
      // Recursively parse
      content = this.convertChildren(gdocs);
    } else {
      content = this.dom.textContent;
    }

    if (this.tag !== 'img' &&
        this.tag !== 'br' &&
        this.tag !== 'hr' &&
        this.tag !== 'td' &&
        this.tag !== 'th' &&
        this.tag !== 'input' &&
        content.length === 0) return '';

    switch(this.tag) {
      case 'h1':
        text += '# '+content+'\n';
        break;

      case 'h2':
        text += '## '+content+'\n';
        break;

      case 'h3':
        text += '### '+content+'\n';
        break;

      case 'h4':
        text += '#### '+content+'\n';
        break;

      case 'a':
        text += '['+content+']('+this.dom.href+')';
        break;

      case 'img':
        text += '!['+this.dom.alt+']('+this.dom.src+')';
        break;

      case 'li':
      case 'blockquote':
        text += prefix+content+'\n';
        break;

      case 'input':
        switch(this.dom.type) {
          case 'checkbox':
            text += '['+(this.dom.checked ? 'x' : ' ')+'] ';
            break;
          default:
            break;
        }
        break;

      case 'dl':
      case 'dt':
      case 'dd':
      case 'table':
        text += '<'+this.tag+'>'+content+'</'+this.tag+'>\n';
        break;

      case 'tbody':
      case 'tr':
      case 'td':
      case 'th':
        text += '<'+this.tag+'>'+content+'</'+this.tag+'>';
        break;

      case 'p':
        if (gdocs) {
          if (this.parents.indexOf('li') !== -1) {
            text = content;
          } else {
            text += this.parents.length === 1 ? content+'  \n' : content+'\n'
          }
        } else {
          text += content+'\n\n';
        }
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
          content = content.split('\n').map(function(line) {
            return prefix+line;
          }).join('\n');
          text += content+'\n\n';
        } else {                    // if this is inline code
          text += '`'+content+'`';
        }
        break;

      case 'code_line':
        text += content+'\n';
        break;

      case 'code_block':
        text += prefix+content;
        break;

      default:
        text += content;
        break;
    }
    if (this.children.length === 0 && this.parents.join().indexOf('code') === -1) {
      text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    if (debug) console.log('output: %s', text);
    return text;
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

        case 'code_block': // special tag for gdocs
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

    if (tag == 'li' && last_list !== '') {
      prefix.push(last_list == 'ul' ? '* ' : '1. ');
    }
    if (tag == 'code' && pre_flag) {
      prefix.push('    ');
    }
    if (debug) console.log('prefix for', parents, prefix);
    return prefix.join('');
  };

  return Elem;
})();

var HTML2Markdown = function() {
  this.original = '';
  this.root = null;
  this.result = '';
};

HTML2Markdown.prototype.convert = function(html, callback) {
  var gdocs = false;
  this.original = html;
  var div = document.createElement('div');
  div.innerHTML = html;
  this.root = document.createDocumentFragment();
  while (div.children.length) {
    switch (div.children[0].nodeName) {
      case 'META':
        gdocs = true;
        div.removeChild(div.children[0]);
        break;
      default:
        this.root.appendChild(div.children[0]);
        break;
    }
  }

  var root = new Elem(this.root, []);
  if (debug) console.log('After traverse: %o', root);
  this.result = root.children[0];

  if (gdocs) {
    if (debug) console.log('GDoc Mode');
    this.convert2GDocMode();
  }

  if (debug) console.log('After GDocConvert: %o', this.result);

  callback(this.result.convertChildren(gdocs));
};

HTML2Markdown.prototype.convert2GDocMode = function() {
  this.result.recursivelyRemoveTopParent();
};

var Markdown2HTML = function() {
  this.original = '';
  this.converted = '';
};

Markdown2HTML.prototype.convert = function(md, callback) {
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

  this.original = md;

  fetch(md, (function(result) {
    this.converted = result;
    callback(result);
  }).bind(this));
};
