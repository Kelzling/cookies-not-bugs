class Import {
  
  static populateParties(event) {
    // function to take csv data and output it as arrays that can be fed to Election.addParty and Party.addListCandidates
    console.log('file has loaded')
    
    // Add some form of 'is this a csv file' check
    
    // Split the initial file into an array where each element is the data for one party. The RegEx uses a Look Ahead in order to only match a new line where the next line starts with a Letter (all candidates start with numbers) without .split consuming the first letter of the party name.
    let splitDelimiter = new RegExp('\n(?=[a-z])', 'i')
    let splitParties = event.target.result.split(splitDelimiter)
    console.log(splitParties)
    
    // check to see if the file starts with the correct line of text
    if (splitParties[0].includes('Party Lists of Successful Registered Parties')) {
      // remove first line
      splitParties.shift()
      for (let aParty of splitParties) {
        // Split each party into its own array of individual lines
        let splitData = aParty.split(/\n/)
        console.log(splitData)
        // Make a new instance of Party using the name
        let newParty = theElection.addParty(splitData.shift())
        // Create an array of Candidate names after stripping the excess data from either side
        let allNewCandidates = []
        for (let aCandidate of splitData) {
          let theCandidate = aCandidate.split('"')
          allNewCandidates.push(theCandidate[1])
        }
        // add all the candidates to our party!
        newParty.addListCandidates(...allNewCandidates)
      }
    } // else throw a 'not the right file' error which will be caught somewhere to return a 'choose another file alert'
  }
  
  static fileChangeHandler (event) {
    // initial change event handler once file has been selected. Creates the FileReader object and directs it to the correct function
    let reader = new FileReader()
    reader.onload = Import.populateParties
    // this will point to a function that determines what type of data we are entering once we are working with more than one set of data
    
    let theFile = event.target.files[0]
    // we will only be allowing one file to be selected at this stage
    reader.readAsText(theFile)
  }
}