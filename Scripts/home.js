WordCloud(document.getElementById('canvas-container'), {
    list: [["Web Technologies", 24],
        ["HTML", 20],
        ["<canvas>", 15],
        ["CSS", 15],
        ["JavaScript", 12],
        ["Document Object Model", 12],
        ["<audio>", 1],
        ["<video>", 2],
        ["Web Workers", 12],
        ["XMLHttpRequest", 12],
        ["SVG", 9],
        ["JSON.parse()", 9],
        ["Geolocation", 9]/*
        9 data attribute
        9 transform
        9 transition
        9 animation
        7 setTimeout
        7 @font-face
7 Typed Arrays
7 FileReader API
7 FormData
7 IndexedDB
7 getUserMedia()
7 postMassage()
7 CORS
6 strict mode
6 calc()
6 supports()
6 media queries
6 full screen
6 notification
6 orientation
6 requestAnimationFrame
5 border-radius
5 box-sizing
5 rgba()
5 text-shadow
5 box-shadow
5 flexbox
5 viewpoint]*/],
    gridSize: 18,
    weightFactor: 3,
    fontFamily: 'Finger Paint, cursive, sans-serif',
    color: '#f0f0c0',
    hover: window.drawBox,
    click: function(item) {
        alert(item[0] + ': ' + item[1]);
    },
    backgroundColor: '#001f00',
    fontCSS: 'https://fonts.googleapis.com/css?family=Finger+Paint'
});
