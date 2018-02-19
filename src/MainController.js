/* Primary controller for multi-election storage and analysis
Coded by Thomas Baines and Kelsey Vavasour October 2017
corrected to conform to standardJS 31/10/2017
*/

class Controller { // eslint-disable-line no-unused-vars
  static setup () {
    var theCountry = new NewZealand() // eslint-disable-line no-undef
    var anElection
    anElection = theCountry.addElection(2014) // create and populate the 2014 election
    theCountry.populateElection(anElection.year)

    anElection = theCountry.addElection(2017) // create and populate the 2017 election
    theCountry.populateElection(anElection.year)

    // DEBUGGING PURPOSES ONLY.
    theCountry.compareElectorateMPParties(2014, 2017)
    theCountry.compareElectoratePartyVote(2014, 2017)

    // DEBUG CODE ENDS
    return theCountry
  }
}
