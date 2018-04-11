/* Coded by Thomas Baines and Kelsey Vavasour.
March 2018
all rights reserved */


class Tester {
// automated debugging toolkit for election data analysis program.

  constructor ( generator = false ) {
    this.linebreak = '------------------------------------------------'
    console.log(' ')
    console.log(this.linebreak)
    if (generator) { 
      // if the debug class is called passing an election year, it generates the data for that election and stores it.
      let anElection = new Election(generator)
      let callStr = 'Controller' + generator + '.setup(anElection)'
      this.myElection = eval(callStr) // eslint-disable-line no-eval
      console.log(`Debugging class initalized in generated mode. Election data generated for reference year ${generator}`)
      this.stored = true
    } else {
      this.stored = false
      console.log('Debugging class initalized in ad-hoc mode. No reference data genrated')
    }
    console.log(this.linebreak)
    console.log(' ')
  }
  
  storedCheck() {
    // checks the instance of debug to confirm there is a stored election.
    if (this.stored) {
      console.log(`Stored election found! Election year is ${this.myElection.year}.`)
      console.log(' ')
      return true
    } else {
      console.log('Warning: Search attempted when in ad-hoc mode.')
      console.log('Please re-initalize debug in generated mode')
      throw new UserException('noStoredElection')
    }
  }
  
  
  
  compareCandidate(aCandidate, anotherCandidate = false) {
    // compares two candidates. If the second parameter isn't found, it locates a matching candidate in the stored election.
    let compareAttributes = ['name', 'listPosition', 'myParty.name', 'myElectorate.name', 'isListMP'] // list of attributes to be compared to confirm if the candidates are identical or not
    console.log(this.linebreak)
    if (!anotherCandidate) {
      console.log(`CompareCandidate called on ${aCandidate.name}`)
      console.log('One candidate provided. Searching stored data for a match.')
      this.storedCheck()
      
      let aParty = aCandidate.myParty // stores the party of the provided candidate
      
      console.log(`Provided candidate belongs to ${aParty.name}`)
      console.log(`Searching stored election for ${aParty.name}`)
      
      let anotherParty = this.myElection.findParty(aParty.name) // attempts to locate a matching party in the stored election. Simple comparison only. a more in-depth comparison is done in compareParty()
      if (typeof(anotherParty) === 'undefined') {
        // matching party doesn't exist, outputs an error and then exits the function.
        console.log('Matching party not found. Candidates do not match. :(')
        return false
      } else {
        console.log('Matching party located! Yay!')
        console.log('   ')
        console.log(`Provided candidate named ${aCandidate.name}`)
        console.log('Searching party for match')
        anotherCandidate = anotherParty.findCandidate(aCandidate.name)
        if (typeof(anotherCandidate) === 'undefined') {
          console.log('Matching candidate does not exist in the party. Candidates do not match. :(')
          return false
        } else {
          console.log('Matching candidate located! Yay!')
          console.log('   ')
        }
        
      }
      
    } else {
      console.log(`CompareCandidate called on ${aCandidate.name} and ${anotherCandidate.name}`)
    }
    console.log('Comparing candidates')
    let checkList = [] // storage value to be checked at the end for discrepancies. 
    
    for (let aComparison of compareAttributes) {
      console.log(`Comparing attribute: ${aComparison}`)
      try { // edge case for some of the indexes being undefined and needing their attributes accessed.
        let aCandidateValue = eval(`aCandidate.${aComparison}`)
      }
      catch (err) { 
        if (err instanceof(TypeError)) { // make sure we're only catching typeerror's, other errors aren't handled by this code and are thrown further up.
          var aCandidateValue = undefined
        } else {
          throw err
        }
      }
      
      try{ // same function as the earlier block, but for anotherCandidate
        let anotherCandidateValue = eval(`anotherCandidate.${aComparison}`)
      }
      catch (err) {
        if (err instanceof(TypeError)) {
          var anotherCandidateValue = undefined
        } else {
          throw err
        }
      }
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
      console.log(this.linebreak)

      return true
    }
  }
  
  compareParty(aParty, anotherParty = false) {
    // compares two parties. If the second parameter isn't found, compares the party against a matching one in the stored election (if it exists)
    let compareAttributes = ['myElection.year', 'name', 'totalVotes', 'totalSeats', 'allMyCandidates.length', 'allMyListCandidates.length', 'allMyListMPs.length', 'allMyElectorateMPs.length']
    let candidateLists = ['allMyCandidates', 'allMyListCandidates', 'allMyListMPs', 'allMyElectorateMPs']  // list of list attributes to be compared on each party
    let listResultList = [] // yo, I heard you liked lists so I made you a list of lists so you can list while you list. 
    let finalCheckList = [] // final summary to determine if the parties are identical.
    // locate the second party from the stored election, if applicable.
    console.log(' ')
    console.log(' ')
    console.log(' ')
    console.log(this.linebreak + this.linebreak)
    if (!anotherParty) {
      console.log(`CompareParty called on ${aParty.name}`)
      console.log('One party provided. Searching stored data for a party with matching name.')
      this.storedCheck()
      
      var anotherParty = this.myElection.findParty(aParty.name)
      if (typeof(anotherParty) === 'undefined') {
        console.log('No matching party names found. :(')
        return false
      } else {
        console.log('Matching party name located, Yay!')
      }
    } else {
      console.log(`CompareParty called on ${aParty.name} and ${anotherParty.name}`)
    }
    console.log(' ')
    console.log('Comparing Parties')
    var attribCheckList = [] // storage array to confirm if any discrepancies were found
    
    for (let aComparison of compareAttributes) {
      console.log(`Comparing Attribute: ${aComparison}`)
      let aPartyValue = eval(`aParty.${aComparison}`)
      let anotherPartyValue = eval(`anotherParty.${aComparison}`)
      let comparison = aPartyValue === anotherPartyValue
      if (comparison) {
        console.log(`Attribute ${aComparison} matches. Yay!`)
        console.log(' ')
      } else {
        console.log(`Warnng! Discrepancy detected`)
        console.log(`${aParty.name} has value ${aPartyValue}`)
        console.log(`${anotherParty.name} has value ${anotherPartyValue}`)
        console.log(' ')
      }
      attribCheckList.push(comparison)
    }
    if (attribCheckList.includes(false)) {
      console.log('Party simple attributes do not match. :(') // if party simple attributes don't match, then there's no point checking the party lists, because the aren't the same party.
      console.log(this.linebreak)
    } else {
      console.log('Party simple attributes match! Yay!')
      console.log(this.linebreak)

      console.log('Beginning list comparisons.')
      for (let aList of candidateLists) { // works through the list of candidate lists, comparing each list to each other by comparing each candidate, aligned by index. 
        let thisListCheck = []
        console.log(`Comparing list ${aList}`)
        let aPartyList = eval(`aParty.${aList}`)
        let anotherPartyList = eval(`anotherParty.${aList}`)
        let sameLength = aPartyList.length === anotherPartyList.length // make sure the party lists are the same length
        if (sameLength) { // lists are the same length and can be compared
          // decided not to put any output here, because nobody would read it. Oh, Hi mark!
          for (let index in aPartyList) {
            thisListCheck.push(this.compareCandidate(aPartyList[index], anotherPartyList[index]))
          }
        } else { // if the lists are not the same length then they can't be the same list. 
          console.log(`Warning: list lengths are different. D:`) // sad face
          console.log(`List for ${aParty.name} has ${aPartyList.length} candidates`)
          console.log(`List for ${anotherParty.name} has ${anotherPartyList.length} candidates`)
          console.log('Skipping this list. :(') // working through a bad list would take too many processing cycles.
        }
        console.log(this.linebreak)
        if (thisListCheck.includes(false)) {
          console.log(`Warning: candidate mismatch detected in ${aList}. :(`)
          listResultList.push([aList, false])
        } else {
          console.log(`Congradulations, the ${aList} lists match! Yay!`)
          listResultList.push([aList, true])
        }
      }
    }
    console.log(this.linebreak)
    console.log(`Summary for comparisons between ${aParty.name} and ${anotherParty.name}`)
    if (attribCheckList.includes(false)) {
      console.log('Discrepancy detected between party attributes. :(')
      console.log('Party list comparisons were not performed due to attribute discrepancies.') // all attributes and no candidates makes party a dull boy
      finalCheckList.push(false) // possibly useful later on
    } else {
      console.log('All party attributes match. Yay!') // proceed with summary of lists.
    }
    console.log(this.linebreak)
    for (let item of listResultList) {
      console.log(`List type ${item[0]}:`)
      if (item[1]) {
        console.log('No discrepancies! Yay!')
        finalCheckList.push(true)
      } else {
        console.log('Discrepancy detected. :(')
        finalCheckList.push(false)
      }
      console.log(' ')
    }
    console.log('Final Verdict:')
    if (finalCheckList.includes(false)) {
      console.log('Parties to not match. D: D: D:') // something bad happened somewhere. Have fun scrolling. (or maybe just use a breakpoint)
      console.log(this.linebreak + this.linebreak)
      return false // for later
    } else {
      console.log('Parties Match! Great Success!') // you can now safely ignore this. Yay!
      console.log(this.linebreak + this.linebreak)
      return true
    }
  }
  
  
  
}

