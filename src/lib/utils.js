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
  var [dateA, dateB] = [new Date(a.date), new Date(b.date)]
  if (dateA > dateB) {
    return -1
  } else if (dateA < dateB) {
    return 1
  } else if (dateA === dateB) {
    return 0
  }
};

function sortDateStrings(a, b) {
  var [aDate, bDate] = [new Date(a), new Date(b)];
  if (aDate > bDate) {
    return 1
  } else if (aDate < bDate) {
    return -1
  } else if (aDate === bDate) {
    return 0
  }
};

function sortByNameAndEmail(profileA, profileB) {
  var nameA = (profileA.firstName + " " + profileA.lastName + " " + profileA.email).toLowerCase();
  var nameB = (profileB.firstName + " " + profileB.lastName + " " + profileB.email).toLowerCase();
  if (nameA > nameB) {
    return 1
  } else if (nameA < nameB) {
    return -1
  } else if (nameA === nameB) {
    return 0
  }
};

function currentYear() {
  var today = new Date();
  return today.getFullYear()
};

function currentMonthIndex() {
  var today = new Date();
  return today.getMonth()
};

function getMonthString(index) {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[index]
}

function currentMonthString() {
  return getMonthString(currentMonthIndex())
};

function reactTableFuzzyMatchFilter(filter, row) {
  return String(row[filter.id]).toLowerCase().includes(String(filter.value).toLowerCase())
};

function getDateFromStringSafe(dateString) {
  console.log(dateString);
  var date = null;
  if (dateString) {
    date = new Date(dateString);
    console.log(date);
    if (isNaN(date)) {
      console.log([date, date instanceof Date, isNaN(date)]);
      date = null;
    }
  }
  return date
};

export { getSubstringIndex, MiscException, sortByDate, sortDateStrings, sortByNameAndEmail, currentMonthIndex, currentMonthString, getMonthString, reactTableFuzzyMatchFilter, currentYear, getDateFromStringSafe }
