/* Primary controller for multi-election storage and analysis
Coded by Thomas Baines and Kelsey Vavasour October 2017
corrected to conform to standardJS 9/11/2017
*/

/* global DEBUG */

class Controller { // eslint-disable-line no-unused-vars
  static setup () {
    var theCountry = new NewZealand() // eslint-disable-line no-undef
    var anElection
    anElection = theCountry.addElection(2014) // create and populate the 2014 election
    theCountry.populateElection(anElection.year)

    anElection = theCountry.addElection(2017) // create and populate the 2017 election
    theCountry.populateElection(anElection.year)

    if (TESTER) {
      // DEBUGGING PURPOSES ONLY.
      
      // current working code, is subject to regular and random changes.
      var test = new Tester(2017)
      let debugElection = theCountry.findElection(2017)
      let debugParty = debugElection.findParty('Labour Party')
      test.compareParty(debugParty)
      // DEBUG CODE ENDS
    }

    return theCountry
  }
}
