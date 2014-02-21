beforeEach(function() {
  jasmine.addMatchers({
    toBeIdenticalObject: function() {
      return {
        compare: function(actual, expected) {

        }
      }
    },
    toBeIdenticalArray: function() {
      return {
        compare: function(actual, expected) {
          return true;
        }
      };
    },
    toBeIdenticalDOMElement: function() {
      return {
        compare: function(actual, expected) {
          return true;
        }
      };
    },
    toDeepEqual: function() {
      var match = function(actual, expected) {
        var length = actual.children.length;
        if (actual.tag === expected.tag &&
            actual.dom.nodeName === expected.dom.nodeName &&
            length === expected.children.length &&
            _.isEqual(actual.parents, expected.parents)) {
          var matches = 0;
          for (var i = 0; i < length; i++) {
            if (match(actual.children[i], expected.children[i])) {
              matches++;
            }
          }
          if (matches === length) return true;
        } else {
          console.error('found mismatch:', actual, expected);
        }
        return false;
      };
      return {
        compare: function(actual, expected) {
          var count = 0;
          for (i = 0; i < actual.length; i++) {
            if (match(actual[i], expected[i])) {
              count++;
            }
          }

          var result = count === actual.length ? true : false;

          return {
            pass: result
          };
        }
      };
    }
  });
});