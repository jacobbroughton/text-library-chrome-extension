document.addEventListener("DOMContentLoaded", function () {
  const controls = document.querySelector(".controls");
  const newTextButton = document.querySelector(".new-text-button");
  const saveButton = document.querySelector(".save-button");
  const textsContainer = document.querySelector(".texts-container");
  const fileInput = document.querySelector(".file-input");

  let texts = [];
  let lastTextId = texts[texts.length - 1]?.id || -1;

  // * New Text
  newTextButton.addEventListener("click", () => {
    const newTextId = (lastTextId += 1);

    const newTextArea = document.createElement("textarea");
    newTextArea.setAttribute("id", newTextId);
    newTextArea.addEventListener("change", (e) => {
      console.log(e.target.id);
      console.log(newTextId, e.target.value);
      texts = texts.map((text) => ({
        ...text,
        ...(e.target.id == text.id && { content: e.target.value }),
      }));
    });
    textsContainer.prepend(newTextArea);
    newTextArea.focus();

    texts.unshift({ id: newTextId, content: "" });
  });

  // * Save
  saveButton.addEventListener("click", () => {
    const downloadLink = document.createElement("a");

    const content = texts || [];

    const file = new Blob([JSON.stringify(content)], { type: "text/plain" });

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
``
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
    texts = newTexts;
    texts.forEach((text) => {
      const textarea = document.createElement("textarea");
      textarea.setAttribute("id", text.id);
      textarea.innerText = text.content;
      textsContainer.append(textarea);
    });
  }
});
