/* Coded by Thomas Baines and Kelsey Vavasour.
March 2018
all rights reserved */

/* updated to conform to standardJS 14/03/2018 */

/* global Election */

class Tester { // eslint-disable-line no-unused-vars
// automated debugging toolkit for election data analysis program.

  constructor (generator = false) {
    if (generator) {
      // if the debug class is called passing an election year, it generates the data for that election and stores it.
      let anElection = new Election(generator) // eslint-disable-line no-unused-vars, no-undef
      let callStr = 'Controller' + generator + '.setup(anElection)'
      this.myElection = eval(callStr) // eslint-disable-line no-eval
      console.log(`Debugging class initalized in generated mode. Election data generated for reference year ${generator}`)
      console.log(' ')
      this.stored = true
    } else {
      this.stored = false
      console.log('Debugging class initalized in ad-hoc mode. No reference data genrated')
    }
  }

  storedCheck () {
    // checks the instance of debug to confirm there is a stored election.
    if (this.stored) {
      console.log(`Stored election found! Election year is ${this.myElection.year}.`)
      return true
    } else {
      console.log('Warning: Search attempted when in ad-hoc mode.')
      console.log('Please re-initalize debug in generated mode')
      throw new ReferenceError('No stored election')
    }
  }

  compareCandidate (aCandidate, anotherCandidate = false) {
    // compares two candidates. If the second parameter isn't found, it locates a matching candidate in the stored election.
    let compareAttributes = ['name', 'listPosition', 'myParty.name', 'myElectorate', 'isListMP'] // list of attributes to be compared to confirm if the candidates are identical or not
    console.log('------------------------------------------------')
    console.log('CompareCandidate called.')
    console.log(' ')
    if (!anotherCandidate) {
      console.log('One candidate provided. Searching')
      this.storedCheck()

      let aParty = aCandidate.myParty // stores the party of the provided candidate

      console.log(`Provided candidate belongs to ${aParty.name}`)
      console.log(`Searching stored election for ${aParty.name}`)

      let anotherParty = this.myElection.findParty(aParty.name) // attempts to locate a matching party in the stored election. Simple comparsion only. a more indepth comparsion is done in compareParty()
      if (typeof (anotherParty) === 'undefined') {
        // matching party doesn't exist, outputs an error and then exits the function.
        console.log('Matching party not found. Candidates do not match. :(')
        return false
      } else {
        console.log('Matching party located! Yay!')
        console.log('   ')
        console.log(`Provided candidate named ${aCandidate.name}`)
        console.log('Searching party for match')
        anotherCandidate = anotherParty.findCandidate(aCandidate.name)
        if (typeof (anotherCandidate) === 'undefined') {
          console.log('Matching candidate does not exist in the party. Candidates do not match. :(')
          return false
        } else {
          console.log('Matching candidate located! Yay!')
          console.log('   ')
        }
      }
    }
    console.log('Comparing candidates')
    let checkList = [] // storage value to be checked at the end for discrepancies.

    for (let aComparison of compareAttributes) {
      console.log(`Comparing attribute: ${aComparison}`)
      let aCandidateValue = eval(`aCandidate.${aComparison}`) // eslint-disable-line no-eval
      let anotherCandidateValue = eval(`anotherCandidate.${aComparison}`) // eslint-disable-line no-eval
      let comparison = aCandidateValue === anotherCandidateValue
      if (comparison) {
        console.log(`Attribute ${aComparison} matches. Yay!`)
        console.log(' ')
      } else {
        console.log(`Warnng! Discrepancy detected`)
        console.log(`${aCandidate.name} has value ${aCandidateValue}`)
        console.log(`${anotherCandidate.name} has value ${anotherCandidateValue}`)
        console.log(' ')
      }
      checkList.push(comparison)
    }
    if (checkList.includes(false)) {
      console.log('Candidates do not match. :(\n')
      return false
    } else {
      console.log('Candidates match! Congradulations!')
      console.log('------------------------------------------------')

      return true
    }
  }
}
