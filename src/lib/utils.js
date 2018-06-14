// Utility functions

function getSubstringIndex(list, subStr) {
  // For use with multi-change with response types, e.g., Fundamentals vs Intermediate
  for (var i = 0; i < list.length; i++) {
      if (list[i].indexOf(subStr) !== -1 ) {
        return(i);
      }
  }
  return(-1);
};


function MiscException(message, name = "MiscException") {
	return {
    message: message,
    toString: function() { return name + ": " + message },
    name: name
	}
}

export { getSubstringIndex, MiscException }
