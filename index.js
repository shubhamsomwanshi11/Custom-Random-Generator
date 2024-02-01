// require('dotenv').config();
var arrayofDetails = [], txtFileData = [], currentData = [];
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('create').addEventListener("click", showPreview);
    document.getElementById('save').addEventListener("click", postData);

    let name = document.getElementById('generator-title');
    let description = document.getElementById('generator-description');
    // let image = document.getElementById('generator-image');
    let sampleData = document.getElementById('sampleData');
    // let sentence = document.getElementById('generator-sentence');
    let isGoogleLink = document.getElementById('googlelink');
    let category = document.getElementById('category');
    let custom_generators = document.getElementById('custom-generators');
    const filter = document.getElementById('filter-category');

    function postData() {
        data = {
            category: category.value,
            name: name.value,
            description: description.value,
            // image: imgData,
            sampleData: (sampleData.value).split(','),
            // sentence: sentence.value,
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
                    categoryContainer.classList.add('column', 'box', 'mx-1', 'is-6', 'has-background-light');
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
                            const div = document.getElementById('new-generator');
                            div.scrollIntoView({ behavior: 'smooth' });
                            showGenerator(_id);
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

    function showGenerator(id) {
        fetch(`http://localhost:8989/getElement/${id}`)
            .then(response => response.json())
            .then(data => {
                let generatorData = data.data[0];

                arrayofDetails = generatorData.sampleData;

                // Set innerHTML content
                document.getElementById('new-generator').innerHTML = `
                        <h1 class="has-text-centered has-text-weight-bold title">${generatorData.name}</h1>
                        <span  class="mx-2 is-size-5">${generatorData.description}</span>
                        <hr>
                        <div>
                        <div class="columns">
                        <div class="column is-2"> <!-- for action sidebar -->
                           <div class="field has-addons">
                              <div class="control">
                                 <input id="inputRN" class="input is-medium  is-info " type="text" value="5" placeholder="Number" fdprocessedid="sgiz95">
                              </div>
                              <div class="control">
                                 <a class="button is-info is-outlined is-medium " onclick="generateRandom('generate')" >
                                    Generate
                                 </a>
                              </div>
                           </div>
                        </div>
               
                        <div class="column is-10"> 
                           <button class="button is-rounded is-outlined is-medium is-primary" onclick="generateRandom(2)" >
                              2             </button>
                           <button class="button is-rounded is-medium is-outlined is-primary" id="clicker" onclick="generateRandom(5)" >
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
                           <button class="button is-rounded is-medium is-outlined is-primary" onclick="generateRandom("all")" >
                              All
                           </button>
               
                           <button class="button is-outlined is-info is-pulled-right" onclick="createFile(document.getElementById('filetype').value)">
                           Download</button>

               
                           <div class="select is-info is-pulled-right mr-2">
                              <select  id="filetype" >
                                 <option value="text">Text</option>
                                 <option value="json">JSON</option>
                              </select>
                           </div>
                        </div>
                     </div>
                        </div>
                        <div class="columns is-multiline mt-5" id="custom-generator-section">
                            
                        </div>
                    </section>`;
                document.getElementById('clicker').click();
            });
    }

    function showPreview() {
        document.getElementById('message').style.display = 'none';
        if (description.value) {
            document.getElementById('generator-description-preview').innerHTML = description.value;
        }
        else {
            alert("Give Some Description about the Generator");
        }
        if (name.value) {
            document.getElementById('generator-title-preview').innerHTML = name.value;
        }
        else {
            alert("Give a specific name to your generator.");
        }
        currentData = sampleData.value.split(',');
    }

    document.getElementById('generatebtn').addEventListener('click', () => {
        let quantity = Math.min(document.getElementById('quantity').value, currentData.length);
        const shuffledArray = currentData.sort(() => Math.random() - 0.5);
        document.getElementById('generator-section').innerHTML = '';
        for (let i = 0; i < quantity; i++) {
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

    });
});
function generateRandom(quantity) {

    // If quantity is greater than the array length, set it to array length
    let numElements;
    if (quantity == 'generate') {
        numElements = Math.min(document.getElementById('inputRN').value, arrayofDetails.length);
    }
    else if (quantity == 'all') {
        numElements = arrayofDetails.length;
    }
    else {
        numElements = Math.min(quantity, arrayofDetails.length);
    }
    document.getElementById('inputRN').value = numElements;

    // Shuffle the array to get random elements
    const shuffledArray = arrayofDetails.sort(() => Math.random() - 0.5);
    document.getElementById('custom-generator-section').innerHTML = '';

    txtFileData = [];
    // Append selected elements to the body
    for (let i = 0; i < numElements; i++) {
        const element = shuffledArray[i];
        txtFileData.push(element);

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
        document.getElementById('custom-generator-section').appendChild(columnDiv);
    }
}

function createFile(fileType) {
    // Assuming txtFileData is the array you want to download
    const dataToDownload = txtFileData;

    // Determine the file extension based on the selected file type
    const fileExtension = fileType === 'json' ? 'json' : 'txt';

    // Create a Blob with the data
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);

    // Set the filename
    downloadLink.download = `file.${fileExtension}`;

    // Append the link to the body and trigger the click event
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the link from the body
    document.body.removeChild(downloadLink);
}
