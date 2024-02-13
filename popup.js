// TODO - (MVP) - add copy functionality to each note
// TODO - (MVP) - add favicon logo
// TODO - (MVP) - tell users where exported files are by default (find a common path that everyone would have)
// TODO - (NOT MVP) add "overwrite or append" when importing a file
// TODO - (NOT MVP) - add export prompt after x amount of changes without one (keep track)
// TODO - (NOT MVP) - add history section that stays in localstorage and shows in scrollable window on bottom

document.addEventListener("DOMContentLoaded", function () {
  const newNoteButton = document.querySelector(".new-note-button");
  const exportButton = document.querySelector(".export-button");
  const fileInput = document.querySelector(".file-input");
  let notesContainer = null;

  const localStorageData = localStorage.getItem("textLib");

  let notes = [];
  let currentView = "All";

  if (localStorageData !== null && localStorageData !== undefined) {
    notes = JSON.parse(localStorageData);
  }

  let lastNoteId = notes[notes.length - 1]?.id || -1;

  if (!notesContainer) createNotesContainer();

  refreshNotes(notes);

  function handleNewNoteClick(e) {
    // const newNoteId = lastNoteId + 1;
    const notesCopy = [...notes];
    const newNoteId = notesCopy[notesCopy.length - 1]?.id + 1 || 0;

    // console.log({ notesCopy, newNoteId });
    // const noteContainer = createNoteContainer(notes, newNoteId);

    // const newTextArea = createTextArea(notes, newNoteId);
    // newTextArea.innerText = newNoteId;

    // noteContainer.append(newTextArea);
    // notesContainer.prepend(noteContainer);
    // newTextArea.focus();

    console.log({ lastNoteId, newNoteId });
    lastNoteId += 1;

    let updatedNotes = [
      ...notes,
      {
        id: newNoteId,
        content: "",
        inTrash: false,
        createdDttm: getDateTime(),
        modifiedDttm: null,
      },
    ];
    refreshNotes(updatedNotes);
  }

  // * New note
  newNoteButton.addEventListener("click", handleNewNoteClick);

  // * Delete
  function createDeleteButton(dataId) {
    const trashButton = document.createElement("button");
    trashButton.classList.add("delete-button");
    trashButton.dataset.dataId = dataId;

    function handleDeleteClick(e) {
      e.stopPropagation();

      let updatedNotes = [
        ...notes.map((note) => ({
          ...note,
          ...(note.id == dataId && { inTrash: true }),
        })),
      ];

      refreshNotes(updatedNotes);
    }

    trashButton.addEventListener("click", handleDeleteClick);
    return trashButton;
  }

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

  // * Create note container
  function createNoteContainer(newestNotes, noteId) {
    // const newNoteId = lastNoteId + 1;
    const noteContainer = document.createElement("div");
    noteContainer.classList.add("note-container");
    noteContainer.dataset.dataId = noteId;

    function handleNoteClick(e) {
      e.stopPropagation();
      const correspondingNote = newestNotes.find((note) => note.id == noteId);
      // if (correspondingNote) copyToClipboard(correspondingNote.content);
    }

    noteContainer.addEventListener("click", handleNoteClick);

    return noteContainer;
  }

  // * Create text area
  function createTextArea(newestNotes, newNoteId) {
    const newTextArea = document.createElement("textarea");
    newTextArea.setAttribute("id", newNoteId);

    function handleChange(e) {
      let updatedNotes = [
        ...newestNotes.map((note) => ({
          ...note,
          ...(e.target.id == note.id && {
            content: e.target.value,
            modifiedDttm: getDateTime(),
          }),
        })),
      ];

      refreshNotes(updatedNotes);
    }

    newTextArea.addEventListener("change", handleChange);

    function handleCopy(e) {
      const clickedNote = notes.find((note) => note.id == e.target.id);
      copyToClipboard(clickedNote.content);
      console.log("Copied", clickedNote.content);

      const noteContainer = document.querySelector(
        `.note-container[data-data-id="${e.target.id}"]`
      );
      console.log(noteContainer);
      const copiedToClipboardOverlay = document.createElement("div");
      copiedToClipboardOverlay.style.backgroundColor = "lightgrey";
      copiedToClipboardOverlay.style.opacity = "0.5";
      copiedToClipboardOverlay.style.position = "absolute";
      copiedToClipboardOverlay.style.inset = "0";
      copiedToClipboardOverlay.innerText = "Copied to clipboard";

      noteContainer.append(copiedToClipboardOverlay);

      setTimeout(() => {
        noteContainer.removeChild(copiedToClipboardOverlay);
      }, 1000);
    }

    newTextArea.addEventListener("click", handleCopy);

    return newTextArea;
  }

  // * Create notes container
  function createNotesContainer() {
    notesContainer = document.createElement("div");
    notesContainer.classList.add("notes-container", "section");
    document.body.append(notesContainer);
  }

  function handleFileInput(e) {
    if (e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
        refreshNotes(JSON.parse(content));
      };

      reader.readAsText(file);
    } else {
      alert("No file selected");
    }
  }

  // * Import
  fileInput.addEventListener("change", handleFileInput);

  // * Refresh
  function refreshNotes(updatedNotes) {
    notes = updatedNotes;
    lastNoteId = notes[notes.length - 1]?.id || -1;

    if (notes[0] && !notesContainer) createNotesContainer();
    while (notesContainer.firstChild) {
      notesContainer.removeChild(notesContainer.firstChild);
    }

    const filteredNotes = notes.filter((note) => {
      if (currentView === "All") {
        if (note.inTrash) return false;
      }

      return true;
    });

    filteredNotes.forEach((note) => {
      const noteContainer = createNoteContainer(notes, note.id);
      const textarea = createTextArea(notes, note.id);
      textarea.value = note.content;
      textarea.addEventL;

      noteContainer.append(textarea);

      const deleteButton = createDeleteButton(note.id);
      const trashSVG = document.createElement("img");
      trashSVG.src = "trash.svg";
      // trashSVG.alt = 'Delete'
      deleteButton.append(trashSVG);

      noteContainer.append(deleteButton);

      notesContainer.append(noteContainer);
    });

    if (!filteredNotes || filteredNotes.length === 0) {
      const notesContainer = document.querySelector(".notes-container");
      notesContainer.innerText = "Nothing here...Consider adding something!";
    }

    localStorage.setItem("textLib", JSON.stringify(updatedNotes));
  }

  async function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log("Copied text to clipboard"))
      .catch((err) => console.log(err));
  }

  function getDateTime() {
    const currentDate = new Date();
    const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const timeOptions = {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    };

    const dateString = currentDate.toLocaleDateString("en-US", dateOptions);
    const timeString = currentDate.toLocaleTimeString("en-US", timeOptions);

    return `${dateString} ${timeString}`;
  }
});
