document.addEventListener("DOMContentLoaded", function () {
  // popup logic goes here
  const button = document.querySelector("button");
  const clickedCountSpan = document.querySelector("#clickedCount");
  let clickedCount = 0;

  button.addEventListener("click", () => {
    clickedCount += 1;
    clickedCountSpan.innerText = clickedCount;
  });

  clickedCountSpan.innerText = clickedCount;
});
