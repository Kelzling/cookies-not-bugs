/* Coded by Thomas Baines and Kelsey Vavasour
March 2018
All Rights Reserved
corrected to conform to standardJS 5/04/2018 */

/* global VERBOSE, alert, FileReader, myRender */

class Import { // eslint-disable-line no-unused-vars
  constructor (anElection) {
    this.theElection = anElection
  }

  stripQuotes (aString) {
    // function to remove all quotes from a string
    let allQuotes = new RegExp(/"/g) // matches all instance of "
    let quotelessString = aString.replace(allQuotes, '')
    return quotelessString
  }

  populateParties (theFile) {
    // function to take csv data and output it as arrays that can be fed to Election.addParty and Party.addListCandidates
    console.log('file has loaded')

    // Split the initial file into an array where each element is the data for one party. The RegEx uses a Look Ahead in order to only match a new line where the next line starts with a Letter (all candidates start with numbers) without .split consuming the first letter of the party name.
    let splitDelimiter = new RegExp('\r?\n(?=[a-z])', 'i') // eslint-disable-line no-control-regex
    let splitParties = theFile.split(splitDelimiter)
    if (VERBOSE) {
      console.log(splitParties)
    }
    // check to see if the file starts with the correct line of text
    let validFileTest = new RegExp('Party Lists.*Registered Parties')
    if (VERBOSE) {
      console.log(validFileTest)
      console.log(validFileTest.test(splitParties[0]))
    }
    let theHeader = splitParties.shift()
    if (validFileTest.test(theHeader)) { //   (splitParties[0].includes(/Party Lists.*Registered Parties/))  old version
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
        let newParty = this.theElection.addParty(splitData.shift())
        // Create an array of Candidate names after stripping the excess data from either side
        let allNewCandidates = []
        for (let aCandidate of splitData) {
          // if there is a comma at the end, remove it
          if (aCandidate.endsWith(',')) {
            aCandidate = aCandidate.slice(0, -1)
          }
          // split candidate data on comma and push the name into the array
          let theCandidate = aCandidate.split(/,(?=[^\s])/)
          allNewCandidates.push(theCandidate[1])
        }
        // add all the candidates to our party!
        newParty.addListCandidates(...allNewCandidates)
      }
      // Ensure the array of Party objects is still sorted alphabetically for later data storage
      this.theElection.sortParties()
      // Inform the Election that the function has completed
      if (theHeader.includes('Unsuccessful')) {
        this.theElection.updateProgress('Unsuccessful Parties', true)
      } else {
        this.theElection.updateProgress('Successful Parties', true)
      }
    } else {
      alert('Data not compatible, please choose another file.')
    }
  }

  populateElectorateWinners (theFile) {
    let fileLines = theFile.split(/\n/)
    let validFileTest = new RegExp(/^Winning Electorate Candidate Votes/)
    if (validFileTest.test(fileLines[0])) {
      fileLines = fileLines.slice(2, -1) // Removing the first two lines as they contain header data, not data to be imported
      for (let aLine of fileLines) {
        // split each line and save the data we require for importing purposes
        let lineData = aLine.split(/,(?=[^\s])/)
        let electorateName = lineData[0]
        let candidateName = lineData[1]/* .substring(1, lineData[1].lastIndexOf('"')) // Trimming the quotation marks from around the name  - NO LONGER NECESSARY AS ALL QUOTES ARE NOW TRIMMED FROM THE FILE AT START OF PROCESSING */
        let partyName = lineData[2]

        let anElectorate = this.theElection.findElectorate(electorateName)
        if (!anElectorate) {
          anElectorate = this.theElection.addElectorate(electorateName)
        }
        // if Party is missing, data import will fail, so throw a tantrum
        if (this.theElection.findParty(partyName)) {
          anElectorate.addWinner(candidateName, partyName)
        } else {
          alert('Necessary Party Data Missing, Upload Failed')
          return false
          // in future - call Import Failed method in Render?
        }
      }
      // Inform the Election that the function has completed
      this.theElection.updateProgress('Electorate Winners', true)
    } else {
      alert('Data not compatible, please choose another file.')
    }
  }

  populateVotesByElectorate (theFile) {
    // takes data from .csv file and processes it to be passed to Electorate and Party objects
    let validFileTest = new RegExp(/^Votes for Registered Parties/)
    let lineData = theFile.split(/\r?\n/)
    let theHeader = lineData.shift()
    if (validFileTest.test(theHeader)) {
      // create an array of all the parties that exist in the vote data to compare with the targeted Election
      let validPartyString = lineData.shift()
      let validPartyList = validPartyString.split(',')
      // dealing with a couple of slightly different data formats - some years contain Total Party Votes Counted, some don't
      let tpvcExists = false
      let extraHeaders = 0
      if (validPartyList[validPartyList.length - 1].includes('Votes Counted')) {
        tpvcExists = true
        extraHeaders = 3
      } else {
        tpvcExists = false
        extraHeaders = 2
      }
      validPartyList = validPartyList.slice(1, validPartyList.length - extraHeaders) // the first element just says 'Electorate' (or is blank) and the last 2 or 3 are non-party headers
      // Check that list of parties in the provided data matches the list of parties in the Election.
      if (this.theElection.comparePartyList(validPartyList)) {
        // first remove excess data from lineData array, then process the data
        let genElecTotalsIndex = lineData.findIndex(line => line.includes('General Electorate Totals'))
        lineData.splice(-3, 3) // Remove the last three lines - Maori Electorate Totals, Overall Totals, and a blank line.
        lineData.splice(genElecTotalsIndex, 1) // Remove the General Electorate Totals.
        if (lineData[0].includes('Electorate')) {
          // sometimes there's an extra header line, but not always.
          lineData.shift()
        }
        for (let aLine of lineData) {
          let voteData = aLine.split(',')
          // remove total number of votes, and total number of valid votes per electorate from the array
          if (tpvcExists) {
            voteData.pop()
          }
          voteData.splice(-2, 1)
          // find or make an electorate from the name at the start of the line
          let electorateName = voteData.shift()
          let anElectorate = this.theElection.findElectorate(electorateName)
          if (!anElectorate) {
            anElectorate = this.theElection.addElectorate(electorateName)
          }
          // convert all of the vote numbers from strings to ints so they can be added together, then pass to add votes function
          let voteDataInts = []
          for (let item of voteData) {
            voteDataInts.push(parseInt(item, 10))
          }
          anElectorate.addPartyVotes(...voteDataInts)
          if (VERBOSE) {
            console.log(this.theElection.totalVotes)
          }
        }
        // Inform the Election that the function has completed
        this.theElection.updateProgress('Party Votes by Electorate', true)
      } else {
        // Inform the user of an error if comparison function returned false. Note: Error details will be shown with VERBOSE logging turned on.
        alert('Party Data did not match Election Party List, data import unsuccessful')
      }
    }
  }

  selectInputFormat (theFile) {
    // Function to check header of the uploaded file and run the correct import function
    let validHeaders = ['Party Lists of Successful Registered Parties', 'Party Lists of Unsuccessful Registered Parties', 'Votes for Registered Parties by Electorate', 'Winning Electorate Candidate Votes']
    /* let theFile = event.target.result // Storing the file that has been read as text in a variable for further usage */ // Deprecated
    let theHeader = theFile.substring(0, theFile.search(/\r?\n/)) // Returns the first header line of the file, from index 0 to the index of the first newline character. The regex matches both just a newline character and the windows carriage return + newline character combo.
    if (validHeaders.includes(theHeader)) {
      switch (theHeader) {
        case validHeaders[0]:
          // Import Successful Parties and their Party Lists
          this.populateParties(theFile)
          break
        case validHeaders[1]:
          // Import Unsuccessful Parties and their Party Lists
          this.populateParties(theFile)
          break
        case validHeaders[2]:
          // import Electorates and votes function
          this.populateVotesByElectorate(theFile)
          break
        case validHeaders[3]:
          // import Electorates and Winning Candidates function
          this.populateElectorateWinners(theFile)
          break
      }
    } else {
      alert('Data not recognised. Please upload a valid file.') // throwing tantrum
    }
  }

  fileHandler (event) { // this probably needs renaming
    let theFile = event.currentTarget.result
    // strip quotes from the file
    let quotelessFile = this.stripQuotes(theFile)
    // pass file to selectImportFormat
    this.selectInputFormat(quotelessFile)
    // upon control return, check if election is fully populated yet (function call to Election)
    if (this.theElection.checkProgress()) {
      this.theElection.allocateSeats()
      myRender.importComplete('All', this.theElection.year)
      console.log('Call to Render')
    } else if (this.theElection.checkProgress('Parties')) {
      if (this.theElection.checkProgress('Electorate Winners') || this.theElection.checkProgress('Party Votes by Electorate')) {
        console.log("Don't call to Render")
      } else {
        myRender.importComplete('Parties', this.theElection.year)
        console.log('Call to Render')
      }
    }
    console.log(this.theElection.checkProgress())
    // above call will be used to interface with Render, so console logging to confirm functionality for now.
    // if it is, call a method in Render that tells it the import is finished
    // integration with Render class not yet done
  }

  fileUploadHandler (filesList) { /* to be changed to: filesList, theElection */
    // function to handle the uploading of multiple files once they have been selected and ensuring they are imported in the correct order
    // Store the files in a variable
    // let filesList = event.target.files
    if (filesList.length !== 2) {
    // check the amount of files because uploading them all at once causes problems
      alert('Please only upload two files at once.')
    } else {
      // keep track of whether some data had already been uploaded or not
      // iterate over the array of files
      for (let aFile of filesList) {
        // Set up FileReader
        let reader = new FileReader()
        // had to bind this, otherwise this was referring to the fileReader object, not the Import object.
        reader.onload = this.fileHandler.bind(this)
        // Validate File Type
        let fileValidator = new RegExp(/.csv$/i)
        if (!fileValidator.test(aFile.name)) {
          alert('Wrong File Type! Please Upload a .CSV file instead.')
          return false // is this necessary? I don't remember why I put it here tbh
        }
        // Read file in as Text
        reader.readAsText(aFile)
      }
    }
  }

  // Old code for handling of a single file, deprecated

  /* static fileChangeHandler (event) {
    // initial change event handler once file has been selected. Creates the FileReader object and directs it to the correct function
    let reader = new FileReader()
    reader.onload = Import.selectInputFormat
    // this will point to a function that determines what type of data we are entering once we are working with more than one set of data

    let theFile = event.target.files[0]

    // Had to check if the file was a .CSV before the program finishes reading it as text, otherwise we can't access it's .name property.
    if (!theFile.name.includes('.csv')) {
      alert('Wrong File Type! Please Upload a .CSV file instead.')
      return false // is this necessary? I don't remember why I put it here tbh
    }
    // we will only be allowing one file to be selected at this stage
    reader.readAsText(theFile)
  } */
}
