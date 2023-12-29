document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('create').addEventListener("click", postData);
    document.getElementById('save').addEventListener("click", postData);

    let name = document.getElementById('generator-title');
    let description = document.getElementById('generator-description');
    let image = document.getElementById('generator-image');
    let sampleData = document.getElementById('sampleData');
    let sentence = document.getElementById('generator-sentence');
    let isGoogleLink = document.getElementById('googlelink');
    let imgData, data;

    // Use the input event to capture changes to the image input
    image.addEventListener('change', () => {
        var file = image.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgData = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function postData() {
        data = {
            name: name.value,
            description: description.value,
            image: imgData,
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
});
