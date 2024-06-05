const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const generatedID = generateId();
  const bookTitle = document.getElementById("title").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const timestamp = parseInt(document.getElementById("inputBookYear").value);
  const checkBook = document.getElementById("checkBook").checked;

  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    timestamp,
    checkBook
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("books");
  uncompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completed-books");
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (!bookItem.isCompleted) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("h3");
  textAuthor.innerText = bookObject.author;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  const trashButton = document.createElement("button");
  trashButton.classList.add("trash-button");
  trashButton.innerText = "Delete";
  trashButton.addEventListener("click", function () {
    removeTaskFromCompleted(bookObject.id);
  });

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.innerText = "Undo";
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(bookObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.innerText = "Sudah Dibaca";
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

function removeTaskFromCompleted(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;
  books.splice(bookIndex, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
