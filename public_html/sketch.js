var ship;
var asteroids = [];
var lasers = [];
var enemies = [];
var pickups = [];
var use_machine_gun = false;
var time_shield_generated = 0.0;
var time_of_enemy_shot = 0.0;
//var use_big_gun = false

function preload() {
    explosion = loadSound('assets/explosion.mp3');
    tie_fighter_roar = loadSound('assets/tie_fighter_noise.mp3');
    laser_blast = loadSound('assets/laser.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship(30);
	ship.pos.x = random(50, width - 50);
	ship.pos.y = random(50, height - 50);
	ship.heading = random(0, 360);
  var n_astroids = 20;
  for (var i = 0; i < n_astroids; i++) {
    var asteroid = new Asteroid();
    if (ship.hits(asteroid))
    {
      ++n_astroids;
    }
    else
    {
      asteroids.push(asteroid);
    }
  }
    
    explosion.setVolume(0.2);
    laser_blast.setVolume(0.1);
    tie_fighter_roar.setVolume(0.25);
}

function draw() {
  background(0);

  for (var i = 0; i < asteroids.length; i++) {
    // check if we hit an astroid
    var asteroid = asteroids[i];
    if (ship.alive)
    {
       if (ship.hits(asteroid)) {
          ship.hit();
          if (ship.health === 0) {
            explosion.play();
          }

          if (asteroid.r > 10) {
            var newAsteroids = asteroid.breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(i, 1);
        }
    }
    
    //check if an enemy has hit an asteroid
    for (var j = enemies.length - 1; j >= 0; --j) {
        
        var enemy = enemies[j];
        if (enemy.hits(asteroid) && time < millis() - 1000) {
            
          explosion.play();
          tie_fighter_roar.pause();
          
          // random weapon
          var pickup = new Pickup(enemy.pos.x, enemy.pos.y, enemy.heading);
          var r = random(5);
          if (r < 1.0)
          {
            pickup.machine_gun = true;
          }

          r = random(5);
          if (r < 1.0)
          {
            pickup.health = true;
          }
          /*r = random(5);
          if (r < 1.0)
          {
            pickup.big gun = true;
          }*/
          r = random(5);
          if (r < 0.5) {
              pickup.shield = true;
          }
          else
          {
            pickup.ammunition = true;
          }

          pickups.push(pickup);
          enemies.splice(j, 1);
          asteroids.splice(i, 1);
          break;
        }
    }
    
    // render astroids
    asteroid.render(155);
    asteroid.update();
    asteroid.edges();
  }

  for (var i = lasers.length - 1; i >= 0; i--) {
    var laser = lasers[i];
    laser.render(0,255,0);
    laser.update();
    if (laser.offscreen()) {
      lasers.splice(i, 1);
    } else {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        var asteroid = asteroids[j];
        if (laser.hits(asteroid)) {

          var r = random(3);
          //console.log(r);
          if (r < 1.0)
          {
            enemies.push(new Ship());
            tie_fighter_roar.play();
            var enemy = enemies.slice(-1)[0];
            enemy.pos = createVector(asteroid.pos.x, asteroid.pos.y);
            time = millis();
          }

          if (asteroid.r > 10) {
            var newAsteroids = asteroid.breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
        }
      }
      for (var k = enemies.length - 1; k >= 0; --k)
      {
        var enemy = enemies[k];
        if (laser.hits(enemy))
        {
            
          explosion.play();
          try {
            tie_fighter_roar.stop();
          } catch (err) {
            tie_fighter_roar.pause();

          }
          // random weapon
          var pickup = new Pickup(enemy.pos.x, enemy.pos.y, enemy.heading);
          var r = random(5);
          if (r < 1.0)
          {
            pickup.machine_gun = true;
          }

          r = random(5);
          if (r < 1.0)
          {
            pickup.health = true;
          }
          /*r = random(5);
          if (r < 1.0)
          {
            pickup.big gun = true;
          }*/
          r = random(5);
          if (r < 0.5) {
              pickup.shield = true;
          }
          else
          {
            pickup.ammunition = true;
          }

          pickups.push(pickup);
          enemies.splice(k, 1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  //console.log(lasers.length);

  if (ship.alive)
  {
      //render the ship a different color if it has a shield
    if (ship.shield) {
        ship.render(0, 255, 0);
    } else {
        ship.render(255, 255, 0);
    }
  ship.turn();
  ship.update();
  ship.edges();

    if (ship.firing)
    {
      if (ship.ammo > 0)
      {
        lasers.push (new Laser(ship.pos, ship.heading));
        ship.boost(-1); // apply a negative boost as kickback from the gun
        --ship.ammo;
      }
    }
    
    if (millis() > (time_shield_generated + 10000) ) {
        ship.shield = false;
    }
  }

  for (var i = 0; i < enemies.length; ++i)
  {
    var enemy = enemies[i];

    var pos = ship.pos.copy();
    var aim = pos.sub(enemy.pos);
    var current = p5.Vector.fromAngle(enemy.heading);
    var angle = p5.Vector.angleBetween(aim, current);
    //console.log(angle);

    var crossed = aim.cross(current);

    if (crossed.z > 0)
      enemy.setRotation(-0.4*angle);
    else
      enemy.setRotation(0.4*angle);
    
    enemy.boosting(true);
    enemy.boost(0.3);

    enemy.render(255, 0, 255);
    enemy.turn();
    enemy.apply_boost();
    enemy.edges();
		
		if (millis() > time_of_enemy_shot + 500) {
			lasers.push(new Laser(enemy.pos, enemy.heading));
			time_of_enemy_shot = millis();
		}
		//setInterval( fire(enemy), 500);

    if (ship.alive)
    {
      if (ship.hits(enemy)) {
        ship.hit();
        enemies.splice(i, 1);
    }
    }
  }

  for (var i = 0; i < pickups.length; ++i)
  {
    var pickup = pickups[i];

    if (ship.hits(pickup)) {
      
      if (pickup.ammunition)
      {
        ship.ammo += 25;
        if (pickup.machine_gun)
        {
          ship.machine_gun = true;
        }
      }
      if (pickup.health)
      {
        ++ship.health;
      }
      if (pickup.shield) {
          ship.shield = true;
          if (ship.shield) {
              time_shield_generated += 10000;
          } else {
              time_shield_generated = millis();
          }
      }
      
      pickups.splice(i, 1);
    }

    pickup.update();
    if (pickup.ammunition)
    {
      pickup.render(255, 255, 0);
    }
    if (pickup.health)
    {
      pickup.render(255, 0, 0);
    }
    if (pickup.shield) {
        pickup.render(122, 0, 255);
    }
    pickup.edges();
  }

  push();
  textSize(20);
  fill(230, 230, 255);
  text("Machine gun: " + ship.machine_gun.toString(), width - 220, height - 80);
  if (ship.shield) {
    text("Shield Timer: " + parseInt( (time_shield_generated + 10000 - millis() ) / 1000), width - 220, height - 100);
  } else {
    text("Shield Timer: N/A", width - 220, height - 100);
  }
  text("Shield: " + ship.shield, width - 220, height - 120);
  textSize(32);
  text(ship.ammo.toString() + " | " + ship.health.toString(), width - 120, height - 40);
  if (ship.alive)
  {
    strokeWeight(10);
  stroke(255, 0, 0);
  var health_percent = ship.health / 20.0;
  line(width - health_percent*300 - 20, height - 20, width - 20, height - 20);
  }
  pop();
} // draw

function keyReleased() {
  if (key == ' ')
  {
    ship.firing = false;
  }
  if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
  ship.setRotation(0);
}
  if (keyCode == UP_ARROW) {
  ship.boosting(false);
}
}

function keyTyped()
{
  if (key === 'm')
  {
    use_machine_gun = !use_machine_gun;
  }
}

function keyPressed() {
    if (key == ' ') {
    if (ship.alive && ship.machine_gun && use_machine_gun)
    {
      ship.firing = true;
    }
    else if (ship.alive)
    {
      if (ship.ammo > 0)
      {
        lasers.push (new Laser(ship.pos, ship.heading));
        ship.boost(-1); // apply a negative boost as kickback from the gun
        laser_blast.play();
        --ship.ammo;
      }
    }
  } 
  if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
  } 
  if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1);
  } 
  if (keyCode == UP_ARROW) {
    ship.boosting(true);
  }
}
