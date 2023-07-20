// create an object
const Keyboard = {
  elements: {
    // object
    main: null, // main keyboard element
    keysContainer: null,
    keys: [], // array of buttons for the keys.
  }, 

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "", // current value of the keyboard
    capsLock: false, // tells whether keyboard is on capslock mode or not
  },

  init() {
    // initialize the keyboard and make all elements and do the work

    // Create main elements
    this.elements.main = document.createElement("div"); // -> 1
    // creates a div and store it virtually inside JavaScript
    this.elements.keysContainer = document.createElement("div"); // -> 2

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden"); //-> 3
    // adding keyboard class to the main container

    this.elements.keysContainer.classList.add("keyboard__keys"); // -> 4
    // adding keyboard__keys class to the keysContainer element

    // the 1,2,3,4 are describing the lines - 28,29,30 in HTML file like....these will create a parent div tags.

    this.elements.keysContainer.appendChild(this._createKeys()); // appending value returned by _createKeys() onto the keysContainer

    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard__key"); // aim of this step and for loop inside  _toggleCapsLock() is to select all keys and switch them from lowercase to uppercase when capslock is on and back to lowercase when capslock is off.
    // it selects all the buttons with a class of keyboard__key
    // all the keys are going to be a node list object..like an array stored in the keys property.

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer); // add elements to actual document
    // adds keysContainer to main
    document.body.appendChild(this.elements.main); // adding the main keyboard container to the actual physical document

    // Automatically use keyboard for elements with .use-keyboard-input
    // to display the keyboard follow below -
    document.querySelectorAll(".input").forEach((element) => {
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      }); // this will pop up the keyboard when mouse cursor is clicked on blankspace
    });
  },

  _createKeys() {
    // underscore tells that createkeys() method is private.
    // createkeys method is going to create all of the HTML for each one of the keys.
    const fragment = document.createDocumentFragment();
    // it returns a document fragment
    // document fragments are virtual elements on which we can append other elements too and then append the whole fragment to a different element

    // here we are returning a fragment and append it to the keysContainer which will append all of the keys within the fragment to the keysContainer

    const keyLayout = [
      // it is an array contains all the keys in the form of strings which should be added to keyboard
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "backspace",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "caps",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "enter",
      "done",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "?",
      "space",
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
      // this line will create material icons for backspace,keyboard_capslock,space_bar etc..
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
      // if current key is with in the array then it returns true and adds line break or else it returns false ans assigns -1 to the index of key.

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      // the above two lines of code will create button type - button and a class - keyboard__key like... line 30 in HTML

      switch (key) {
        case "backspace": // if key value is backspace
          keyElement.classList.add("keyboard__key--wide"); // adds 'keyboard__key--wide' class to 'keyElement'
          keyElement.innerHTML = createIconHTML("backspace"); // makes icon for backspace.

          // to remove last entered element follow below -
          keyElement.addEventListener("click", () => {
            // 'this' refers to keyboard object.
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            ); // this line removes last entered key.
            this._triggerEvent("oninput"); // this will update the input after removal of last entered key.
          });

          break;

        case "caps":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--activatable" // adds these two classes to keyElement
          );
          keyElement.innerHTML = createIconHTML("keyboard_capslock"); // creates icons for capslock.

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle(
              "keyboard__key--active",
              this.properties.capsLock
            ); // if the current state is capslock is equals true then the toggle method is going to be forcing the class to be added to the key element.
            // this will toggle on and off the active class that will display the green light.
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n"; // it will inserts a line break.
            this._triggerEvent("oninput"); // it will update the input
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " "; // it adds a space to the input
            this._triggerEvent("oninput"); // it updates the input
          });

          break;

        case "done":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--dark"
          );
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose"); // triggers to onclose event
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase(); // if capslock is on then it adds key.toUpperCase() or else it adds key.toLowerCase()
            this._triggerEvent("oninput"); // updates the input
          });

          break;
      }

      fragment.appendChild(keyElement); // fragment is a little container for all of the keys.

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br")); // appending line break element.
      }
    });

    return fragment;
    // Now, all the keys are looped and they have been constructed into a button and returning all of the keys as a document fragment
  },

  _triggerEvent(handlerName) {
    // handlerName is either 'oninput' or 'onclose'
    // triggerEvent triggers b/w oninput and onclose.

    if (typeof this.eventHandlers[handlerName] == "function") {
      // if the code has specified a function for the handler then we can fire it up.
      this.eventHandlers[handlerName](this.properties.value); // we are going to provide the current value of the keyboard to the code that is using the keyboard
      // displays keys on blank space.
    }
  },

  _toggleCapsLock() {
    // toggles the capsLock mode
    this.properties.capsLock = !this.properties.capsLock; // flipping the current value of the capslock

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        // this checks if the key does not have any icon.
        // childElementCount for the key containing icon is 1.
        // childElementCount for keys without any tags or elements inside it is 0.
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase(); // if capslock is on then all keys whose childElementCount is 0 will convert to UpperCase or else to LowerCase
      }
    }
  },

  open(initialValue, oninput, onclose) {
    /*open contains 3 arguments.
      initialValue - initial value for the keyboard when it opens up.
      */
    this.properties.value = initialValue || ""; // value is equal to initial value passed in and if it wasn't passed in then use an empty string.
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose; // will reset event handlers
    this.elements.main.classList.remove("keyboard--hidden"); // displays the keyboard when we call the open method
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput; // will reset event handlers
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },
};

window.addEventListener("DOMContentLoaded", function () {
  // listens for the DOM content loaded event so once all of the DOM has been loaded fully on the page it will call the init method.
  Keyboard.init();
});
