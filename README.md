# canvas-photobooth
  
[![Version](https://badge.fury.io/js/stable-socket.png)](https://npmjs.org/package/canvas-photobooth)
[![Build status](https://travis-ci.org/ystskm/stable-socket-js.png)](https://travis-ci.org/ystskm/canvas-photobooth-js)  
  

## Install

Install with [npm](http://npmjs.org/):

    npm install canvas-photobooth
    
## API - Set canvas

```js
    Photobooth({ 
      canvas: <Optional> Canvas Element
    }).add(
      '1.png',
      '2.png',
      '3.png'
    );  
```

### also use on browser

```html
<script type="text/javascript" src="CanvasPhotobooth.js"></script>
<script type="text/javascript">

    var socket = new StableSocket(WebSocket, 
      ['http://localhost:8000/', 'http://localhost:8001/']
      {});
    socket.onopen = function() { console.log('Socket opened!') };
    socket.send('Hello!');
    // => 'Socket opened!'

</script>
```
