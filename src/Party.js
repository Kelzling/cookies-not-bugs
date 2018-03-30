/* Coded by Thomas Baines and Kelsey Vavasour
August 2017
All Rights Reserved
corrected to conform to standardJS 9/11/2017
*/

/* global Candidate DEBUG */

class Party { // eslint-disable-line no-unused-vars
// Class to store information about a party
  constructor (newName, election) {
    this.totalVotes = 0
    this.totalSeats = 0
    this.name = newName
    this.myElection = election
    this.allMyCandidates = []
    this.allMyListCandidates = []
    this.allMyListMPs = []
    this.allMyElectorateMPs = []
  }

  addListCandidates (...allNewCandidateNames) {
    // function to add one or more candidates to the party list
    // let plp = 1
    for (let aCandidateName of allNewCandidateNames) {
      let newCandidate = new Candidate(aCandidateName, this, this.allMyCandidates.length + 1)
      // plp += 1
      this.allMyCandidates.push(newCandidate)
      // there are two arrays that list candidates need to exist in
      this.allMyListCandidates.push(newCandidate)
    }
  }

  addNonListCandidate (newCandidateName) {
    // function to create a new instance of candidate for an electorate winner who is not on a party list.
    let newCandidate = new Candidate(newCandidateName, this)
    this.allMyCandidates.push(newCandidate)
    // only needs to be in one array
    return newCandidate
  }

  findCandidate (candidateName) {
  // function to find a specific named instance of candidate and return it
    /* Old code written before learning about arrow functions
      function returnCandidate (aCandidate) {
      // function to use with the .find method. checks name attribute of objects in array
      // against the name passed to the function
      return aCandidate.name === candidateName
    } */
    return this.allMyCandidates.find(aCandidate => aCandidate.name === candidateName)
    // should theoretically return the first instance in the array that returns true
  }

  addElectorateMP (anMP) {
    /* function to add an instance of Candidate to the allMyElectorateMPs Array.
    Keeping it separate from the find candidate function since that would be useful at other times */
    this.allMyElectorateMPs.push(anMP)
  }

  addVotes (newVotes) {
    // function to increment this.totalVotes
    this.totalVotes += newVotes
  }

  getElectorateSeats () {
    // get function to return the number of electorate seats the party has won
    // used in election.allocateSeats()

    return this.allMyElectorateMPs.length
  }

  getName() {
    return this.name
  }
  
  addSeats (newSeats) {
    // takes the number of allocated seats from election.allocateSeats() and stores it.
    // More processing will be required here later
    this.totalSeats += newSeats
    let listSeats = this.totalSeats - this.allMyElectorateMPs.length // determine how many list seats are to be allocated, as per use cases

    // below is for debug purposes
    if (DEBUG) { // checks global toggle to see if debugging mode is active
      console.log(`${this.name} has been passed ${this.totalSeats} seats`)
    }

    let seatsAllocated = 0 // counter to track how many list seats have been allocated to candidates
    let partyListPostion = 0 // counter to track where in the party list the following loop is

    while (seatsAllocated < listSeats) {
      if (!this.allMyListCandidates[partyListPostion].myElectorate) { // checks if the mp at the current point in the list is an electorate MP
        this.allMyListMPs.push(this.allMyListCandidates[partyListPostion]) // adds the candidate to the array of list mp's
        this.allMyListCandidates[partyListPostion].updateListMPStatus(true) // informs the candidate that they're a list mp
        seatsAllocated += 1
      }
      partyListPostion += 1
      if (partyListPostion === this.allMyListCandidates.length) {
        // handle edge case where a party is allocated more party seats than they have mps
        console.log(`Warning: ${this.name} has more list seats than list mps`) // debug warning.
        return false
      }
    }

    // below is for debugging purposes
    if (DEBUG) { // checks global toggle to see if debugging mode is active
      console.log(`Seats allocated for ${this.name} \n`)
      console.log(this.allMyListMPs)
    }

    return this.allMyListMPs
  }

  toString () {
    return this.name
  }
}
