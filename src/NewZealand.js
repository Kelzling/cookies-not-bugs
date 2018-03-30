/* Coded by Thomas Baines and Kelsey Vavasour
August 2017
All Rights Reserved
corrected to conform to standardJS 9/11/2017 */

/* global Election Electorate */


const DEBUG = false // toggle to enable verbose debugging logs to console
const TESTER = true
const VERBOSE = true // toggle to enable verbose debugging logs to console


class NewZealand { // eslint-disable-line no-unused-vars
/* class to store information about multiple elections
and perform comparative analysis between them */

  constructor () {
    this.allMyElections = []
  }

  addElection (newYear) {
    /* call the constructor for Election, creating an instance with the provided year,
    and store it in the allMyElections array (Possibly should modify election constuctor to reference
    this class?) */
    let newElection = new Election(newYear)
    this.allMyElections.push(newElection)
    return newElection
  }

  populateElection (aYear) {
    let currentElection = this.allMyElections.find(anElection => anElection.year === aYear) // eslint-disable-line no-unused-vars
    let callStr = 'Controller' + aYear + '.setup(currentElection)'
    return eval(callStr) // eslint-disable-line no-eval
  }

  findElection (year) {
    // finds the entry of election corresponding to the provided year in this.allMyElections. Returns false if none found
    let anElection = this.allMyElections.find(election => election.year === year)
    if (anElection instanceof Election) {
      return anElection
    } else {
      throw new Error('Election not found')
    }
  }

  compareElectoratePartyVote (election1Year, election2Year) {
    /* will be used to compare the electoral party vote results between two elections */

    // locate the two elections being compared
    let election1 = this.findElection(election1Year)
    let election2 = this.findElection(election2Year)

    // retreive the list of electorates in the two elections and store them as a set
    let electorates = new Set([...election1.getElectorateNames(), ...election2.getElectorateNames()])

    // generate a map of 2 dimensional arrays containing the data
    let electorateVoteData = new Map()

    // populate the map
    for (let electorate of electorates) {
      let anElectorate1 = election1.findElectorate(electorate)
      let anElectorate2 = election2.findElectorate(electorate)
      let thisElectorateData = []
      if (!(anElectorate1 instanceof Electorate)) {
        thisElectorateData = [[0, 0, 0], anElectorate2.getVoteBreakdown()]
      } else if (!(anElectorate2 instanceof Electorate)) {
        thisElectorateData = [anElectorate1.getVoteBreakdown(), [0, 0, 0]]
      } else {
        thisElectorateData = [anElectorate1.getVoteBreakdown(), anElectorate2.getVoteBreakdown()]
      }
      electorateVoteData.set(electorate, thisElectorateData)
    }

    // generate comparison data points.
    for (let anElectorate of electorateVoteData.keys()) { // iterate through the map
      let thisElectorate = electorateVoteData.get(anElectorate) // get the current electorate's stored data
      let redDifference = thisElectorate[1][0] - thisElectorate[0][0] // calculate the absolute difference for labor votes
      let blueDifference = thisElectorate[1][1] - thisElectorate[0][1] // calculate the absolute difference for National votes
      let blackDifference = thisElectorate[1][2] - thisElectorate[0][2] // calculate the absolute different for "other" votes
      let differentials = [redDifference, blueDifference, blackDifference] // store the absolute differences in an array
      thisElectorate.push(differentials) // store the array as index 2 in the currently worked electorate

      electorateVoteData.set(anElectorate, thisElectorate) // store the newly processed data in the map.
    }

    // DEBUG PURPOSES ONLY
    if (DEBUG) { // checks global toggle to see if debugging mode is active
      console.log(electorateVoteData)
    }
    // DEBUG CODE ENDS

    return electorateVoteData
  }

  compareElectorateMPParties (election1Year, election2Year) {
    /* Will be used to compare the parties of electorate MP's between two elections */
    let election1 = this.findElection(election1Year) // finds the instance of elections from the provided years
    let election2 = this.findElection(election2Year)
    let unchangedElectorates = [] // empty list to store electorates that didn't changed
    let changedElectorates = [] // empty list to store electorates that have changed

    let e1Map = election1.getElectorateMap() // generates map of key value pairs where the keys are electorate names and the values are the party that won them
    let e2Map = election2.getElectorateMap() // as above, but for election 2
    let electorates = new Set([...e1Map.keys(), ...e2Map.keys()]) // generates a set of all electorate names (can handle if new electorates are added in either election)

    for (let anElectorate of electorates) { // iterate throught the list of electorates
      try {
        if (e1Map.get(anElectorate).name === e2Map.get(anElectorate).name) { // if unchanged
          unchangedElectorates.push([anElectorate, e2Map.get(anElectorate)])
        } else { // else assumes the electorate is changed
          changedElectorates.push([anElectorate, e1Map.get(anElectorate), e2Map.get(anElectorate)])
        }
      } catch (err) { // this handles bad data, if the electorate doesn't exist in one of the elections
        if (err instanceof TypeError) {
          if (e1Map.get(anElectorate)) {
            changedElectorates.push([anElectorate, e1Map.get(anElectorate), null])
          } else {
            changedElectorates.push([anElectorate, null, e2Map.get(anElectorate)])
          }
        } else {
          throw err // throws errors raised by anything other than an electorate not existing further up the stack
        }
      }
    }

  // for debugging
    if (DEBUG) { // checks global toggle to see if debugging mode is active
      console.log('Unchanged electorates:')
      console.log(unchangedElectorates)
      console.log('Changed Electorates')
      console.log(changedElectorates)
    }

    return [unchangedElectorates, changedElectorates]
  }
}