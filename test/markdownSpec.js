var style = document.createElement('style');
style.innerHTML = '.html-reporter .result-message {white-space: normal;}'
document.head.appendChild(style);

var dom = function(tag) {
  return document.createElement(tag);
};
var text = function(str) {
  return document.createTextNode(str);
};

describe('markdown', function() {
  describe('traverse', function() {
    it('returns proper array of Elems for short content.', function() {
      var html = '<div>abc</div>';
      var answer = [
        {
          tag: 'div',
          dom: dom('div'),
          children: [
            {
              tag: '#text',
              dom: text('abc'),
              children: [],
              parents: ['div', 'div']
            }
          ],
          parents: ['div']
        }
      ];
      var root = dom('div');
      root.innerHTML = html;
      var result = traverse(root, []);
      expect(result).toDeepEqual(answer);
    });

    it('returns proper array of Elems on longer content.', function() {
      var html = '<meta charset="utf-8">'+
                 '<h5 style="margin: 10px 0px 0px; color: rgb(0, 0, 0); font-family: Times; font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">背景</h5>'+
                 '<a href="http://www.htmq.com/css3/background-clip.shtml" style="color: rgb(128, 0, 128); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">background-clip</a>'+
                 '<span style="color: rgb(0, 0, 0); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(238, 238, 238); display: inline !important; float: none;">'+
                   '<span class="Apple-converted-space"> </span>'+
                   '…… 背景の適用範囲を指定する</span>'+
                 '<br style="color: rgb(0, 0, 0); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">'+
                 '<a href="http://www.htmq.com/css3/background-origin.shtml" style="color: rgb(128, 0, 128); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">background-origin</a>'+
                 '<span style="color: rgb(0, 0, 0); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(238, 238, 238); display: inline !important; float: none;">'+
                   '<span class="Apple-converted-space"> </span>…… 背景の基準位置を指定する</span>'+
                 '<br style="color: rgb(0, 0, 0); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">'+
                 '<a href="http://www.htmq.com/css3/background-size.shtml" style="color: rgb(128, 0, 128); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">background-size</a>'+
                 '<span style="color: rgb(0, 0, 0); font-family: Times; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(238, 238, 238); display: inline !important; float: none;">'+
                   '<span class="Apple-converted-space"> </span>…… 背景画像のサイズを指定する</span>';

      var answer = [
        {
          tag: 'meta',
          dom: dom('meta'),
          children: [],
          parents: ['div']
        },
        {
          tag: 'h5',
          dom: dom('h5'),
          children: [
            {
              tag: '#text',
              dom: text('背景'),
              children: [],
              parents: ['div', 'h5']
            }
          ],
          parents: ['div']
        },
        {
          tag: 'a',
          dom: dom('a'),
          children: [
            {
              tag: '#text',
              dom: text('background-clip'),
              children: [],
              parents: ['div', 'a']
            }
          ],
          parents: ['div']
        },
        {
          tag: 'span',
          dom: dom('span'),
          children: [
            {
              tag: 'span',
              dom: dom('span'),
              children: [
                {
                  tag: '#text',
                  dom: text(' '),
                  children: [],
                  parents: ['div', 'span', 'span']
                }
              ],
              parents: ['div', 'span']
            },
            {
              tag: '#text',
              dom: text('…… 背景の適用範囲を指定する'),
              children: [],
              parents: ['div', 'span']
            }
          ],
          parents: ['div']
        },
        {
          tag: 'br',
          dom: dom('br'),
          children: [],
          parents: ['div']
        },
        {
          tag: 'a',
          dom: dom('a'),
          children: [
            {
              tag: '#text',
              dom: text('background-origin'),
              children: [],
              parents: ['div', 'a']
            }
          ],
          parents: ['div']
        },
        {
          tag: 'span',
          dom: dom('span'),
          children: [
            {
              tag: 'span',
              dom: dom('span'),
              children: [
                {
                  tag: '#text',
                  dom: text(' '),
                  children: [],
                  parents: ['div', 'span', 'span']
                }
              ],
              parents: ['div', 'span']
            },
            {
              tag: '#text',
              dom: text('…… 背景の基準位置を指定する'),
              children: [],
              parents: ['div', 'span']
            }
          ],
          parents: ['div']
        },
        {
          tag: 'br',
          dom: dom('br'),
          children: [
          ],
          parents: ['div']
        },
        {
          tag: 'a',
          dom: dom('a'),
          children: [
            {
              tag: '#text',
              dom: text('background-size'),
              children: [],
              parents: ['div', 'a']
            }
          ],
          parents: ['div']
        },
        {
          tag: 'span',
          dom: dom('span'),
          children: [
            {
              tag: 'span',
              dom: dom('span'),
              children: [
                {
                  tag: '#text',
                  dom: text(' '),
                  children: [],
                  parents: ['div', 'span', 'span']
                }
              ],
              parents: ['div', 'span']
            },
            {
              tag: '#text',
              dom: text('…… 背景画像のサイズを指定する'),
              children: [],
              parents: ['div', 'span']
            }
          ],
          parents: ['div']
        }
      ];
      var root = dom('div');
      root.innerHTML = html;
      var result = traverse(root, []);
      expect(result).toDeepEqual(answer);
    });

    it('returns proper array of Elems for table content.', function() {
      var html = '<table><tr><th>header</th></tr><tr><td>test</td></tr></table>';
      var answer = [
        {
          tag: 'table',
          dom: dom('table'),
          children: [
            {
              tag: 'tbody',
              dom: dom('tbody'),
              children: [
                {
                  tag: 'tr',
                  dom: dom('tr'),
                  children: [
                    {
                      tag: 'th',
                      dom: dom('th'),
                      children: [
                        {
                          tag: '#text',
                          dom: text('header'),
                          children: [],
                          parents: ['div', 'table', 'tbody', 'tr', 'th']
                        }
                      ],
                      parents: ['div', 'table', 'tbody', 'tr']
                    }
                  ],
                  parents: ['div', 'table', 'tbody']
                },
                {
                  tag: 'tr',
                  dom: dom('tr'),
                  children: [
                    {
                      tag: 'td',
                      dom: dom('td'),
                      children: [
                        {
                          tag: '#text',
                          dom: text('test'),
                          children: [],
                          parents: ['div', 'table', 'tbody', 'tr', 'td']
                        }
                      ],
                      parents: ['div', 'table', 'tbody', 'tr']
                    }
                  ],
                  parents: ['div', 'table', 'tbody']
                }
              ],
              parents: ['div', 'table']
            }
          ],
          parents: ['div']
        }
      ];
      var root = dom('div');
      root.innerHTML = html;
      var result = traverse(root, []);
      expect(result).toDeepEqual(answer);
    });
  });

  describe('get_prefix', function() {
    it('prefixes code', function() {
      var parents = ['pre'];
      var tag = 'code';
      var result = get_prefix(parents, tag);
      expect(result).toBe('    ');
    });
    it('prefixes blockquote', function() {
      var parents = ['blockquote'];
      var tag = 'p';
      var result = get_prefix(parents, tag);
      expect(result).toBe('> ');
    });
    it('prefixes ul list', function() {
      var parents = ['ul'];
      var tag = 'li';
      var result = get_prefix(parents, tag);
      expect(result).toBe('* ');
    });
    it('prefixes ol list', function() {
      var parents = ['ol'];
      var tag = 'li';
      var result = get_prefix(parents, tag);
      expect(result).toBe('1. ');
    });
    it('prefixes nested list', function() {
      var parents = ['ul', 'ol', 'ul'];
      var tag = 'li';
      var result = get_prefix(parents, tag);
      expect(result).toBe('        * ');
    });
  });

  describe('HTML2Markdown', function() {
    var h2m = new HTML2Markdown();

    it('can parse h1', function() {
      h2m.convert('<h1>test</h1>', function(result) {
        expect(result).toBe('\n# test\n');
      });
    });
    it('can parse h2', function() {
      h2m.convert('<h2>test</h2>', function(result) {
        expect(result).toBe('\n## test\n');
      });
    });
    it('can parse h3', function() {
      h2m.convert('<h3>test</h3>', function(result) {
        expect(result).toBe('\n### test\n');
      });
    });
    it('can parse h4', function() {
      h2m.convert('<h4>test</h4>', function(result) {
        expect(result).toBe('\n#### test\n');
      });
    });
    it('can parse a', function() {
      h2m.convert('<a href="http://example.com/">test</a>', function(result) {
        expect(result).toBe('[test](http://example.com/)');
      });
    });
    it('can parse img', function() {
      h2m.convert('<img src="http://example.com/test.jpg" alt="test">', function(result) {
        expect(result).toBe('![test](http://example.com/test.jpg)');
      });
    });
    it('can parse li', function() {
      h2m.convert('<li>test1</li>', function(result) {
        expect(result).toBe('test1\n');
      });
    });
    it('can parse ul', function() {
      h2m.convert('<ul><li>test1</li><li>test2</li></ul>', function(result) {
        expect(result).toBe('\n* test1\n* test2\n\n');
      });
    });
    it('can parse ol', function() {
      h2m.convert('<ol><li>test1</li><li>test2</li></ol>', function(result) {
        expect(result).toBe('\n1. test1\n1. test2\n\n');
      });
    });
    it('can parse blockquote', function() {
      h2m.convert('<blockquote>test</blockquote>', function(result) {
        expect(result).toBe('> test\n');
      });
    });
    it('can parse input[type=checkbox]', function() {
      h2m.convert('<input type="checkbox" checked>', function(result) {
        expect(result).toBe('[x] ');
      });
    });
    it('can parse p', function() {
      h2m.convert('<p>test</p>', function(result) {
        expect(result).toBe('test\n\n');
      });
    });
    it('can parse hr', function() {
      h2m.convert('<hr>', function(result) {
        expect(result).toBe('\n----\n');
      });
    });
    it('can parse div', function() {
      h2m.convert('<div>test</div>', function(result) {
        expect(result).toBe('\ntest\n');
      });
    });
    it('can parse section', function() {
      h2m.convert('<section>test</section>', function(result) {
        expect(result).toBe('\ntest\n');
      });
    });
    it('can parse article', function() {
      h2m.convert('<article>test</article>', function(result) {
        expect(result).toBe('\ntest\n');
      });
    });
    it('can parse nav', function() {
      h2m.convert('<nav>test</nav>', function(result) {
        expect(result).toBe('\ntest\n');
      });
    });
    it('can parse br', function() {
      h2m.convert('test<br>', function(result) {
        expect(result).toBe('test  \n');
      });
    });
    it('can parse i', function() {
      h2m.convert('<i>test</i>', function(result) {
        expect(result).toBe('_test_');
      });
    });
    it('can parse strong', function() {
      h2m.convert('<strong>test</strong>', function(result) {
        expect(result).toBe('**test**');
      });
    });
    it('can parse b', function() {
      h2m.convert('<b>test</b>', function(result) {
        expect(result).toBe('**test**');
      });
    });
    it('can parse code', function() {
      h2m.convert('<code>test</code>', function(result) {
        expect(result).toBe('`test`');
      });
    });
    it('can parse gdoc_code', function() {
      h2m.convert('<meta><b><p><span style="font-family:\'Courier New\'">test</span></p></b>', function(result) {
        expect(result).toBe('    test\n');
      });
    });
    it('can parse dl', function() {
      h2m.convert('<dl>test</dl>', function(result) {
        expect(result).toBe('<dl>test</dl>\n');
      });
    });
    it('can parse dt', function() {
      h2m.convert('<dt>test</dt>', function(result) {
        expect(result).toBe('<dt>test</dt>\n');
      });
    });
    it('can parse dd', function() {
      h2m.convert('<dd>test</dd>', function(result) {
        expect(result).toBe('<dd>test</dd>\n');
      });
    });
    it('can parse table', function() {
      h2m.convert('<table><tr><th>header</th></tr><tr><td>test</td></tr></table>', function(result) {
        expect(result).toBe('<table><tbody><tr><th>header</th></tr><tr><td>test</td></tr></tbody></table>\n');
      });
    });
    it('can parse code block', function() {
      var html = '<pre><code>this.addMatchers({\n'+
                 '    toDeepEqual: function(expected) {\n'+
                 '        return _.isEqual(this.actual, expected);\n'+
                 '    });\n'+
                 '});</code></pre>';
      var answer = '    this.addMatchers({\n'+
                   '        toDeepEqual: function(expected) {\n'+
                   '            return _.isEqual(this.actual, expected);\n'+
                   '        });\n'+
                   '    });\n\n';
      h2m.convert(html, function(result) {
        expect(result).toBe(answer);
      });
    });
    it('can parse inline code', function() {
      var html = '<span>test <code>code</code> test</span>';
      var answer = 'test `code` test';
      h2m.convert(html, function(result) {
        expect(result).toBe(answer);
      });
    });
    it('can parse practical example 1', function() {
      var html = '<meta charset="utf-8">'+
                 '<p style="margin: 0px 0px 1em; padding: 0px; border: 0px; font-size: 14px; vertical-align: baseline; background-color: rgb(255, 255, 255); clear: both; color: rgb(0, 0, 0); font-family: Arial, "Liberation Sans", "DejaVu Sans", sans-serif; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: 17.804800033569336px; orphans: auto; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-position: initial initial; background-repeat: initial initial;">If that works, you could create a'+
                   '<span class="Apple-converted-space"> </span>'+
                   '<a href="https://github.com/pivotal/jasmine/wiki/Matchers" rel="nofollow" style="margin: 0px; padding: 0px; border: 0px; font-size: 14px; vertical-align: baseline; background-color: transparent; color: rgb(74, 107, 130); text-decoration: none; cursor: pointer; background-position: initial initial; background-repeat: initial initial;">custom matcher</a>'+
                   ':</p>'+
                 '<pre style="margin: 0px 0px 10px; padding: 5px; border: 0px; font-size: 14px; vertical-align: baseline; background-color: rgb(238, 238, 238); font-family: Consolas, Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", \'Courier New\', monospace, serif; overflow: auto; width: auto; max-height: 600px; word-wrap: normal; color: rgb(0, 0, 0); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: 17.804800033569336px; orphans: auto; text-align: left; text-indent: 0px; text-transform: none; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-position: initial initial; background-repeat: initial initial;">'+
                   '<code style="margin: 0px; padding: 0px; border: 0px; font-size: 14px; vertical-align: baseline; background-color: rgb(238, 238, 238); font-family: Consolas, Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", \'Courier New\', monospace, serif; background-position: initial initial; background-repeat: initial initial;">this.addMatchers({\n'+
                   '    toDeepEqual: function(expected) {\n'+
                   '        return _.isEqual(this.actual, expected);\n'+
                   '    });\n'+
                   '});\n'+
                   '</code></pre>'+
                 '<p style="margin: 0px 0px 1em; padding: 0px; border: 0px; font-size: 14px; vertical-align: baseline; background-color: rgb(255, 255, 255); clear: both; color: rgb(0, 0, 0); font-family: Arial, "Liberation Sans", "DejaVu Sans", sans-serif; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: 17.804800033569336px; orphans: auto; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-position: initial initial; background-repeat: initial initial;">So you can then write specs like so:</p>';
      var answer = 'If that works, you could create a [custom matcher](https://github.com/pivotal/jasmine/wiki/Matchers):\n'+
                   '\n'+
                   '    this.addMatchers({\n'+
                   '        toDeepEqual: function(expected) {\n'+
                   '            return _.isEqual(this.actual, expected);\n'+
                   '        });\n'+
                   '    });\n'+
                   '    \n\n'+
                   'So you can then write specs like so:\n'+
                   '\n';
      h2m.convert(html, function(result) {
        expect(result).toBe(answer);
      });
    });
    it('can parse practical gdoc 1', function() {
      var html = '<meta charset="utf-8">'+
                '<b style="font-weight:normal;" id="docs-internal-guid-10fff47a-4a9c-d7df-0f0e-dce58739f73e">'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">FileError</span>'+
                    '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> object is &quot;</span>'+
                    '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">QuotaExceededError</span>'+
                    '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">&quot; or not.</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">Note that FileSystem will throw a </span>'+
                    '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">DOMException</span>'+
                    '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> if you use sync version of the API (</span>'+
                    '<a href="http://www.html5rocks.com/en/tutorials/file/filesystem-sync/" style="text-decoration:none;">'+
                      '<span style="font-size:15px;font-family:Arial;color:#1155cc;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:underline;vertical-align:baseline;white-space:pre-wrap;">FileSystemSync</span>'+
                    '</a>'+
                    '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">).</span>'+
                  '</p>'+
                  '<br>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"></span>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">filesystem.root.getFile(name, {create:true, exclusive:false}, function(fileEntry) {</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#0000  00;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;fileEntry.createWriter(function(writer) {</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;writer.onwriteend = function() {</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;};</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;writer.onerror = function(progressEvent) {</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var error = progressEvent.target.error; // FileError</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                  '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (error.name === \'QuotaExceededError\') {</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                  '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Fallback code comes here.</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;};</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;&nbsp;&nbsp;writer.write(blob);</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> &nbsp;});</span>'+
                  '</p>'+
                  '<p dir="ltr" style="line-height:1.15;margin-top:0pt;margin-bottom:0pt;">'+
                    '<span style="font-size:13px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">});</span>'+
                  '</p>'+
                  '<br>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"></span>'+
                  '<h2 dir="ltr" style="line-height:1.15;margin-top:10pt;margin-bottom:0pt;">'+
                    '<span style="font-size:17px;font-family:"Trebuchet MS";color:#000000;background-color:transparent;font-weight:bold;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">IndexedDB API</span>'+
                  '</h2>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">When quota exceeds on </span>'+
                  '<a href="http://www.html5rocks.com/en/tutorials/indexeddb/todo/" style="text-decoration:none;">'+
                    '<span style="font-size:15px;font-family:Arial;color:#1155cc;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:underline;vertical-align:baseline;white-space:pre-wrap;">IndexedDB API</span>'+
                  '</a>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">, the error calls the transaction\'s </span>'+
                  '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">onabort()</span>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> function with </span>'+
                  '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">Event</span>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> as an argument. To determine if the error is caused by a quota exceed, check if </span>'+
                  '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">name</span>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> property of </span>'+
                  '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">DOMError</span>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;"> object is &quot;</span>'+
                  '<span style="font-size:15px;font-family:\'Courier New\';color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">QuotaExceededError</span>'+
                  '<span style="font-size:15px;font-family:Arial;color:#000000;background-color:transparent;font-weight:normal;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">&quot; or not.</span>'+
                '</b>'+
                '<br/>';
      var answer = '`FileError` object is "`QuotaExceededError`" or not.  \n'+
                   'Note that FileSystem will throw a `DOMException` if you use sync version of the API ([FileSystemSync](http://www.html5rocks.com/en/tutorials/file/filesystem-sync/)).  \n'+
                   '  \n'+
                   '    filesystem.root.getFile(name, {create:true, exclusive:false}, function(fileEntry) {\n'+
                   '      fileEntry.createWriter(function(writer) {\n'+
                   '        writer.onwriteend = function() {\n'+
                   '          ...\n'+
                   '        };\n'+
                   '        writer.onerror = function(progressEvent) {\n'+
                   '          var error = progressEvent.target.error; // FileError\n'+
                   '          if (error.name === \'QuotaExceededError\') {\n'+
                   '            // Fallback code comes here.\n'+
                   '          }\n'+
                   '        };\n'+
                   '        writer.write(blob);\n'+
                   '      });\n'+
                   '    });\n'+
                   '  \n'+
                   '\n'+
                   '## IndexedDB API\n'+
                   'When quota exceeds on [IndexedDB API](http://www.html5rocks.com/en/tutorials/indexeddb/todo/), the error calls the transaction\'s `onabort()` function with `Event` as an argument. To determine if the error is caused by a quota exceed, check if `name` property of `DOMError` object is "`QuotaExceededError`" or not.';
      h2m.convert(html, function(result) {
        expect(result).toBe(answer);
      });
    });
  });
});
