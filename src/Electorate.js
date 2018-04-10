/* Coded by Thomas Baines and Kelsey Vavasour
August 2017
All Rights Reserved
corrected to conform to standardJS 30/03/2018
*/

/* global VERBOSE */

class Electorate { // eslint-disable-line no-unused-vars
// Class to store information about an Electorate.
  constructor (newName, election) {
    this.name = newName
    this.myElection = election
    this.allMyPartyVotes = new Map()
    this.myMP = {}
  }

  addWinner (candidateName, partyName) {
    // function to add the correct instance of the Candidate class to the myMP attributes
    this.myMP = this.myElection.findCandidate(candidateName, partyName)
    if (!this.myMP) {   // Not all electorate MPs are on party lists. If not, make a new instance of candidate.
      this.myMP = this.myElection.addNonListMP(candidateName, partyName)
    }
    // calling function within myElection object to find the candidate then storing it in myMP?
    this.myMP.updateMyElectorate(this)
    // calling function in Candidate class to update it's myElectorate attribute
    this.myMP.updatePartyElectorateMPs()
    // calling function in Candidate class to update it's Parties allMyElectorateMPs array
  }

  /* addPartyVotes (...allNewPartyVotes) {
    // function to add party votes to an electorate
    let allParties = this.myElection.allMyParties
    this.myElection.addVotes(allNewPartyVotes.pop())
    for (let i = 0; i < allParties.length; i += 1) {
      let currentParty = allParties[i]
      let currentPartyVotes = allNewPartyVotes[i]
      this.allMyPartyVotes[currentParty.name] = currentPartyVotes
      this.myElection.addVotes(currentPartyVotes)
      currentParty.addVotes(currentPartyVotes)
    }
  } */

  addPartyVotes (...allNewPartyVotes) {
    // more elegant version of add party votes. Stores the party vote values for the electorate
    // identical function but the data structure is now a map
    let allParties = this.myElection.allMyParties
    this.allMyPartyVotes.set('Informal Party Votes', allNewPartyVotes.pop())
    this.myElection.addVotes(this.allMyPartyVotes.get('Informal Party Votes'))
    for (let index in allNewPartyVotes) {
      let currentParty = allParties[index]
      let currentPartyVotes = allNewPartyVotes[index]
      this.allMyPartyVotes.set(currentParty.name, currentPartyVotes)
      this.myElection.addVotes(currentPartyVotes)
      currentParty.addVotes(currentPartyVotes)
      if (VERBOSE) {
        console.log(`Adding ${currentPartyVotes} votes to ${currentParty}, giving a new total of ${currentParty.totalVotes}`)
      }
    }
    return this.allMyPartyVotes
  }

  getMyParty () {
    // function to return the instance of party associated with the electorate mp of the electorate
    return this.myMP.myParty
  }

  getVoteBreakdown () {
    let voteBreakdown = [] // preparing empty array to return

    voteBreakdown[0] = this.allMyPartyVotes.get('LABOUR PARTY') // store the number of red votes
    voteBreakdown[1] = this.allMyPartyVotes.get('NATIONAL PARTY') // store the number of blue votes

    let allVotes = new Array(...this.allMyPartyVotes.values()) // list of all vote values
    let totalVotes = allVotes.reduce((sum, value) => sum + value, 0) // find the total values cast in this electorate
    totalVotes -= (voteBreakdown[0] + voteBreakdown[1])
    voteBreakdown[2] = totalVotes

    return voteBreakdown
  }

  toString () {
    return this.name
  }
}
