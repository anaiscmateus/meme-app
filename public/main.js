var trash = document.getElementsByClassName("trash");
var heart = document.getElementsByClassName("heart");      

// handle favorites
Array.from(heart).forEach(function(element) {
  element.addEventListener('click', function(){
    const imgSrc = this.parentNode.parentNode.parentNode.childNodes[1].src
    console.log(imgSrc)
    const url = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
    console.log(url)
    fetch('favorite', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'url': url,
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

// Handle deletes
Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const imgSrc = this.parentNode.parentNode.querySelector('img').getAttribute('src');
    const url = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);

    fetch('delete', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'url': url,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});