// Utility functions

function getSubstringIndex(list, subStr) {
  // For use with multi-change with response types, e.g., Fundamentals vs L2 vs L3
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

function sortByStartDate(a, b) {
  // For class series specifically
  var [dateA, dateB] = [new Date(a.startDate), new Date(b.startDate)]
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
  var date = null;
  if (dateString) {
    date = new Date(dateString);
    if (isNaN(date)) {
      date = null;
    }
  }
  return date
};

function addDaysToDate(date, days) {
    date.setDate(date.getDate() + days);
    return date;
};

function getDaysBetweenDates(dateStart, dateEnd) {
  var betweenDates = [];
  for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {
    betweenDates.push(new Date(d));
  }
  return betweenDates
};

function averageValueOfArray(arrayOfNumbers) {
  return arrayOfNumbers.reduce((a, b) => a + b, 0) / arrayOfNumbers.length
}

export { getSubstringIndex, MiscException, sortByDate, sortDateStrings, sortByNameAndEmail, currentMonthIndex, currentMonthString, getMonthString, reactTableFuzzyMatchFilter, currentYear, getDateFromStringSafe, addDaysToDate, getDaysBetweenDates, sortByStartDate, averageValueOfArray }
