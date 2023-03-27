var submittedWords = []

function addItem() {
    var candidate = document.getElementById("textBox");
    var inputval = candidate.value;
    inputval = inputval.toLowerCase();
    if (inputval !== ''){
      newEntry(inputval);
    }
    document.getElementById('textBox').value = "";
    console.log(submittedWords)
  }
var input = document.getElementById("textBox");

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.key === "Enter") {
    addItem();
  }

});

addItem()