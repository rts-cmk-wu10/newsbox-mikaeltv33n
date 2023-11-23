import getJSONfromLocalStorage from "./getJSONfromLocalstorage";
import "../images/LOGO.png";

export default (function () {
    
    if (!window.location.pathname.includes("settings.html")) return;
    
    // List of categories
    let categories = [
        "arts", "automobiles", "books",
        "business", "fashion", "food", "health", "home", "insider", "magazine", "sports",
        "movies", "nyregion", "obituaries", "opinion", "politics", "realestate", "science", "sundayreview", "technology",
        "theater", "t-magazine", "travel", "upshot", "us", "world"
    ];

    let jsonObj = {}

    // Event listener for changes on the document
    document.addEventListener("change", function (event) {
        const changedElement = event.target;
        console.log(changedElement.parentElement.querySelector('h2').textContent);

        jsonObj[changedElement.parentElement.querySelector("h2").textContent] = "checked"
        localStorage.setItem("checked", JSON.stringify(jsonObj))

        // Check if the changed element is a switch input
        if (changedElement.classList.contains("switch__checkbox")) {
            const category = changedElement.dataset.category;
            const contentElement = document.querySelector(`.category__content[data-category="${category}"]`);

            // Toggle the visibility of the category content based on the switch state
            if (contentElement) {
                contentElement.classList.toggle("hidden", !changedElement.checked);

                // If the switch is turned on, remove the category from the array
                if (changedElement.checked) {
                    // Remove the category from the array
                    categories = categories.filter(cat => cat !== category);

                    // Save the updated categories array in local storage
                   // localStorage.setItem("categories", JSON.stringify(categories));
                } else {
                    // Fetch articles from the New York Times API if the switch is turned on
                    fetch(`https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=uZhoGPSEKtSyAp1AGwJYzO8qDAJsjMvc`)
                        .then(res => res.json())
                        .then(data => {
                            // Process and display each article
                            data.results.forEach(element => {
                                // Rest of your code for processing and displaying articles...
                            });
                        })
                        .catch(error => {
                            console.error(`Error fetching ${category} articles:`, error);
                        });
                }

                // Save the updated categories array in local storage
                localStorage.setItem("categories", JSON.stringify(categories));
            }
        }
    });

    // Get the categories container from the document
    const categoriesContainer = document.querySelector(".categories");

    // Restore categories from local storage or use the default list
    


    // Iterate through categories and create corresponding article cards
    categories.forEach(category => {
        // Create an article card for each category
        const articleCard = document.createElement('article');
        articleCard.className = 'card';

        // Populate the article card with category information and the checkbox switch
        articleCard.innerHTML = `
            <div class="category__summary">
                <div class="category__summaryContainer">
                    <img class="category__logo" src="./images/LOGO.png">
                    <h2>${category}</h2>
                </div>
                <input type="checkbox" id="${category}-switch" class="switch__checkbox" data-category="${category}">
                <label class="switch" for="${category}-switch"></label>
            </div>
        `;

        // Create a div element for the category content
        const contentElement = document.createElement('div');
        contentElement.className = 'category__content hidden'; // Initially hide the content
        contentElement.dataset.category = category;

        const ulElement = document.createElement("ul");
        contentElement.appendChild(ulElement);

        // Restore the visibility state from local storage
        const storedVisibility = localStorage.getItem(`category_${category}_visibility`);
        if (storedVisibility === 'visible') {
            contentElement.classList.remove('hidden');
            // Fetch articles from the New York Times API if the category was visible
            fetch(`https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=uZhoGPSEKtSyAp1AGwJYzO8qDAJsjMvc`)
                .then(res => res.json())
                .then(data => {
                    // Process and display each article
                    data.results.forEach(element => {
                        // Rest of your code for processing and displaying articles...
                    });
                })
                .catch(error => {
                    console.error(`Error fetching ${category} articles:`, error);
                });
        }

        // Append the article card and content to the categories container
        categoriesContainer.appendChild(articleCard);
        categoriesContainer.appendChild(contentElement);
    });
})();