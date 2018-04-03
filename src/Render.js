/* built by Thomas Baines and Kelsey Vavasour
April 2018
All Rights Reserved
corrected to conform to standardJS 3/04/2018
*/

/* global NewZealand */

class Render { // eslint-disable-line no-unused-vars
  constructor () {
    this.myNewZealand = new NewZealand()
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
      this.clear(item)
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

  makeBttn (myParent, value, id, binding = false, className = undefined) {
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

  bindOnChange (id, callTo) {
    let theElement = this.find(id)
    theElement.addEventListener('change', callTo)
  }
}
