/* Coded by Thomas Baines and Kelsey Vavasour
August 2017
All Rights Reserved
corrected to conform to standardJS 9/11/2017
*/

/* global Party, View, Electorate DEBUG */

class Election { // eslint-disable-line no-unused-vars
// Class for handling elections
  constructor (newYear) {
    // Class Constructor
    this.year = newYear
    this.totalVotes = 0
    this.allMyParties = []
    this.allMyElectorates = []
    this.seatsInParliament = 120
    this.allMyParliamentParties = []
  }

  addParty (newPartyName) {
    /* Create an instance of Party called NewPartyName and add to
    the allMyParties array */
    let capsPartyName = newPartyName.toUpperCase()
    let newParty = new Party(capsPartyName, this)
    this.allMyParties.push(newParty)
    return newParty
  }

  addElectorate (newElectorateName) {
    /* Create an instance of Electorate called newElectorateName
    and add to the allMyElectorates array */
    let newElectorate = new Electorate(newElectorateName, this)
    this.allMyElectorates.push(newElectorate)
    return newElectorate
  }

  findParty (partyName) {
    // function to find the named instance of party
    /* Old Code, arrow functions look a bit prettier.
      function returnParty (aParty) {
      // function used to compare the name attribute of a party with the provided name
      return aParty.name === partyName
    } */
    let theParty = partyName.toUpperCase() // all party names are being stored in upper case - this is to handle input in lower case
    return this.allMyParties.find(aParty => aParty.name === theParty)
    // runs the built in find function on the allMyParties array, comparing the name attribute of each element in the array with the provided name
  }

  findElectorate (electorateName) {
    // finds the electorate with the provided name
    return this.allMyElectorates.find(anElectorate => anElectorate.name === electorateName)
  }

  findCandidate (candidateName, partyName) {
    // function to find the named instance of candidate within the named instance of party
    let candidateParty = this.findParty(partyName)
    // find the named instance of party and store it in a variable
    return candidateParty.findCandidate(candidateName)
    // reference the object stored in the variable to call the function, passing it the candidate name?
  }

  addNonListMP (candidateName, partyName) {
    // function to pass a request for a new instance of candidate from Electorate to the correct instance of Party
    let candidateParty = this.findParty(partyName)
    return candidateParty.addNonListCandidate(candidateName)
  }

  addVotes (newVotes) {
    // increments the total vote count
    this.totalVotes += newVotes
  }

  calculateParliamentParties () {
    // determines which parties in the allMyParties array met the entry threshold, and populates the allMyParliamentParties array accordingly
    let threshold = this.totalVotes / 20 // possibly should be an attribute
    for (let aParty of this.allMyParties) {
      /* Old code from when we broke down this function to try and find a bug
        if (aParty.totalVotes >= threshold) {
        this.allMyParliamentParties.push(aParty)
      } else if (aParty.allMyElectorateMPs.length > 0) {
        this.allMyParliamentParties.push(aParty)
      } */
      if (aParty.totalVotes >= threshold || aParty.getElectorateSeats() > 0) {
        this.allMyParliamentParties.push(aParty)
      }
    }

    // for mike
    let totalVotesInParliament = 0
    for (let party of this.allMyParliamentParties) {
      totalVotesInParliament += party.totalVotes
    }

    console.log("For Mike's Marking:")
    console.log(`Total votes for all parties in parliament for ${this.year} are: ${totalVotesInParliament}\n\n`)

    // bit for mike ends

    return this.allMyParliamentParties
  }

  allocateSeats () {
    // Calculates the seats allocated to each party, and then calls party.allocateSeats() and passes the allocated value to each party
    this.calculateParliamentParties()
    this.seatsInParliament = 120 // smart people proofing, multiple runs of this method don't cause logic errors
    let quotientTable = [[null, 0]] /* quotient table, used to determine the number of seats allocated to a party
                                        needed to be initialized with a null array so the first quotient has something to compare against */
    let breakList = [] // a list, distinct for each loop, of booleans to indicate if the inserted quotient is in an index below 120

    function add (aPair, seatsInParliament) {
      // adds the paired value to the allocated seats array. Returns false if added at index > 119
      for (let index in quotientTable) {
        if (quotientTable[index][1] < aPair[1]) { // this is a sequential search, fix later for efficency (should be binary)
          quotientTable.splice(index, 0, aPair) // inserts the value at the correct index and bumps all later values up one index. The 0 indicates no data is deleted
          return (index <= (seatsInParliament - 1))  // changed to no longer use this, as the scope for this is limited to the add function
          // boolean return to indicate if the added quotient is within the range that gets allocated to a seat
        }
      }
    }
    
    function binaryAdd (aPair, seatsInParliament) {
      // new binary search function to add paired values into the allocated seats array more efficiently
      let lowerBound = 0
      let upperBound = quotientTable.length - 1
      let targetIndex = 0
      // initialise search variables
      
      if (upperBound === 0) {
        // Check for first time through the loop, special condition, simply insert the pair
        quotientTable.splice(0, 0, aPair)
      } else {
        while (lowerBound !== upperBound - 1 ) {
          
          // checking to see if the lower and upper bounds are sequential
          targetIndex = lowerBound + Math.floor((upperBound - lowerBound) / 2)
          // set the target index to the middle of the two bounds
          if (quotientTable[targetIndex][1] > aPair[1]) {
          // if the value at the target index is less than the value to be inserted, move the lower bound, else move the upper bound
            lowerBound = targetIndex
          } else if (quotientTable[targetIndex][1] < aPair[1]) {
            upperBound = targetIndex
          } else {
            // make sure the variable being inserted into the array is pointing to the right place
            upperBound = targetIndex
            break
          }
          
          if (DEBUG) {
            console.log(lowerBound + ' ' + upperBound + ' ' + targetIndex)
          }
        }
        
        quotientTable.splice(upperBound, 0, aPair)
        // once the while condition has been met (lower/upper bounds are sequential), insert the pair
      }
      
      return (upperBound <= (seatsInParliament - 1))
      // boolean return for checkBreak table
    }

    function checkBreak () {
      // searches through the breaklist to see if at least one item returned true
      return breakList.find(aBoolean => aBoolean === true)
    }

    let divisor = 1 // the divisor to calculate the quotient
    let cont = true // break condition for the following while loop
    while (cont) {
      breakList = [] // reset breaklist for each iteration
      for (let aParty of this.allMyParliamentParties) { // iterates through the list of parties
        let aQuotient = aParty.totalVotes / divisor // calculates quotient for insertion into quotientTable
        let currentPair = [aParty.name, aQuotient]
        breakList.push(binaryAdd(currentPair, this.seatsInParliament)) // adds the current pair to the quotient table and stores the returned boolean in breaklist
      }
      divisor += 2 // increment divisor, by two because division is only done by odd numbers
      cont = checkBreak() // runs the checkbreak function to see if the while loop needs to be broken
    }

    let allocatedSeats = quotientTable.slice(0, this.seatsInParliament) // truncates the values from the quotient table that don't translate into a seat allocation

    // generate a map variable of the parliment parties names as keys and initalises values as 0
    let seatsPerParty = new Map()
    for (let aParty of this.allMyParliamentParties) {
      seatsPerParty.set(aParty.name, 0)
    }

    for (let aQuotient of allocatedSeats) { // populates seatsPerParty with the number of seats each party has
      seatsPerParty.set(aQuotient[0], seatsPerParty.get(aQuotient[0]) + 1) // the get is in order to increment the value stored in the map each time it's accessed (there are no more elegant ways of doing this, that we can find)
    }

    for (let aSeatCount of seatsPerParty) { // passes the number of seats each party was allocated to the parties
      if (DEBUG) { // checks global toggle to see if debugging mode is active
        console.log(aSeatCount)
      }

      let aParty = this.findParty(aSeatCount[0])
      if (aParty.getElectorateSeats() > aSeatCount[1]) {
        aSeatCount[1] += aParty.getElectorateSeats() - aSeatCount[1]
        if (DEBUG) { // checks global toggle to see if debugging mode is active
          console.log(`${aParty.name} has had seat count increased due to overhang`)
          console.log(aSeatCount)
        }
        this.seatsInParliament += 1
      }
      aParty.addSeats(aSeatCount[1])
    }

    return true
  }

  getElectorateMap () {
    // generates a map where key = electorate name (as a string) and value = party of the candidate who won the electorat (as instance of party)
    let electorateMap = new Map()
    for (let anElectorate of this.allMyElectorates) {
      electorateMap.set(anElectorate.name, anElectorate.getMyParty())
    }
    return electorateMap
  }

  getElectorateNames () {
    // generates a list of the names of the electorates in this election
    let returnList = []
    for (let electorate of this.allMyElectorates) {
      returnList.push(electorate.name)
    }
    return returnList
  }

// -----------------------VIEW FUNCTIONS-----------------------

  getParties () {
    let returnString = View.BLANK()
    for (let currentParty of this.allMyParties) {
      returnString += currentParty.name + ': ' + currentParty.totalVotes + ' votes' + View.NEWLINE()
    }
    return returnString
  }

  getElectorates () {
    let returnString = View.BLANK()
    for (let currentElectorate of this.allMyElectorates) {
      returnString += currentElectorate.name + ', MP: ' + currentElectorate.myMP + View.NEWLINE()
    }
    return returnString
  }

  getCandidates () {
    let returnString = View.BLANK()
    for (let currentParty of this.allMyParties) {
      returnString += currentParty.name + View.NEWLINE()
      for (let currentCandidate of currentParty.allMyListCandidates) {
        returnString += currentCandidate.listPosition + '. ' + currentCandidate.name
        if (currentCandidate.myElectorate !== undefined) {
          returnString += ', Electorate: ' + currentCandidate.myElectorate
        }
        returnString += View.NEWLINE()
      }
      returnString += View.NEWLINE()
    }
    return returnString
  }

  getAll () {
    let result = 'Election ' + this + View.NEWLINE() + View.NEWLINE()
    result += '*PARTIES*' + View.NEWLINE()
    result += this.getParties() + View.NEWLINE()

    result += '**ELECTORATES**' + View.NEWLINE()
    result += this.getElectorates() + View.NEWLINE()

    result += '***PARTY LISTS***' + View.NEWLINE()
    result += this.getCandidates() + View.NEWLINE() // edited from source (candidatests is not a method)

    return result
  }

  toString () {
    return `Election ${this.year}\n`
  }
}
