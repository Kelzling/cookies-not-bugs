/* built by Thomas Baines and Kelsey Vavasour
Forked from code provided by Mike Lance
Corrected to conform to standard JS 21/02/2018 */

/* global DEBUG */

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

  static clr () {
    document.body.style.fontFamily = 'Courier New'
    document.body.innerHTML = ''
  }

  static out (newText) {
    document.body.innerHTML += newText
  }

  static add (newText) {
    // NOTES FOR NEXT TIME: Ask mike about programming standards
    // NOTES FOR NEXT TIME: Re:usage of '<br>' versus calling this.NEWLINE()
    let outString = '' // initialize outString
    // first, check if the passed value is a list
    if (Array.isArray(newText)) {
      // the passed value is an array.
      for (let aLine of newText) {
        outString += '<br>' + aLine // add method includes break characters on the start of each line.
      }
    } else { // assume the item is a string, because its not an array.
      outString += '<br>' + newText // adding break character to the line
    }

    document.body.innerHTML += outString
  }

  static renderParty (aParty) {
    this.add(`${aParty}: ${aParty.totalSeats} Seat(s).${this.NEWLINE()}`)
    let outString = '' // define storage variable for output values
    for (let aCandidate of aParty.allMyListCandidates) {
      if (aCandidate.isMP()) {
        outString += aCandidate // insert aCandidate's to-string into the out storage variable
      }
    }
    this.out(outString) // push the storage variable into the HTML
  }

  static renderElection (anElection) {
    this.add(anElection + this.NEWLINE())
    for (let aParty of anElection.allMyParliamentParties) {
      this.renderParty(aParty)
    }
    this.out(this.NEWLINE())
  }

  static renderElectorateMPComparisons (aCountry, year1, year2) {
    // Renders the comparison between the party of the electorate mp (for each electorate) in the year1 election vs the year2 election.
    let electorates = aCountry.compareElectorateMPParties(year1, year2)
    let unchangedElectorates = electorates[0]
    let changedElectorates = electorates[1]
    let renderList = []
    renderList.push(`Unchanged Electorates:`)
    for (let anElectorate of unchangedElectorates) {
      renderList.push(`${anElectorate[0]}: ${this.NEWLINE()}${this.TAB()}${anElectorate[1]}`)
    }
    if (DEBUG) {
      console.log(renderList)
    }
    this.add(renderList)

    renderList = []
    renderList.push(`${this.NEWLINE()}Changed Electorates:`)
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
      renderList.push(`${outValues[0]}: ${this.NEWLINE()}${this.TAB()}${outValues[1]} --> ${outValues[2]}`)
    }
    if (DEBUG) {
      console.log(renderList)
    }

    this.add(renderList)
  }

  static renderElectoratePartyVoteComparisons (mapVoteData) {
    // outputs the comparisons between the first year's party vote (by electorate) to the second year's one.
    // programmer's note: This code is very processor intensive, the view.out calls have a high algorythmic complexity. Possibly investigate storing the values as an out list and pushing them to the view.out in one call.
    let renderList = []
    renderList.push(`${this.NEWLINE()}Party Vote Changes, By Electorate:${this.NEWLINE()}`)
    let nameValues = ['Labor', 'National', 'Other'] // to avoid hard coding in loop.
    for (let anElectorate of mapVoteData.keys()) {
      if (DEBUG) {
        if (anElectorate === 'Taranaki-King Country' || anElectorate === 'Taranaki-King') { // manual debug check for anomalous data from election 2014 vs election 2017.
          console.log('Pause for debugging')
        }
      }
      renderList.push(`${anElectorate}:`)
      let thisElectorateData = mapVoteData.get(anElectorate)
      let partyIndex = 0
      while (partyIndex < 3) { // loop to display UP // DOWN // STATIC depending on if absolute vote totals increased, decreased, or stayed the same.
        if (thisElectorateData[2][partyIndex] > 0) {
          renderList.push(`${this.TAB()}${nameValues[partyIndex]}: UP`)
        } else if (thisElectorateData[2][partyIndex] < 0) {
          renderList.push(`${this.TAB()}${nameValues[partyIndex]}: DOWN`)
        } else {
          renderList.push(`${this.TAB()}${nameValues[partyIndex]}: STATIC`)
        }
        partyIndex += 1
      }
    }
    renderList.push(this.NEWLINE())
    this.add(renderList)
  }

  static renderCountry (aCountry, year1, year2) {
    if (DEBUG) {
      console.log(aCountry.allMyElections)
    }
    for (let anElection of aCountry.allMyElections) {
      this.renderElection(anElection)
    }
    this.add(`${this.NEWLINE()}Comparisons between Election ${year1} and Election ${year2}${this.ENDLINE()}`)
    this.renderElectorateMPComparisons(aCountry, year1, year2)
    this.renderElectoratePartyVoteComparisons(aCountry.compareElectoratePartyVote(year1, year2))
  }
}
