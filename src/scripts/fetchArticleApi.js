// Import the LOGO image and the getJSONfromLocalStorage function
import "../images/LOGO.png";
import getJSONfromLocalStorage from "./getJSONfromLocalstorage";

// Define the main function with optional parameters
export default function (onlyarchived = false, action = "archive") {

    // List of categories
    const categories = [
        "arts", "automobiles", "books",
        "business", "fashion", "food", "health", "home", "insider", "magazine", "sports",
        "movies", "nyregion", "obituaries", "opinion", "politics", "realestate", "science", "sundayreview", "technology",
        "theater", "t-magazine", "travel", "upshot", "us", "world"
    ];
    
    // Event listener for clicks on the document
    document.addEventListener("click", function (event) {
        const clickedElement = event.target;
        // Check if the clicked element is a category icon
        if (clickedElement.classList.contains("material-symbols-outlined")) {
            const dropdown = clickedElement.closest(".category");
            // Toggle the rotation of the dropdown icon if it's part of a category
            if (dropdown) {
                const dropdownIcon = dropdown.querySelector(".category__dropdown");
                dropdownIcon.classList.toggle("rotate");
            }
        }
    });

    // Get archived articles from local storage or initialize as an empty array
    const archivedArticles = getJSONfromLocalStorage("archived_articles") || [];

    // Get the categories container from the document
    const categoriesContainer = document.querySelector(".categories");

    // Hidden categories (not implemented in the provided code)
    const hiddenCategories = [];

    const filterCategory = JSON.parse(localStorage.getItem("checked"))

    // Iterate through categories and create corresponding elements
    categories.filter(category => onlyarchived || !hiddenCategories.includes(category)).forEach(category => {
        if (filterCategory[category] && !window.location.href.includes("settings.html")) return 

        // Create a details element for each category
        const categoryElement = document.createElement("details");
        categoryElement.className = "category";

        // Populate the summary section with category information
        categoryElement.innerHTML = `
            <summary class="category__summary">
                <div class="category__summaryContainer">
                    <img class="category__logo" src="./images/LOGO.png">
                    <h2>${category}</h2>
                </div>
                <span class="material-symbols-outlined category__dropdown">expand_more</span>
            </summary>
        `;

        // Create a div element for the category content
        const contentElement = document.createElement("div");
        contentElement.className = "category__content";
        const ulElement = document.createElement("ul");
        contentElement.appendChild(ulElement);
        // Add an event listener to the dropdown icon for fetching articles
        categoryElement.querySelector(".category__dropdown").addEventListener("click", function () {
            // Check if content already exists
            if (categoryElement.querySelector(".category__content")) return;

            // Fetch articles from the New York Times API
            fetch(`https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=uZhoGPSEKtSyAp1AGwJYzO8qDAJsjMvc`)
                .then(res => res.json())
                .then(data => {
                    // Filter and process each article
                    data.results.filter(element => {
                        if (onlyarchived) return archivedArticles.includes(element.uri)
                        return !archivedArticles.includes(element.uri)
                    }).forEach(element => {
                        // Truncate function to limit the length of the article abstract
                        function truncate(string, maxlength) {
                            const length = string.length
                            let truncated = string.substr(0, maxlength)
                            if (truncated.charAt(truncated.length - 1) === ".") return truncated
                            else if (length > maxlength) return truncated + "..."
                            return truncated
                        }

                        // Create a list item for each article
                        const listItemElement = document.createElement("li");

                        // Create an article container
                        const articleContainer = document.createElement("section");
                        listItemElement.appendChild(articleContainer);

                        // Create a button and add it to the list item
                        const buttonElement = document.createElement("button");
                        const inboxIcon = document.createElement("span");
                        inboxIcon.classList.add("material-symbols-outlined");
                        if (action === "archive") buttonElement.classList.add("archive-button")
                        if (action === "delete") buttonElement.classList.add("delete-button")
                        if (action === "delete") inboxIcon.innerText = "delete"
                        if (action === "archive") inboxIcon.innerText = "inbox";
                        buttonElement.appendChild(inboxIcon);
                        listItemElement.appendChild(buttonElement);

                        // Populate the article container with information
                        articleContainer.className = 'article__container';
                        let image = "https://picsum.photos/200"
                        if (element.multimedia?.length) {
                            const multimedia = element.multimedia.find(mm => {
                                if (mm.format === "Large Thumbnail") return mm
                            })
                            if (multimedia) image = multimedia.url
                        }
                        articleContainer.innerHTML = `
                            <img class="article__image" src='${image}'alt='headline picture'>
                            <div class="article__text">
                            <h2 class='article__headline'>${element.title}</h2>
                            <p class='article__description'>${truncate(element.abstract, 100)}</p>
                            </div>
                        `;

                        // Add a click event listener to the list item for scrolling
                        ulElement.addEventListener("click", (e) => {
                            const liElement = e.target.closest("li");
                            const btnElement = e.target.closest("button");
                            if (liElement && liElement.scrollLeft === 0) {
                                liElement.scrollBy({
                                    left: 1,
                                    behavior: "smooth"
                                });
                            } else if (!btnElement && liElement) {
                                liElement.scrollBy({
                                    left: -1,
                                    behavior: "smooth"
                                });
                            } else if (btnElement && liElement) {
                                liElement.remove();
                                // Update archived articles based

                                // Update archived articles based on the specified action
                                if (action === "archive") {
                                    archivedArticles.push(element.uri);
                                } else if (action === "delete") {
                                    const indexToBeDeleted = archivedArticles.indexOf(element.uri);
                                    if (indexToBeDeleted === -1) return;
                                    archivedArticles.splice(indexToBeDeleted, 1);
                                }

                                // Save the updated archived articles to local storage
                                localStorage.setItem("archived_articles", JSON.stringify(archivedArticles));
                            }
                        });

                        // Add the list item to the unordered list
                        ulElement.appendChild(listItemElement);
                    });

                    // Append the content to the category element
                    categoryElement.appendChild(contentElement);
                })
                .catch(error => {
                    console.error("Error fetching ${category} articles:", error);
                });
        });

        // Append the category element to the categories container
        categoriesContainer.append(categoryElement);
    });
};
