// INF651 Final Project - Acme Blogs
// Crystal Clanton
// 11/08/23 - 12/10/23

// Fuction 1 - createElemWithText function - creates new HTML element
function createElemWithText(
  elementName = "p",
  textContent = "",
  className = ""
) {
  const element = document.createElement(elementName);

  element.textContent = textContent;

  if (className) {
    element.className = className;
  }

  return element;
}

// Function 2 - createSelectOptions function - creates an array based on user data
function createSelectOptions(userData) {
  if (!userData) {
    return;
  }

  const options = [];

  userData.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  });

  return options;
}

async function fetchUsersData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error retrieving user data:", error);

    throw error;
  }
}

async function populateUserData() {
  const userData = await fetchUsersData();

  if (userData !== null) {
    const options = await createSelectOptions(userData);
    const selectMenu = document.getElementById("selectMenu");

    options.forEach((option) => {
      selectMenu.appendChild(option);
    });
  }
}

// Function 3 - toggleCommentSection function - toggles comment visibility
function toggleCommentSection(postId) {
  if (!postId) {
    return;
  }

  let section = document.querySelector(`section[data-post-id="${postId}"]`);

  if (section) {
    section.classList.toggle("hide");
  }

  return section;
}

// Function 4 - toggleCommentButton - toggles content of button
function toggleCommentButton(postId) {
  if (!postId) {
    return;
  }

  const button = document.querySelector(`button[data-post-id="${postId}"`);

  if (button !== null) {
    button.textContent =
      button.textContent === "Show Comments"
        ? "Hide Comments"
        : "Show Comments";
  }

  return button;
}

// Function 5 - deleteChildElements - deletes child elements of given parent element
function deleteChildElements(parentElement) {
  if (!(parentElement instanceof HTMLElement)) {
    return;
  }

  while (parentElement.lastElementChild) {
    parentElement.removeChild(parentElement.lastElementChild);
  }

  return parentElement;
}

// Function 6 - addButtonListeners - adds click event listeners to buttons
function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  if (buttons.length > 0) {
    const buttonArray = Array.from(buttons);
    buttonArray.forEach((button) => {
      const postId = button.dataset.postId;
      button.addEventListener("click", (event) =>
        toggleComments(event, postId)
      );
    });

    return buttonArray;
  }

  return [];
}

// Function 7 - removeButtonListeners - removes click event listerners from buttons
function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  if (buttons.length > 0) {
    const buttonArray = Array.from(buttons);
    buttonArray.forEach((button) => {
      const postId = button.dataset.postId;
      button.removeEventListener("click", (event) =>
        toggleComments(event, postId)
      );
    });

    return buttonArray;
  }

  return [];
}

// Function 8 - createComments - creates document fragment that have comment elements
function createComments(comments) {
  if (!comments) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const comment of comments) {
    const article = document.createElement("article");
    const h3 = createElemWithText("h3", comment.name);
    const bodyParagraph = createElemWithText("p", comment.body);
    const emailParagraph = createElemWithText("p", `From: ${comment.email}`);

    article.appendChild(h3);
    article.appendChild(bodyParagraph);
    article.appendChild(emailParagraph);

    fragment.appendChild(article);
  }

  return fragment;
}

// Function 9 - populateSelectMenu - populates the select menu
function populateSelectMenu(users) {
  if (!users) {
    return;
  }

  const selectMenu = document.getElementById("selectMenu");

  if (selectMenu) {
    const options = createSelectOptions(users);

    options.forEach((option) => {
      selectMenu.appendChild(option);
    });
  }

  return selectMenu;
}

// Function 10 - getUsers - fetches user data from external API
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error retreving user information:", error);

    throw error;
  }
}

// Function 11 - getUserPosts - fetches posts from external API
async function getUserPosts(userId) {
  if (!userId) {
    return;
  }

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error retrieving user posts:", error);

    throw error;
  }
}

// Function 12 - getUser - fetches user info from external API
async function getUser(userId) {
  if (!userId) {
    return;
  }

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error retreving user information ${userId}:`, error);

    throw error;
  }
}

// Function 13 - getPostComments - fetches comments from external API
async function getPostComments(postId) {
  if (!postId) {
    return;
  }

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error retrieving post comments:", error);

    throw error;
  }
}

// Function 14 - displayComments - displays comments in hiden section
async function displayComments(postId) {
  if (!postId) {
    return;
  }

  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");

  try {
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);

    return section;
  } catch (error) {
    console.error("Error retrieving comments:", error);

    throw error;
  }
}

// Function 15 - createPosts - creates document fragment that have post elements
async function createPosts(posts) {
  if (!posts) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const post of posts) {
    const article = document.createElement("article");
    const h2 = createElemWithText("h2", post.title);
    const bodyParagraph = createElemWithText("p", post.body);
    const postIdParagraph = createElemWithText("p", `Post ID: ${post.id}`);
    const author = await getUser(post.userId);
    const authorParagraph = createElemWithText(
      "p",
      `Author: ${author.name} with ${author.company.name}`
    );
    const companyCatchPhraseParagraph = createElemWithText(
      "p",
      author.company.catchPhrase
    );
    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = post.id;

    const section = await displayComments(post.id);

    article.appendChild(h2);
    article.appendChild(bodyParagraph);
    article.appendChild(postIdParagraph);
    article.appendChild(authorParagraph);
    article.appendChild(companyCatchPhraseParagraph);
    article.appendChild(button);
    article.appendChild(section);

    fragment.appendChild(article);
  }

  return fragment;
}

// Function 16 - displayPosts - displays posts
async function displayPosts(posts) {
  const main = document.querySelector("main");
  const element = posts
    ? await createPosts(posts)
    : createElemWithText(
        "p",
        "Select an Employee to display their posts.",
        "default-text"
      );

  main.appendChild(element);

  return element;
}

// Function 17 - toggleComments - toggles comment visibility
function toggleComments(event, postId) {
  if (!event || !postId) {
    return;
  }

  event.target.listener = true;

  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);

  return [section, button];
}

// Function 18 - refreshPosts - refreshes posts
async function refreshPosts(posts) {
  if (!posts) {
    return;
  }

  const removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector("main"));
  const fragment = await displayPosts(posts);
  const addButtons = addButtonListeners();

  return [removeButtons, main, fragment, addButtons];
}

// Function 19 - selectMenuChangeEventHandler - changes event for select menu
async function selectMenuChangeEventHandler(event) {
  if (!event) {
    return;
  }

  const selectMenu = document.getElementById("selectMenu");

  const userId = event?.target?.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);

  return [userId, posts, refreshPostsArray];
}

// Function 20 - initPage - initializes page
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);

  return [users, select];
}

// Function 21 - initApp - initializes application
function initApp() {
  initPage().then(([users, select]) => {
    document
      .getElementById("selectMenu")
      .addEventListener("change", selectMenuChangeEventHandler);
  });
}

// event listener for application initialization
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});
