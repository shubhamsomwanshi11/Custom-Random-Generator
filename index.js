var arrayofDetails = [];
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('create').addEventListener("click", postData);
    document.getElementById('save').addEventListener("click", postData);

    let name = document.getElementById('generator-title');
    let description = document.getElementById('generator-description');
    // let image = document.getElementById('generator-image');
    let sampleData = document.getElementById('sampleData');
    let sentence = document.getElementById('generator-sentence');
    let isGoogleLink = document.getElementById('googlelink');
    let category = document.getElementById('category');
    let custom_generators = document.getElementById('custom-generators');
    const filter = document.getElementById('filter-category');
    // let imgData, data;

    // Use the input event to capture changes to the image input
    // image.addEventListener('change', () => {
    //     var file = image.files[0];
    //     if (file) {
    //         var reader = new FileReader();
    //         reader.onload = function (e) {
    //             imgData = e.target.result;
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // });

    function postData() {
        data = {
            category: category.value,
            name: name.value,
            description: description.value,
            // image: imgData,
            sampleData: (sampleData.value).split(','),
            sentence: sentence.value,
            isGoogleLink: isGoogleLink.checked
        };

        fetch('http://localhost:8989/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function getNamesData(request) {
        // Fetch data from the server
        fetch(`http://localhost:8989/${request}`)
            .then(response => response.json())
            .then(data => {

                // Organize the data into categories
                const categoryData = {};
                data.data.forEach(generator => {
                    const { category, name, _id } = generator;

                    if (!categoryData[category]) {
                        categoryData[category] = [];
                    }

                    categoryData[category].push({ name, _id });
                });
                custom_generators.innerHTML = '';

                // Iterate through the categories and generate content
                Object.keys(categoryData).forEach(category => {
                    // Create a container for the category
                    const categoryContainer = document.createElement('div');
                    categoryContainer.classList.add('column', 'box', 'mx-1', 'is-6', 'has-background-grey-lighter');
                    categoryContainer.style.width = '49%'

                    const categoryTitle = document.createElement('p');
                    categoryTitle.classList.add('is-size-5', 'has-text-primary', 'has-text-weight-semibold');
                    categoryTitle.textContent = `Generators from ${category} Category`;

                    categoryContainer.appendChild(categoryTitle);

                    // Create a container for the cards
                    const cardsContainer = document.createElement('div');
                    cardsContainer.classList.add('columns', 'mt-3', 'is-multiline');

                    // Iterate through the generator names and generate card content
                    categoryData[category].forEach(generator => {
                        const { name, _id } = generator;

                        const column = document.createElement('div');
                        column.classList.add('column', 'is-4');

                        const card = document.createElement('div');
                        card.classList.add('card');

                        // Add a click event listener to the card
                        card.addEventListener('click', () => {
                            Openwindow(_id, arrayofDetails);
                        });

                        const cardContent = document.createElement('div');
                        cardContent.classList.add('card-content', 'has-text-centered');

                        const heading = document.createElement('h1');
                        heading.classList.add('has-text-weight-bold');
                        heading.textContent = name;

                        cardContent.appendChild(heading);
                        card.appendChild(cardContent);
                        column.appendChild(card);
                        cardsContainer.appendChild(column);
                    });

                    categoryContainer.appendChild(cardsContainer);
                    custom_generators.appendChild(categoryContainer);
                });

                if (Object.keys(categoryData).length === 0) {
                    custom_generators.innerHTML = `<p class="is-size-3 has-text-weight-bold has-text-success has-text-centered">Currently No generators available in this category. Choose a different category or create your own generator in ${filter.value} Category</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    getNamesData("All");
    filter.addEventListener("change", () => {
        getNamesData(filter.value);
    })

    function Openwindow(id) {
        fetch(`http://localhost:8989/getElement/${id}`)
            .then(response => response.json())
            .then(data => {
                let generatorData = data.data[0];

                arrayofDetails = generatorData.sampleData;
                // Open a new tab
                var newTab = window.open('', '_blank');

                // Set the title of the new tab
                newTab.document.title = generatorData.name;

                // Set innerHTML content
                newTab.document.body.innerHTML = `
                    <section class="section">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
                    <script>
                    function generateRandom(quantity) {
                        // If quantity is greater than the array length, set it to array length
                        const numElements = Math.min(quantity, arrayofDetails.length);
                    
                        // Shuffle the array to get random elements
                        const shuffledArray = arrayofDetails.sort(() => Math.random() - 0.5);
                    
                        // Append selected elements to the body
                        for (let i = 0; i < numElements; i++) {
                            const element = shuffledArray[i];
                    
                            // Create HTML structure for each element
                            const columnDiv = document.createElement("div");
                            columnDiv.className = "column is-3";
                    
                            const cardDiv = document.createElement("div");
                            cardDiv.className = "card";
                    
                            const cardContentDiv = document.createElement("div");
                            cardContentDiv.className = "card-content has-text-centered has-text-weight-bold";
                    
                            const linkElement = document.createElement("a");
                            linkElement.href = "#"; // You may set the actual href here
                            linkElement.textContent = element;
                    
                            // Append the elements to the DOM
                            cardContentDiv.appendChild(linkElement);
                            cardDiv.appendChild(cardContentDiv);
                            columnDiv.appendChild(cardDiv);
                            document.getElementById('generator-section').appendChild(columnDiv);
                        }
                    }
                    </script>
                        <h1 class="has-text-centered has-text-weight-bold title" id="generator-title">${generatorData.name}</h1>
                        <span id="generator-description" class="mx-2 is-size-5">${generatorData.description}</span>
                        <hr>
                        <div>
                        <div class="columns">
                        <div class="column is-2"> <!-- for action sidebar -->
                           <div class="field has-addons">
                              <div class="control">
                                 <input id="inputRN" class="input is-medium  is-info " type="text" value="10" placeholder="Number" fdprocessedid="sgiz95">
                              </div>
                              <div class="control">
                                 <a class="button is-info is-outlined is-medium ">
                                    Generate
                                 </a>
                              </div>
                           </div>
                        </div>
               
                        <div class="column is-10"> 
                           <button class="button is-rounded is-outlined is-medium is-primary" onclick="generateRandom(2)" >
                              2             </button>
                           <button class="button is-rounded is-medium is-outlined is-primary" onclick="generateRandom(5)" >
                              5
                           </button>
                           <button class="button is-rounded is-medium is-outlined is-primary" onclick="generateRandom(10)" >
                              10
                           </button>
                           <button class="button is-rounded is-medium is-outlined is-primary" onclick="generateRandom(15)" >
                              15
                           </button>
                           <button class="button is-rounded is-medium is-outlined is-primary" onclick="generateRandom(20)" >
                              20
                           </button>
                           <button class="button is-rounded is-medium is-outlined is-primary" onclick="generateRandom(25)" >
                              25
                           </button>
                           <button class="button is-rounded is-medium is-outlined is-primary" onclick="generateRandom(&quot;all&quot;)" >
                              All
                           </button>
               
                           <button class="button is-outlined is-info is-pulled-right" onclick="createFile('global')" >
                              Download
                           </button>
               
                           <div class="select is-info is-pulled-right mr-2">
                              <select  id="filetype" >
                                 <option value="text">Text</option>
                                 <option value="json">JSON</option>
                              </select>
                           </div>
                        </div>
                     </div>
                        </div>
                        <div class="columns is-multiline mt-5" id="generator-section">
                            
                        </div>
                    </section>`;
            });
    }
});

function generateRandom(quantity) {
    // If quantity is greater than the array length, set it to array length
    const numElements = Math.min(quantity, arrayofDetails.length);

    // Shuffle the array to get random elements
    const shuffledArray = arrayofDetails.sort(() => Math.random() - 0.5);

    // Append selected elements to the body
    for (let i = 0; i < numElements; i++) {
        const element = shuffledArray[i];

        // Create HTML structure for each element
        const columnDiv = document.createElement("div");
        columnDiv.className = "column is-3";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        const cardContentDiv = document.createElement("div");
        cardContentDiv.className = "card-content has-text-centered has-text-weight-bold";

        const linkElement = document.createElement("a");
        linkElement.href = "#"; // You may set the actual href here
        linkElement.textContent = element;

        // Append the elements to the DOM
        cardContentDiv.appendChild(linkElement);
        cardDiv.appendChild(cardContentDiv);
        columnDiv.appendChild(cardDiv);
        document.getElementById('generator-section').appendChild(columnDiv);
    }
}