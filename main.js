let canvas = document.getElementById('animatedLogo'),
    ctx = canvas.getContext('2d'),
    electricTemplate1 = new Line([
      new Point(143, 325, 0, 0),
      new Point(112, 213),
      new Point(246, 213),
      new Point(215, 325, 0, 0)
    ]),
    electricTemplate2 = new Line([
      new Point(160, 270, 0, 0),
      new Point(150, 240, 5, .2),
      new Point(205, 240, 5, .2),
      new Point(200, 270, 0, 0)
    ]),
    electricLines = [
      new Line(electricTemplate2.points, '#111', 8),
      new Line(electricTemplate2.points, 'white', 4),
      new Line(electricTemplate1.points, '#111', 12),
      new Line(electricTemplate1.points, 'white', 7)
    ],
    emitters = [
      new ParticleEmitter(112,218),
      new ParticleEmitter(246,218)
    ];

electricLines[1].reference = electricLines[0].genPoints;
electricLines[3].reference = electricLines[2].genPoints;

ctx.beginPath();
ctx.moveTo(179.89258,15.355469);
ctx.bezierCurveTo(128.82957,13.994866,74.600017,34.3048,46.296875,78.730469);
ctx.bezierCurveTo(9.7053313,135.53846,8.2600714,208.20195,23.263792,272.26157);
ctx.bezierCurveTo(30.244989999999998,299.80458,41.12139,327.56918,62.356144,347.32492);
ctx.bezierCurveTo(89.599624,378.93884,91.040397,422.19370000000004,94.31205299999999,461.65567);
ctx.bezierCurveTo(92.84826699999999,484.69653,111.85047999999999,499.91906,133.38781999999998,501.00635);
ctx.bezierCurveTo(171.38901999999996,507.01861,211.81643999999997,507.76176,248.54492,495.0625);
ctx.bezierCurveTo(270.03661999999997,483.61913,266.97112,455.73294,269.16211,435.00391);
ctx.bezierCurveTo(270.28166,399.06145000000004,280.02619999999996,361.19234,307.63226,336.25077);
ctx.bezierCurveTo(335.75253999999995,299.15386,343.61539999999997,250.80894,345.53832,205.36932);
ctx.bezierCurveTo(347.04637,146.41644,330.60263,80.74355,280.72157,44.284168);
ctx.bezierCurveTo(251.83832,22.979929,215.23764,15.232389,179.89258,15.355469);
ctx.closePath();
ctx.clip();

function Point(x,y,constr, amt, direction) {
  if(typeof x == 'object') {
    y = x.origin.y;
    constr = x.constrain;
    amt = x.amt;
    direction = x.direction;
    x = x.origin.x;
  };

  this.origin = {
    x:x,
    y:y
  };

  this.constrain = typeof constr == 'number'? constr : 10;

  this.randConstrain = function(){
    return Math.random()*this.constrain * (Math.random()>.5? -1 : 1);
  };

  this.x = x;
  this.y = y;

  this.direction = direction || Math.random()*360;
  this.amt = typeof amt == 'number'? amt : .35;

  this.crawlCount = 0;

  this.crawl = function(reference) {
    this.x += this.amt*Math.cos(this.direction);
    this.y += this.amt*Math.sin(this.direction);

    this.crawlCount+=1;

    if(this.crawlCount > 8 + Math.random()*32) {
      this.direction = Math.random()*360;
      this.x = (reference? reference.x : false) || (this.origin.x + this.randConstrain());
      this.y = (reference? reference.y : false) || (this.origin.y + this.randConstrain());
      this.crawlCount = 0;
    }
  };
}

function Particle(emitter) {
  this.init = function() {
    this.x = emitter.x;
    this.y = emitter.y;

    this.vx = Math.random() * (Math.random()>.5? -1 : 1);
    this.vy = -Math.random()*3;


    this.size = 24;

    this.floater = Math.random()<.05? true : false;

    this.life = Math.random()*100+(this.floater? 50 : 100);

    this.num = Math.random()>.5? '1' : '0';

    this.maxSize = 48 + Math.round(Math.random()*48);
  };

  this.crawl = function() {
    if(!this.floater || this.life > 20) {
      this.x += this.vx;
      this.y += this.vy;

      this.vy += this.floater? -0.01 : 0.03;

      if(this.floater && this.size < this.maxSize) {
        this.size++;
      }
      if(!this.floater && this.size > 12) {
        this.size--;
      }
    }

    this.life -= 1;

    if(this.life < 1) {
      this.init();
    }
  };

  this.init();
}

function ParticleEmitter(x,y,lr) {
  this.x = x;
  this.y = y;
  this.lr = lr;

  this.particles = [];

  this.tick = function() {
    if(this.particles.length < 35) {
      this.particles.push(new Particle(this));
    }

    for(let p in this.particles) {
      this.particles[p].crawl();
    }
  };
}

function Line(points, color, width) {	
  this.points = points||[];
  this.genPoints = [];

  this.reference = [];

  this.color = color || "#111";
  this.origWidth = width||17;
  this.width = this.origWidth;

  this.subDivide = function() {
    for(let j = 0; j < 2; j++) {
      this.genPoints = [];

      for(let i = 0; i < this.points.length; i++) {
        let point = this.points[i],
            nextPoint = this.points[i+1];

        this.genPoints.push(new Point(point));

        if(nextPoint) {
          this.genPoints.push(new Point(
            (point.origin.x + nextPoint.origin.x)/2,
            (point.origin.y + nextPoint.origin.y)/2,
            this.points[1].constrain,
            this.points[1].amt
          ));
        }
      }

      this.points = this.genPoints;
    }
  };

  this.crawl = function() {
    if(!this.genPoints.length) {
      this.subDivide();
    }

    if(Math.random()< .2)
      this.width += (Math.random()>.5? -1 : 1)*Math.random()*2;

    if(this.width < this.origWidth*.5|| this.width > this.origWidth*1.5) {
      this.width = this.origWidth;
    }

    for(let p = 0; p < this.genPoints.length; p++) {
      this.genPoints[p].crawl(this.reference[p]);
    }
  };
}

function tick() {
  for(var e in emitters) {
    var emitter = emitters[e];

    emitter.tick();
  }

  for(let i  in electricLines) {
    let line = electricLines[i];

    line.crawl();
  }
}

function draw(delta) {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(var e in emitters) {
    var emitter = emitters[e];

    for(var p in emitter.particles) {
      var particle = emitter.particles[p];

      ctx.font = 'bold '+particle.size+'px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      ctx.fillStyle = (particle.life < 10? 'rgba(255,255,255,' : 'rgba(17,17,17,')+(1-((particle.life-50)/200))+')';
      ctx.fillText(particle.num, particle.x, particle.y);
    }
  }

  for(let i in electricLines) {
    let line = electricLines[i];

    ctx.beginPath();
    ctx.moveTo(line.genPoints[0].x, line.genPoints[0].y);

    for(let j in line.genPoints) {
      let point = line.genPoints[j];

      ctx.lineTo(point.x, point.y);
    }

    ctx.lineCap = "square";
    ctx.lineWidth = line.width;
    ctx.strokeStyle = line.color;
    ctx.stroke();
  }
}

function animate() {
  tick();
  draw();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);