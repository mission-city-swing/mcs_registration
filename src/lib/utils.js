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
};

function sortByDate(a, b) {
  // most recent checkins first
  var [dateA, dateB] = [Date.parse(a.date), Date.parse(b.date)]
  if (dateA > dateB) {
    return -1
  } else if (dateA < dateB) {
    return 1
  } else if (dateA === dateB) {
    return 0
  }
};

function currentMonthIndex() {
  var today = new Date();
  return today.getMonth()
}

function currentMonthString() {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[currentMonthIndex()]
}

export { getSubstringIndex, MiscException, sortByDate, currentMonthIndex, currentMonthString }
