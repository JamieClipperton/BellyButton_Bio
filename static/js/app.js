fetch("static/samples.json")
.then(response => {
    return response.json();
})
.then(jsondata => console.log(jsondata));