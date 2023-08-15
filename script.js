document.addEventListener("DOMContentLoaded", () => {
  // This code runs when the page is fully loaded
  console.log("Page is fully loaded!");

  // Example: Add an event listener to the header
  const header = document.querySelector("header h1");
  header.addEventListener("click", () => {
    alert("Header was clicked!");
  });
});
