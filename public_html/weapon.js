function Pickup(x, y, heading) {
  this.pos = createVector(x,y);
  this.vel = p5.Vector.fromAngle(heading);
  this.vel.mult(1);
  this.ammo = 20;
  this.r = 10;
  this.ammunition = false;
  this.machine_gun = false;
  this.health = false;
  this.big_gun = false;

  this.update = function() {
    this.pos.add(this.vel);
  }
  
  this.render = function(red, green, blue) {
    push();
    stroke(red, green, blue);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    //ellipse(0, 0, this.r * 2);
    pop();
  }

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
