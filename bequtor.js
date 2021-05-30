(function() {
  function Board() {
    const e = document.createElement('div');
    this.layers = [];
    this.element = e;
    this.isDown = false;
    this.downOffset = [0, 0];
    this.current = [];

    e.addEventListener('mouseup', (event) => {
      const x = event.clientX - e.offsetLeft;
      const y = event.clientY - e.offsetTop;
      this.current.splice(0, this.current.length);
      this.isDown = false;
    });

    e.addEventListener('mousedown', (event) => {
      const x = event.clientX - e.offsetLeft;
      const y = event.clientY - e.offsetTop;
      const hit = this.hitTest(x, y);

      if (this.current.length === 0) {
        if (hit.element) {
          this.current.push(hit.element);
          this.downOffset = hit.positionInElement;
        }
      }

      this.isDown = true;
    });

    e.addEventListener('mousemove', (event) => {
      const x = event.clientX - e.offsetLeft;
      const y = event.clientY - e.offsetTop;

      if (this.isDown) {
        if (this.current.length > 0) {
          this.current.forEach(e => {
            const [rx, ry] = this.downOffset;
            e.x = x - rx;
            e.y = y - ry;
          });
        }
      }

      this.clear();
      this.draw();
    })
  }

  function Hit() {
    this.layer = null;
    this.element = null;
    this.positionInElement = null;
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

  function Circle(x, y, radius) {
    this.width = 0;
    this.height = 0;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.style = new Style();
    this.style.fillColor = "white";
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

  Board.prototype.clear = function() {
    this.layers.forEach((layer) => {
      layer.clear();
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
      const hit = lyrs[idx].hitTest(x, y);
      if (hit) {
        return hit;
      }
    }
    return false;
  };

  Layer.prototype.draw = function() {
    this.elements.forEach((e) => {
      e.draw(this.context);
    });
  };

  Layer.prototype.clear = function() {
    this.context.clearRect(
      0, 0,
      this.canvas.width,
      this.canvas.height
    );
  };

  Layer.prototype.addElement = function(e) {
    this.elements.push(e);
  };

  Layer.prototype.hitTest = function(x, y) {
    const elm = this.elements;
    for (let idx = 0; idx < elm.length; idx++) {
      const hit = elm[idx].hitTest(x, y);
      if (hit) {
        hit.layer = this;
        return hit;
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
      const hit = new Hit();
      hit.element = this;
      hit.positionInElement = [
        x - this.x,
        y - this.y
      ];
      return hit;
    }

    return false;
  };

  Circle.prototype.draw = function(context) {
    context.fillStyle = this.style.fillColor;
    context.strokeStyle = this.style.strokeColor;
    context.lineWidth = this.style.lineWidth;

    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );
    context.closePath();
    context.fill();
  };
  Circle.prototype.hitTest = function(x, y) {
    const dx = Math.abs(this.x - x);
    const dy = Math.abs(this.y - y);
    const hypo = Math.hypot(dx, dy);
    const didHit = hypo < this.radius;

    if (didHit) {
      const hit = new Hit();
      hit.element = this;
      hit.positionInElement = [
        x - this.x,
        y - this.y
      ];

      return hit;
    }

    return didHit;
  };

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
  layer.addElement(new Circle(400, 400, 60))

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