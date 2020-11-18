/**
 *
 * CanvasPhotobooth
 *
 * (c) Yoshitaka Sakamoto, East Cloud Inc., Startup Cloud Inc.
 *  all right reserved.
 * Synquery RSD - DEVELOP: # ,RELEASE: # 
 * principal contributor: 
 *    Yoshitaka Sakamoto <sakamoto@startup-cloud.co.jp>
 * Canvas 要素にフォトブースを表示します。
 *
 **/
// StableSocket
(function(has_win, has_mod) {

  var NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  var g;
  if(has_win) {
    // browser, emulated window
    g = window;
  } else {
    // raw Node.js, web-worker
    g = typeof self == 'undefined' ? this: self;
  }
  
  let Workers = g.Workers;
  if(Workers == NULL) {
    console.error('[CanvasPhotobooth] Workers is not found. We requires workaholic.js (https://github.com/ystskm/workaholic-js)')
    return;
  }

  // exports
  g.Photobooth = CanvasPhotobooth;

  // module.exports (require)
  !has_mod || (module.exports = CanvasPhotobooth);
  
  let Default = {
    Width: 300,
    Height: 200,
    One: [ 72, 72 ],
    Pad: 4
  };
  let protos = {
    add: pb_add,
    del: pb_del,
    empty: pb_empty,
    set: pb_set,
    render: pb_render,
    renderTo: pb_renderTo
  };
  Object.keys(protos).forEach(k=>{
    CanvasPhotobooth.prototype[k] = protos[k];
  });
  
  function CanvasPhotobooth(options) {
    
    if(!(this instanceof CanvasPhotobooth)) {
      return new CanvasPhotobooth(options);
    }
    var pb = this;
    var pb_opts = pb.options = options || { };
    pb.canvas = pb_opts.canvas || document.createElement('canvas');
    pb_opts.width = pb_opts.width || Default.Width;
    pb_opts.height = pb_opts.height || Default.Height;
    pb_opts.one = pb_opts.one || Default.One;
    pb_opts.pad = pb_opts.pad || Default.Pad;
    pb_opts.order = pb_opts.order || 'shuffle';
    pb.workers = Workers();
    pb.arts = new Set(pb_opts.photoList || [ ]);
    
  }
  function pb_add() {
    
    var pb = this, pb_opts = pb.options;
    var imgs = isArray(arguments[0]) ? arguments[0]: casting(arguments);
    imgs.forEach(img=>pb.arts.add(img));
    return pb;
    
  }
  function pb_del() {
    
    var pb = this, pb_opts = pb.options;
    var imgs = isArray(arguments[0]) ? arguments[0]: casting(arguments);
    imgs.forEach(img=>pb.arts.del(img));
    return pb;
    
  }
  function pb_empty() {
    
    var pb = this, pb_opts = pb.options;
    pb.arts = new Set();
    return pb;
    
  }
  function pb_set(p) {
    
    var pb = this, pb_opts = pb.options;
    pb.canvas.width = pb_opts.width, pb.canvas.height = pb_opts.height;
    if(pb.canvas.parentElement !== p) { p.append(pb.canvas); }
    return pb;
    
  }
  function pb_render() {
    var pb = this, pb_opts = pb.options;
    var pb_ctx = pb.canvas.getContext('2d');
    pb_ctx.clearRect(0, 0, pb.canvas.width, pb.canvas.height);
    var col_n = Math.floor( (pb_opts.width  + pb_opts.pad) / pb_opts.one );
    var row_n = Math.floor( (pb_opts.height + pb_opts.pad) / pb_opts.one );
    var col_i = 0;
    var row_i = 0;
    var when = Promise.resolve();
    shuffle( Array.from(pb.arts) ).forEach(uri=>{
      when = when.then(()=>getImg(uri).then(imgObj=>{

        var ratio = Math.min(pb_opts.one / imgObj.naturalWidth, pb_opts.one / imgObj.naturalHeight);
        var render_w = i.naturalWidth * ratio, render_h = i.naturalHeight * ratio;
        var render_x = (pb_opts.one + pb_opts.pad) * col_i + (pb_opts.one - render_w) / 2;
        var render_y = (pb_opts.one + pb_opts.pad) * row_i + (pb_opts.one - render_h) / 2;
        pb_ctx.drawImage(imgObj, render_x, render_y, render_w, render_h);
        if(col_i + 1 < col_n) {
          col_i += 1;
          row_i += 0;
        } else {
          col_i = 0;
          row_i += 1;
        }
        
      }));
    });
    return when;
  }
  function pb_renderTo($to) {
    var pb = this, pb_opts = pb.options;
    return pb.set($to.jquery ? $to.get(0): $to).render();
  }
  
  // -----
  function DummyWorkers(options) {
    if(!(this instanceof DummyWorkers)) {
      return new DummyWorkers(options);
    }
  }
  function shuffle(a) {
    var rd = [ ];
    a = [ ].concat(a);
    while(a.length) rd.push(a.splice(Math.floor(Math.max(0, a.length * Math.random() - 0.001)), 1)[ 0 ]);
    return rd;
  }
  function getImg(uri) {
    return new Promise(function(rsl, rej) {
      var i = new Image();
      i.onload = e=>rsl(i);
      i.onabort = i.onerror = rej;
      i.src = uri;
    });
  }
   
  // -----
  /**
   * @private
   */
  function casting(x) {
    return Array.prototype.slice.call(x);
  }
  function is(ty, x) {
    return typeof x == ty;
  }
  function isFunction(x) {
    return typeof x == 'function';
  }
  function isArray(x) {
    return Array.isArray(x);
  }

})(typeof window != 'undefined', typeof module != 'undefined');
