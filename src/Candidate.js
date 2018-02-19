/* Coded by Thomas Baines and Kelsey Vavasour
August 2017
All Rights Reserved
corrected to conform to standardJS 31/10/2017
*/

class Candidate { // eslint-disable-line no-unused-vars
// class to store information about a candidate

  constructor (newName, party, newListPosition = undefined) {
    /* newListPosition exists in this version
    because in this prototype, all candidates
    are on a party list
    5/9 Discovered not all candidates are on lists.
    Added default of N/A, but should consider other ways of handling this. */
    this.name = newName
    this.listPosition = newListPosition
    this.myParty = party
    this.myElectorate = undefined
    this.isListMP = false
  }

  updateMyElectorate (electorate) {
    /* function to update the My Electorate attribute, indicating if the candidate has won a seat or not
    called from Electorate.addWinner */
    this.myElectorate = electorate
  }

  updatePartyElectorateMPs () {
    /* Function to inform Party that it needs to update it's array. Called from Electorate.
    Function could possibly do with a better name, lol. */
    this.myParty.addElectorateMP(this)
  }

  updateListMPStatus (isListMP) {
    // setter function to tell candidate if they're a list mp or not
    this.isListMP = isListMP
  }

  isMP () {
    // returns a boolean, true if the candidate is an MP, list or electorate, and false otherwise
    return (this.myElectorate instanceof Electorate || this.isListMP) // checks if myElectorate is actually an electorate.
  }
  
  
  toString () {
    let returnStr = ''
    
    returnStr += this.name + View.DISPBREAK() // add Candidate name
    returnStr += this.myParty + View.DISPBREAK() // add candidate party
    if (this.listPosition) { // checks if the candidate is on the party list
      returnStr += this.listPosition
    }
    if (this.myElectorate instanceof Electorate) { // checks if the candidate is an electorate MP
      returnStr += View.ENDLINE() + View.TAB() + 'Electorate MP for: ' + this.myElectorate + View.ENDLINE()
    }
    else if (this.isListMP) { // checks if the candidate is a List MP
      returnStr += View.ENDLINE() + View.TAB() + 'List MP' + View.ENDLINE()
    }
    else { // if the candidate is not an MP
      returnStr += View.ENDLINE()
    }
    
    return returnStr
  }
}
