/* Coded by Thomas Baines and Kelsey Vavasour
March 2018
All Rights Reserved
corrected to conform to standardJS 9/03/2018 */

/* global VERBOSE, theElection, alert, FileReader */

class Import { // eslint-disable-line no-unused-vars
  static populateParties (aFile) {
    // function to take csv data and output it as arrays that can be fed to Election.addParty and Party.addListCandidates
    console.log('file has loaded')

    // Split the initial file into an array where each element is the data for one party. The RegEx uses a Look Ahead in order to only match a new line where the next line starts with a Letter (all candidates start with numbers) without .split consuming the first letter of the party name.
    let splitDelimiter = new RegExp('\n(?=[a-z])', 'i') // eslint-disable-line no-control-regex
    let splitParties = aFile.split(splitDelimiter)
    if (VERBOSE) {
      console.log(splitParties)
    }
    // check to see if the file starts with the correct line of text
    let validFileTest = new RegExp('Party Lists.*Registered Parties')
    if (VERBOSE) {
      console.log(validFileTest)
      console.log(validFileTest.test(splitParties[0]))
    }
    if (validFileTest.test(splitParties[0])) { //   (splitParties[0].includes(/Party Lists.*Registered Parties/))  old version
      // remove first line
      splitParties.shift()
      for (let aParty of splitParties) {
        // Split each party into its own array of individual lines
        let splitData = aParty.split(/\r?\n/) // Need to consume the carriage return as well as the newline character if it exists, as otherwise the name will not match 
        if (VERBOSE) {
          console.log(splitData)
        }
        // The last line of the .CSV file is blank, so checking to see if the last element is blank. If so, remove it.
        if (splitData[splitData.length - 1] === '') {
          splitData.pop()
        }
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
      // Ensure the array of Party objects is still sorted alphabetically for later data storage
      theElection.sortParties()
    } else {
      alert('Data not compatible, please choose another file.')
    }
}

  static populateElectorateWinners (aFile) {
    let fileLines = aFile.split(/\n/)
    let validFileTest = new RegExp(/^Winning Electorate Candidate Votes/)
    if (validFileTest.test(fileLines[0])) {
      fileLines = fileLines.slice(2, -1) // Removing the first two lines as they contain header data, not data to be imported
      for (let aLine of fileLines) {
        // split each line and save the data we require for importing purposes
      let lineData = aLine.split(/,(?=[^\s])/)
        let electorateName = lineData[0]
        let candidateName = lineData[1].substring(1, lineData[1].lastIndexOf('"')) // Trimming the quotation marks from around the name
        let partyName = lineData[2]
        
        let anElectorate = theElection.findElectorate(electorateName)
        if (!anElectorate) {
          anElectorate = theElection.addElectorate(electorateName)
        }
        anElectorate.addWinner(candidateName, partyName)
      }
    }
  }

  static selectInputFormat (event) {
    // Function to check header of the uploaded file and run the correct import function
    let validHeaders = ['Party Lists of Successful Registered Parties', 'Party Lists of Unsuccessful Registered Parties', 'Votes for Registered Parties by Electorate', 'Winning Electorate Candidate Votes']
    let theFile = event.target.result; // Storing the file that has been read as text in a variable for further usage
  let theHeader = theFile.substring(0, theFile.search(/\r?\n/)) // Returns the first header line of the file, from index 0 to the index of the first newline character. The regex matches both just a newline character and the windows carriage return + newline character combo.
    if (validHeaders.includes(theHeader)) {
      switch (theHeader) {
        case validHeaders[0]:
          // Import Successful Parties and their Party Lists
          Import.populateParties(theFile)
          break
        case validHeaders[1]:
          // Import Unsuccessful Parties and their Party Lists
          Import.populateParties(theFile)
          break
        case validHeaders[2]:
          // import Electorates and votes function
          break
        case validHeaders[3]:
          // import Electorates and Winning Candidates function
          Import.populateElectorateWinners(theFile)
          break
      }
    } else {
      alert('Data not recognised. Please upload a valid file.') // throwing tantrum
    }
  }

  static fileChangeHandler (event) {
    // initial change event handler once file has been selected. Creates the FileReader object and directs it to the correct function
    let reader = new FileReader()
    reader.onload = Import.selectInputFormat;
    // this will point to a function that determines what type of data we are entering once we are working with more than one set of data

    let theFile = event.target.files[0]

    // Had to check if the file was a .CSV before the program finishes reading it as text, otherwise we can't access it's .name property.
    try {
      if (!theFile.name.includes('.csv')) {
        throw new Error('Wrong File Type')
      }
    } catch (err) {
      if (err.message.includes('Wrong File')) {
        alert('Wrong File Type! Please Upload a .CSV file instead.')
        return false
      } else {
        throw err
      }
    }
    // we will only be allowing one file to be selected at this stage
    reader.readAsText(theFile)
  }
}

// class FileError extends Error {} // Do something with this at some point to throw slightly more useful errors
