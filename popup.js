document.addEventListener("DOMContentLoaded", function () {
  const newTextButton = document.querySelector(".new-note-button");
  const exportButton = document.querySelector(".export-button");
  const textsContainer = document.querySelector(".notes-container");
  const fileInput = document.querySelector(".file-input");

  const localStorageData = localStorage.getItem("textLib");

  let notes = [];

  if (localStorageData !== null && localStorageData !== undefined) {
    notes = JSON.parse(localStorageData);
  }

  let lastTextId = notes[notes.length - 1]?.id || -1;

  refreshTexts(notes);

  // * New note
  newTextButton.addEventListener("click", () => {
    const newTextId = (lastTextId += 1);

    const noteContainer = document.createElement("div");
    const newTextArea = document.createElement("textarea");
    newTextArea.setAttribute("id", newTextId);
    newTextArea.addEventListener("change", (e) => {
      notes = notes.map((note) => ({
        ...note,
        ...(e.target.id == note.id && { content: e.target.value }),
      }));
      localStorage.setItem("textLib", JSON.stringify(notes));
    });

    const trashButton = createTrashButton(newTextId);

    noteContainer.append(newTextArea);
    textsContainer.prepend(noteContainer);
    newTextArea.focus();

    console.log(notes);
    notes.unshift({ id: newTextId, content: "" });
  });

  // * Export
  exportButton.addEventListener("click", () => {
    const downloadLink = document.createElement("a");

    const content = notes || [];

    const file = new Blob([JSON.stringify(content)], { type: "note/plain" });

    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = "textlib.txt";
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  });

  // * Import
  fileInput.addEventListener("change", (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
        JSON.parse(content);
        refreshTexts(JSON.parse(content));
      };

      reader.readAsText(file);
    } else {
      alert("No file selected");
    }
  });

  // * Refresh
  function refreshTexts(newTexts) {
    notes = newTexts;
    notes.forEach((note) => {
      const textarea = document.createElement("textarea");
      textarea.setAttribute("id", note.id);
      textarea.innerText = note.content;

      const trashButton = createTrashButton(note.id);

      textsContainer.append(textarea);
    });
  }

  function createTrashButton(dataId) {
    const trashButton = document.createElement("button");
    trashButton.setAttribute("class", "trash-button");
    trashButton.dataset.dataId = dataId;
    trashButton.innerText = "Trash";
    return trashButton;
  }
});

// TODO - add "overwrite or append" when importing a file
// TODO - add delete button to each note
// TODO - add copy functionality to each note
// TODO - add export functionality
