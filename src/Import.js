/* Coded by Thomas Baines and Kelsey Vavasour
March 2018
All Rights Reserved */

class Import {
  
  static populateParties(event) {
    // function to take csv data and output it as arrays that can be fed to Election.addParty and Party.addListCandidates
    console.log('file has loaded')
    
    // Split the initial file into an array where each element is the data for one party. The RegEx uses a Look Ahead in order to only match a new line where the next line starts with a Letter (all candidates start with numbers) without .split consuming the first letter of the party name.
    let splitDelimiter = new RegExp('\n(?=[a-z])', 'i')
    let splitParties = event.target.result.split(splitDelimiter)
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
        let splitData = aParty.split(/\n/)
        if (VERBOSE) {
          console.log(splitData)
        }
        // The last line of the .CSV file is blank, so checking to see if the last element is blank. If so, remove it.
        if (splitData[splitData.length - 1] == '') {
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
    
    // Sort allMyParties array by Party.name at the end of the function so they will still be in the correct order when loading parties from two separate files (successful/unsuccessful)
  }
  
  static fileChangeHandler (event) {
    // initial change event handler once file has been selected. Creates the FileReader object and directs it to the correct function
    let reader = new FileReader()
    reader.onload = Import.populateParties
    // this will point to a function that determines what type of data we are entering once we are working with more than one set of data
    
    let theFile = event.target.files[0]
    
    // Had to check if the file was a .CSV before the program finishes reading it as text, otherwise we can't access it's .name property.
    try {
      if (!theFile.name.includes('.csv')) { // something about this line isn't quite working properly
        throw new Error("Wrong File Type")
      }
    } catch (err) {
      if (err.message.includes("Wrong File")) {
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
