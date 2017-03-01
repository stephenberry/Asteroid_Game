function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 10;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.max_vel = 5.0;
  this.isBoosting = false;
  this.firing = false;
  this.machine_gun = false;
  //this.big_gun = false
  this.health = 5;
  this.alive = true;
  this.ammo = 50;
  this.shield = false;
  this.shield_damage = 0;

  this.hit = function()
  {
    if (!this.shield) {
        --this.health;
    } else {
        ++this.shield_damage;
    }
    if (this.health <= 0 && !this.shield)
    {
      console.log('you died!');
      this.alive = false;
    }
  }

  this.boosting = function(b) {
    this.isBoosting = b;
  }

  this.update = function() {
    if (this.isBoosting) {
      this.boost(0.2);
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  this.apply_boost = function() {
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  this.boost = function(factor) {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(factor);
    this.vel.add(force);
    //if (this.vel.x > this.max_vel)
    //  this.vel.x = this.max_vel;
    //if (this.vel.y > this.max_vel)
    //  this.vel.y = this.max_vel;
    // This max velocity should really be the norm
  }

  this.hits = function(obj) {
    var d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    if (d < this.r + obj.r) {
      return true;
    } else {
      return false;
    }
  }

  this.render = function(red, green, blue) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    fill(0);
    //stroke(255, 100, 0);
    stroke(red, green, blue)
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
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

  this.setRotation = function(a) {
    this.rotation = a;
  }

  this.turn = function() {
    this.heading += this.rotation;
  }

}
