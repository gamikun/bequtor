(function() {
  function Board() {
    const e = document.createElement('div');
    this.layers = [];
    this.element = e;

    e.addEventListener('mouseup', (event) => {
      const x = event.clientX - e.offsetLeft;
      const y = event.clientY - e.offsetTop;
      
      alert(this.hitTest(x, y));
    });
  }

  function Layer() {
    this.elements = [];
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  function Rectangle(x, y, w, h) {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
    this.style = new Style();
  }

  function Circle() {
    this.width = 100;
    this.height = 100;
    this.x = 0;
    this.y = 0;
    this.style = new Style();
  }

  function Style() {
    this.fillColor = 'black';
    this.strokeColor = 'black';
    this.lineWidth = 1;
  }

  Board.prototype.draw = function() {
    this.layers.forEach((layer) => {
      layer.draw();
    });
  };

  Board.prototype.addLayer = function(layer) {
    this.layers.push(layer);
    this.element.appendChild(layer.canvas);
  };

  Board.prototype.resize = function(width, height) {
    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';
    this.layers.forEach((layer) => {
      layer.canvas.width = width;
      layer.canvas.height = height;
    });
  };

  Board.prototype.hitTest = function(x, y) {
    const lyrs = this.layers;
    for (let idx = 0; idx < lyrs.length; idx++) {
      if (lyrs[idx].hitTest(x, y)) {
        return true;
      }
    }
    return false;
  };

  Layer.prototype.draw = function() {
    this.elements.forEach((e) => {
      e.draw(this.context);
    });
  };

  Layer.prototype.addElement = function(e) {
    this.elements.push(e);
  };

  Layer.prototype.hitTest = function(x, y) {
    const elm = this.elements;
    for (let idx = 0; idx < elm.length; idx++) {
      if (elm[idx].hitTest(x, y)) {
        return true;
      }
    }

    return false;
  }

  Rectangle.prototype.draw = function(context) {
    context.fillStyle = this.style.fillColor;
    context.strokeStyle = this.style.strokeColor;
    context.lineWidth = this.style.lineWidth;

    context.fillRect(
      this.x, this.y,
      this.width, this.height
    );
  };

  Rectangle.prototype.hitTest = function(x, y) {
    if (x > this.x
      && y > this.y
      && x <= (this.x + this.width)
      && y <= (this.y + this.height)
    ) {
      return true;
    }

    return false;
  };

  Circle.prototype.draw = function() {};
  Circle.prototype.hitTest = function(x, y) {};

  const rectA = new Rectangle(100, 100, 150, 200);
  const rectB = new Rectangle(250, 250, 50, 50);
  const rectC = new Rectangle(300, 20, 25, 100);

  rectA.style.fillColor = 'white';
  rectB.style.fillColor = 'yellow';
  rectC.style.fillColor = 'green';

  const layer = new Layer();
  layer.addElement(rectA);
  layer.addElement(rectB);
  layer.addElement(rectC);

  const board = new Board();
  board.addLayer(layer);
  document.body.appendChild(board.element);

  window.addEventListener('resize', () => {
    board.resize(
      window.innerWidth,
      window.innerHeight
    );
    board.draw();
  });

  window.addEventListener('load', () => {
    board.resize(
      window.innerWidth,
      window.innerHeight
    );
    board.draw();
  })

})();