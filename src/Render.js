/* built by Thomas Baines and Kelsey Vavasour
April 2018
All Rights Reserved
corrected to conform to standardJS 11/04/2018
*/

/* global NewZealand View */

class Render { // eslint-disable-line no-unused-vars
  constructor () {
    this.myNewZealand = new NewZealand()
    this.electionOptions = [2005, 2011, 2014, 2017]
    this.testMode = false
    this.importing = false
    this.importElection = undefined
    this.importColumn = null
    this.column1Year = undefined
    this.column2Year = undefined
    // document.body.innerHTML = '' // disabled for testing
  }

  find (elementID) {
    let theElement = document.getElementById(elementID)
    if (theElement) {
      return theElement
    } else {
      throw new ReferenceError('Element not found')
    }
  }

  clearMultiplebyID (...idList) {
    for (let item of idList) {
      this.clearByID(item)
    }
  }

  clearByID (elementId) {
    let theElement = this.find(elementId)
    theElement.innerHTML = ''
  }

  clearByClass (className) {
    let elementList = document.getElementsByClassName(className)
    if (elementList.length > 0) {
      for (let item of elementList) {
        item.innerHTML = ''
      }
    } else {
      throw new ReferenceError('No Elements Found')
    }
  }

  getParent (parentID) {
    if (parentID === 'body') {
      return document.body
    } else {
      return this.find(parentID)
    }
  }

  makeBttn (myParent, value, id, binding = false, className = undefined, disable = false) {
    let input = document.createElement('input')
    let att = document.createAttribute('type')
    let name = document.createAttribute('name')
    let word = document.createAttribute('value')
    let myId = document.createAttribute('id')
    att.value = 'button'
    name.value = 'button'
    word.value = value
    myId.value = id

    if (binding) {
      let onClick = document.createAttribute('onclick')
      onClick.value = binding
      input.setAttributeNode(onClick)
    }

    input.setAttributeNode(att)
    input.setAttributeNode(word)
    input.setAttributeNode(myId)
    input.setAttribute('class', className)
    if (disable) {
      input.setAttribute('disabled', 'true')
    }

    let theParent = this.getParent(myParent)
    theParent.appendChild(input)
  }

  makeSelect (myParent, id, values, className = undefined) {
    let sel = document.createElement('select')
    sel.setAttribute('id', id)
    sel.setAttribute('class', className)
    let theParent = this.getParent(myParent)

    for (let o of values) {
      let choice = document.createElement('option')
      choice.setAttribute('value', o)

      let displayText = document.createTextNode(o)
      choice.appendChild(displayText)
      sel.appendChild(choice)
    }

    theParent.appendChild(sel)
  }

  makeDiv (myParent, id, className = undefined) {
    let newDiv = document.createElement('div')
    newDiv.setAttribute('id', id)
    newDiv.setAttribute('class', className)
    let theParent = this.getParent(myParent)
    theParent.appendChild(newDiv)
  }

  makeHeader (myParent, headerType, value, id, className = undefined) {
    // this code is hacky and inelegant but case statements throw errors, and trying to make
    // the code smart enought to parse the value its given into h1, h2 and h3
    // resulted in a hail of errors I'm not smart enough to understand or resolve

    if (headerType == 1) { // eslint-disable-line eqeqeq
      var newHeader = document.createElement('h1')
    } else if (headerType == 2) { // eslint-disable-line eqeqeq
      var newHeader = document.createElement('h2') // eslint-disable-line no-redeclare
    } else if (headerType == 3) { // eslint-disable-line eqeqeq
      var newHeader = document.createElement('h3') // eslint-disable-line no-redeclare
    } else {
      throw new RangeError('Only inputs of h1, h2, and h3 are supported') // other types of headers aren't used in this program
    }

    let theValue = document.createTextNode(value)
    newHeader.appendChild(theValue)
    newHeader.setAttribute('id', id)
    newHeader.setAttribute('class', className)
    let theParent = this.getParent(myParent)
    theParent.appendChild(newHeader)
  }

  makeParagraph (myParent, id, className = undefined) {
    let newParagraph = document.createElement('p')
    let theParent = this.getParent(myParent)
    newParagraph.setAttribute('id', id)
    newParagraph.setAttribute('class', className)
    theParent.appendChild(newParagraph)
  }

  writeToParagraph (id, writeStr) { // note, this does not clear the existing <p> tag
    let theParagraph = this.find(id)
    theParagraph.innerHTML += writeStr
  }

  makeFileInput (myParent, id, className = undefined) {
    let theInput = document.createElement('input')
    theInput.setAttribute('type', 'file')
    theInput.setAttribute('id', id)
    theInput.setAttribute('class', className)
    theInput.setAttribute('multiple', 'multiple')
    let theParent = this.getParent(myParent)
    theParent.appendChild(theInput)
  }

  makeLabel (myParent, id, newText, className = undefined) {
    let theLabel = document.createElement('label')
    let labelText = document.createTextNode(newText)
    theLabel.appendChild(labelText)
    theLabel.setAttribute('id', id)
    theLabel.setAttribute('class', className)
    let theParent = this.getParent(myParent)
    theParent.appendChild(theLabel)
  }

  makeBreak (myParent) {
    let theParent = this.getParent(myParent)
    let newBreak = document.createElement('br')
    theParent.appendChild(newBreak)
  }

  insertNonBreakingSpace (myParent) {
    let theParent = this.getParent(myParent)
    theParent.innerHTML += '&nbsp'
  }

  bindOnChange (id, callTo) { // this may or may not work - uncomfirmed
    let theElement = this.find(id)
    theElement.addEventListener('change', callTo)
  }

  disableGo () {
    if (this.testMode) {
      console.log('Disabling Select boxes')
    }
    let selectBoxes = document.getElementsByClassName('selector')
    for (let aSelector of selectBoxes) {
      aSelector.setAttribute('Disabled', 'true')
    }

    if (this.testMode) {
      console.log('Disabling buttons!')
    }
    let goButtons = document.getElementsByClassName('goBttn')
    for (let aButton of goButtons) {
      aButton.setAttribute('disabled', 'true')
    }
  }

  enableGo () {
    let goButtons = document.getElementsByClassName('goBttn')
    for (let aButton of goButtons) {
      aButton.removeAttribute('disabled')
    }
    let selectBoxes = document.getElementsByClassName('selector')
    for (let aSelector of selectBoxes) {
      aSelector.removeAttribute('disabled')
    }
  }

  loadElection (colNumber, electionYear) {
    try {
      this.myNewZealand.findElection(electionYear)
    } catch (err) {
      if (err.message === 'Election not found') {
        let theElection = this.myNewZealand.addElection(electionYear) // eslint-disable-line no-unused-vars
        this.importMode(colNumber, theElection)
      } else {
        throw err
      }
    }
    this.displayElection(colNumber, electionYear)
  }

  importMode (colNumber, theElection) {
    this.disableGo()
    this.importing = true
    this.importColumn = colNumber
    this.importElection = theElection
    let title = `column${colNumber}MainTitle`
    this.find(title).innerHTML = 'Import Mode:'
    let column = `column${colNumber}Main`
    this.clearByID(column)
    this.makeParagraph(column, 'importText')
    this.writeToParagraph('importText', 'Please import the Election data two files at a time. First load the party lists for both Successful and Unsuccessful Parties.')
    this.makeFileInput(column, 'fileLoader')
    this.makeBttn(column, 'Load', 'loadBttn', 'myRender.loadButtonGo()')
  }
  
  displayMode(colNumber) {
    if (colNumber === 1) {
      this.clearByID('column1')
      this.makeHeader('column1', 3, '', 'column1MainTitle')
      this.makeDiv('column1', 'column1Main', 'data')
    } else if (colNumber === 2) {
      this.clearByID('column2')
      this.makeHeader('column2', 3, '', 'column2MainTitle')
      this.makeDiv('column2', 'column2Main', 'data')
    } else {
      throw new RangeError('Index out of range')
    }
  }

  displayElection (colNumber, electionYear) {
    if (!this.importing) {
      let title = `column${colNumber}MainTitle`
      this.displayMode(colNumber)
      View.renderElection(this.myNewZealand.findElection(electionYear), colNumber)
      if (colNumber === 1) {
        this.column1Year = electionYear
      } else {
        this.column2Year = electionYear
      }
      if (this.column2Year !== undefined && this.column1Year !== undefined) {
        this.compareOn()
      }
    }
  }
  
  importComplete(dataType, year) {
    this.find('fileLoader').value = ''
    if (dataType === 'Parties') {
      this.clearByID('importText')
      this.writeToParagraph('importText', 'Parties upload complete. Please load Electorate Winners and Party Vote by Electorate data.')
    } else {
      this.importing = false // tell render that it's finished importing
      this.displayElection(this.importColumn, year) // call to render the election in the correct column
      // clear the in-process variables back to the default states
      this.importElection = undefined
      this.importColumn = null
      this.enableGo()
      
    }
  }
  
  loadButtonGo() {
    let theImport = new Import(this.importElection)
    let filesList = this.find('fileLoader').files
    theImport.fileUploadHandler(filesList)
  }

  column1Go () {
    let electionYear = this.find('column1Select').value
    this.loadElection(1, electionYear)
  }

  column2Go () {
    let electionYear = this.find('column2Select').value
    this.loadElection(2, electionYear)
  }

  compareOn () {
    this.find('comparisonsButton').removeAttribute('disabled')
  }

  compareGo () { // go button bind for compare block
    this.disableGo() // stops edge case where users are annoying
    View.renderComparisons(this.myNewZealand, this.column1Year, this.column2Year)
    this.enableGo()
  }

  buildPage () { // procedural script to build the page
    // create inital div structure with <br> elements where needed
    this.makeHeader('body', 1, 'Election Data Viewer', 'Title')
    this.makeDiv('body', 'upperDisplay', 'container')
    this.makeBreak('body')
    this.makeDiv('body', 'years', 'container')
    this.makeBreak('body')
    this.makeDiv('body', 'comparisons', 'container')
    this.makeBreak('body')
    this.makeBreak('body')
    this.makeDiv('body', 'oldoutput')

    // insert values into upperDisplay
    this.makeDiv('upperDisplay', 'column1Header', 'innerBlock')
    this.makeLabel('column1Header', 'column1SelectLabel', 'Choose Election: ', 'selectLabel')
    this.makeSelect('column1Header', 'column1Select', this.electionOptions, 'selector')
    this.makeBttn('column1Header', 'Go', 'Column1GO', 'myRender.column1Go()', 'goBttn')

    this.makeDiv('upperDisplay', 'column2Header', 'innerBlock')
    this.makeLabel('column2Header', 'column2SelectLabel', 'Choose Election: ', 'selectLabel')
    this.makeSelect('column2Header', 'column2Select', this.electionOptions, 'selector')
    this.makeBttn('column2Header', 'Go', 'Column2GO', 'myRender.column2Go()', 'goBttn')

    // insert values into years
    this.makeDiv('years', 'column1', 'innerBlock')
    this.makeHeader('column1', 3, '', 'column1MainTitle')
    this.makeDiv('column1', 'column1Main', 'data')

    this.makeDiv('years', 'column2', 'innerBlock')
    this.makeHeader('column2', 3, '', 'column2MainTitle')
    this.makeDiv('column2', 'column2Data', 'data')

    // create info in comparisons
    this.makeDiv('comparisons', 'comparisonsUpper')
    this.makeHeader('comparisonsUpper', 3, 'Run Comparisons    ')
    this.insertNonBreakingSpace('comparisonsUpper')
    this.makeBttn('comparisonsUpper', 'Go', 'comparisonsButton', 'myRender.compareGo()', 'goBttn', true)

    this.makeDiv('comparisons', 'comparisonsInner', 'container')
    this.makeDiv('comparisonsInner', 'electorateMpParty', 'innerBlock')
    this.makeBreak('comparisonsInner')
    this.makeDiv('comparisonsInner', 'partyVoteChanges', 'innerBlock')

    // testing suite
    if (this.testMode) {
      this.makeDiv('body', 'tests')
      this.makeHeader('tests', 2, 'Testing buttons:')
      this.makeBttn('tests', 'Disable go buttons', '', 'myRender.disableGo()')
      this.makeBttn('tests', 'Enable go buttons', '', 'myRender.enableGo()')
      this.makeBttn('tests', 'Enable comparisons button', '', 'myRender.compareOn()')
    }
  }
}
