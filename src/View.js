/* built by Thomas Baines and Kelsey Vavasour
Forked from code provided by Mike Lance
Corrected to conform to standard JS 11/04/2018 */

/* global DEBUG VERBOSE */

class View { // eslint-disable-line no-unused-vars
  static BLANK () {
    return ''
  }
  static SPACE () {
    return '&nbsp;'
  }
  static TAB () {
    return '&nbsp;&nbsp;&nbsp;&nbsp;'
  }
  static NEWLINE () {
    return '<br>'
  }

  static DISPBREAK () { // shortened of "Display Break". renders as ', '
    return ',&nbsp;'
  }

  static ENDLINE () {
    return '.<br>'
  }

  static clearMultiple (...idList) { // depreciated
    for (let item of idList) {
      this.clear(item)
    }
  }

  static clear (elementId = 'default') { // depreciated
    // document.body.style.fontFamily = 'Courier New'
    document.getElementById(elementId).innerHTML = ''
  }

  static out (newText, elementId = 'default') {
    document.getElementById(elementId).innerHTML += newText
  }

  static add (newText, elementId = 'default') {
    // NOTES FOR NEXT TIME: Ask mike about programming standards
    // NOTES FOR NEXT TIME: Re:usage of '<br>' versus calling this.NEWLINE()
    let outString = '' // initialize outString
    // first, check if the passed value is a list
    if (Array.isArray(newText)) {
      // the passed value is an array.
      for (let aLine of newText) {
        if (elementId === 'default') {
          outString += '<br>' + aLine // add method includes break characters on the start of each line.
        } else {
          outString += aLine
        }
      }
    } else { // assume the item is a string, because its not an array.
      if (elementId === 'default') {
        outString += '<br>' + newText // adding break character to the line
      } else {
        outString += newText
      }
    }

    document.getElementById(elementId).innerHTML += outString
  }

  static renderParty (aParty, target) {
    this.add(`${aParty}: ${aParty.totalSeats} Seat(s).${this.NEWLINE()}`, target)
    let outString = '' // define storage variable for output values
    for (let aCandidate of aParty.allMyListCandidates) {
      if (aCandidate.isMP()) {
        outString += aCandidate // insert aCandidate's to-string into the out storage variable
      }
    }
    this.out(outString, target) // push the storage variable into the HTML
  }

  static renderElection (anElection, column) {
    // let upperTitle = `column${column}Title` // this needs to be commented out for new dynamic
    let innerTitle = `column${column}MainTitle`
    let innerBody = `column${column}Main`
    // this.add(anElection, upperTitle) // this needs to be commented out for new dynamic
    this.add(anElection, innerTitle)
    for (let aParty of anElection.allMyParliamentParties) {
      this.renderParty(aParty, innerBody)
    }
    // this.out(this.NEWLINE()) // depreciated
  }

  static renderElectorateMPComparisons (aCountry, year1, year2) {
    // Renders the comparison between the party of the electorate mp (for each electorate) in the year1 election vs the year2 election.
    let target = 'electorateMpParty'
    let electorates = aCountry.compareElectorateMPParties(year1, year2)
    let unchangedElectorates = electorates[0]
    let changedElectorates = electorates[1]
    let renderList = []
    renderList.push(`Unchanged Electorates:${this.NEWLINE()}`)
    for (let anElectorate of unchangedElectorates) {
      renderList.push(`${this.NEWLINE()}${anElectorate[0]}: ${this.NEWLINE()}${this.TAB()}${anElectorate[1]}`)
    }
    if (DEBUG) {
      console.log(renderList)
    }
    this.add(renderList, target)

    renderList = []
    renderList.push(`${this.NEWLINE()}${this.NEWLINE()}Changed Electorates:${this.NEWLINE()}`)
    for (let anElectorate of changedElectorates) {
      let outValues = []
      for (let anIndex of anElectorate) {
        switch (anIndex) {
          case null: // handles if the electorate didn't exist in either election.
            outValues.push('No data')
            break
          default:
            outValues.push(anIndex)
        }
      }
      renderList.push(`${this.NEWLINE()}${outValues[0]}: ${this.NEWLINE()}${this.TAB()}${outValues[1]} --> ${outValues[2]}`)
    }
    if (VERBOSE) {
      console.log(renderList)
    }

    this.add(renderList, target)
  }

  static renderElectoratePartyVoteComparisons (mapVoteData) {
    // outputs the comparisons between the first year's party vote (by electorate) to the second year's one.
    // programmer's note: This code is very processor intensive, the view.out calls have a high algorythmic complexity. Possibly investigate storing the values as an out list and pushing them to the view.out in one call.
    let target = 'partyVoteChanges'
    let renderList = []
    renderList.push(`Party Vote Changes, By Electorate:${this.NEWLINE()}`)
    let nameValues = ['Labor', 'National', 'Other'] // to avoid hard coding in loop.
    for (let anElectorate of mapVoteData.keys()) {
      if (DEBUG) {
        if (anElectorate === 'Taranaki-King Country' || anElectorate === 'Taranaki-King') { // manual debug check for anomalous data from election 2014 vs election 2017.
          console.log('Pause for debugging')
        }
      }
      renderList.push(`${anElectorate}:${this.NEWLINE()}`)
      let thisElectorateData = mapVoteData.get(anElectorate)
      let partyIndex = 0
      while (partyIndex < 3) { // loop to display UP // DOWN // STATIC depending on if absolute vote totals increased, decreased, or stayed the same.
        if (thisElectorateData[2][partyIndex] > 0) {
          renderList.push(`${this.TAB()}${nameValues[partyIndex]}: UP${this.NEWLINE()}`)
        } else if (thisElectorateData[2][partyIndex] < 0) {
          renderList.push(`${this.TAB()}${nameValues[partyIndex]}: DOWN${this.NEWLINE()}`)
        } else {
          renderList.push(`${this.TAB()}${nameValues[partyIndex]}: STATIC${this.NEWLINE()}`)
        }
        partyIndex += 1
      }
    }
    renderList.push(this.NEWLINE())
    this.add(renderList, target)
  }

  static renderComparisons (aCountry, year1, year2) {
    this.renderElectorateMPComparisons(aCountry, year1, year2)
    this.renderElectoratePartyVoteComparisons(aCountry.compareElectoratePartyVote(year1, year2))
  }

  static renderCountry (aCountry, year1, year2) {
    if (DEBUG) {
      console.log(aCountry.allMyElections)
    }
    for (let anElection in aCountry.allMyElections) {
      this.renderElection(aCountry.allMyElections[anElection], anElection) // changed to now pass index in the array. Used in renderElection()
    }
    // this.add(`${this.NEWLINE()}Comparisons between Election ${year1} and Election ${year2}${this.ENDLINE()}`) // depreciated with adding the html 2.0
    this.renderElectorateMPComparisons(aCountry, year1, year2)
    this.renderElectoratePartyVoteComparisons(aCountry.compareElectoratePartyVote(year1, year2))
  }
}
