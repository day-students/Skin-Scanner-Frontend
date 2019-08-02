function updatePreview() {
    file = document.getElementById('file').files[0];
    console.log(file);
    document.getElementById('preview').src = URL.createObjectURL(file);
    document.getElementById('preview').style.display = 'block';
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            //console.log(cookies[i], cookie);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function predict() {
    let file = document.getElementById('file').files[0];

    if (file === undefined) {
        document.getElementById('info').innerHTML = 'Please attach an image!'
        document.getElementById('info').style.backgroundColor = '#ffb0b0'
        document.getElementById('info').style.display = 'block';
    } else {

        let csrftoken = getCookie('csrftoken');
        document.getElementById('info').innerHTML = 'Loading...';
        document.getElementById('info').style.backgroundColor = '#ffffb0';
        document.getElementById('info').style.display = 'block';
        fetch('/predict', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
            },
            body: file,
            credentials: 'include'
        }).then((res) => {
            if (res.status == 500) {
                document.getElementById('info').innerHTML = 'Server Error';
                document.getElementById('info').style.backgroundColor = '#ffb0b0';
            } else {
                res.text().then((text) => {
                    preds = JSON.parse(text);
                    linked_probs = Array();
                    
                    inner = "<h2>Results</h2>"
                    for (const [key, value] of Object.entries(preds)) {
                        inner += key + ": " + value.toFixed(2) + "%<br>";
                    }
        
                    document.getElementById('info').innerHTML = inner;
                    document.getElementById('info').style.backgroundColor = '#b0ffb0';

                    //displayAd();
                })
            }
            
        })
    }
}

function addAd() {
    document.getElementById('adp').innerHTML += '! ';
    setTimeout(addAd, 50);
}

function displayAd() {
    console.log('Hec');
    document.getElementById('ad').style.display = 'block';
    addAd();
}
