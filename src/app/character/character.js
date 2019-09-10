window.character = (() => {
  const MASS = .9;
  const MAX_SPEED = 4;
  const MAX_STAMINA = 15;

  let die = {
    isDead: false,
    dying: false
  };
  let levelIsCompleted = false;
  let isGoingBack = false;
  let velocity = new V();
  let position;
  const size = {x: 36, y: 59};
  let jump = {
    first: true,
    second: false,
    done: false
  };
  let inAir = false;

  let stamina = MAX_STAMINA;

  function collision(position) {
    const collisionInfo = {
      touches: [],
      sides: []
    };

    map.getMap().enemy.forEach((block) => {
      if (block.center().distance(position.get().add(new V(size.x / 2, size.y / 2))) < block.collisionRadius + 20) {
        toDie();
      }
    });

    map.getMap().map.forEach((block) => {
      if (block.active && position.x + size.x > block.x && position.x < block.x + block.w && position.y < block.y + block.h && position.y + size.y > block.y) {
        const coords = [
          block.y + block.h,
          block.x + block.w,
          block.y - size.y,
          block.x - size.x
        ];
        const distances = [
          (block.y + block.h) - position.y,
          (block.x + block.w) - position.x,
          (position.y + size.y) - block.y,
          (position.x + size.x) - block.x,
        ];

        const side = distances.indexOf(Math.min(...distances));

        collisionInfo.sides.push(side);
        collisionInfo.touches.push({
          side: side,
          type: block.type,
          intersect: coords[side],
          velocity: block.getVelocity()
        });

        if (block.type === 4) {
          block.startFalling();
        }
      }
    });

    return collisionInfo;
  }

  function toDie() {
    if (die.dying) return;
    velocity = new V();
    die.dying = true;
    setTimeout(() => {
      toDead();
    }, 1000);
  }

  function toDead() {
    die.isDead = true;
  }

  return {
    i: () => {
      position = map.getStart().get();
    },
    reset: () => {
      velocity = new V();
      position = map.getCharacterStart().get();
      die = {
        dying: false,
        isDead: false
      };
      characterAnimations.to('stay');
      inAir = false;
      levelIsCompleted = false;
      isGoingBack = false;
    },
    n: () => {
      if (die.dying) {
        characterAnimations.to('die', false, true);
        const acc = velocity.get().normalize().mult(-0.017);
        acc.add(gc.gravity.get().mult(MASS / 2));
        velocity.add(acc);
        position.add(velocity);
        return false;
      }

      const acc = velocity.get().normalize().mult(-0.017);
      acc.add(gc.gravity.get().mult(MASS));

      if (control.pressed[0]) {
        acc.add(new V(-1, 0));
        characterAnimations.mirror(true);
      } else if (control.pressed[2]) {
        acc.add(new V(1, 0));
        characterAnimations.mirror(false);
      }

      velocity.add(acc);
      velocity.x = Math.abs(velocity.x) < MAX_SPEED ? velocity.x : ((Math.abs(velocity.x) / velocity.x) * MAX_SPEED);
      position.add(velocity);

      const collisionResult = collision(position);

      collisionResult.touches.forEach((item) => {
        if (item.type === 1) {
          toDie();
          return;
        }

        if (item.side === 0 && velocity.y <= 0) {
          stamina += .3;
          if (stamina > MAX_STAMINA) stamina = MAX_STAMINA;
          position.y = item.intersect;
          velocity.y = 0;
          position.add(item.velocity);

          if (!control.pressed[0] && !control.pressed[2]) {
            if (item.type === 2) {
              velocity.x /= 1.02;
            } else {
              velocity.x /= 2;
            }
          }

        }

        if (item.side === 1) {
          position.x = item.intersect;
          if (control.pressed[0] && velocity.y < 0 && stamina > 0) {
            velocity = item.velocity;
            characterAnimations.to('wall');
            stamina -= .1;

            if (control.pressed[1]) {
              if (jump.first) {
                velocity.add(new V(20, 15));
                characterAnimations.to('jump', false, true);
                jump.first = false;
                stamina -= 4;
              }
            } else {
              jump.first = true;
            }
          }
        }

        if (item.side === 3) {
          position.x = item.intersect;
          if (control.pressed[2] && velocity.y < 0 && stamina > 0) {
            velocity = item.velocity;
            characterAnimations.to('wall');
            stamina -= .1;

            if (control.pressed[1]) {
              if (jump.first) {
                velocity.add(new V(-20, 15));
                characterAnimations.to('jump', false, true);
                jump.first = false;
                stamina -= 4;
              }
            } else {
              jump.first = true;
            }
          }
        }
        if (item.side === 2) {
          position.y = item.intersect;
          velocity.y = velocity.y >= 0 ? 0 : velocity.y;
        }
      });

      if (collisionResult.sides.indexOf(0) !== -1 && velocity.y <= 0) {
        if (control.pressed[0] || control.pressed[2]) {
          characterAnimations.to('walk');
        } else {
          characterAnimations.to('stay');
        }

        if (control.pressed[1]) {
          if (jump.first) {
            velocity.add(new V(0, 15));
            characterAnimations.to('jump', false, true);
            jump.first = false;
          }
        }

        if (!jump.first && !control.pressed[1]) {
          jump.first = true;
          jump.second = false;
          jump.done = false;
        }

        if (inAir) {
          characterAnimations.to('sit', true);
          inAir = false;
        }
      } else {
        inAir = true;
      }

      if ((!collisionResult.sides.length || stamina < 0) && velocity.y < 0) {
        characterAnimations.to('fall');

        if (control.pressed[1] && jump.second) {
          velocity.apply(new V(0, 15));
          characterAnimations.to('jump', false, true);
          jump.second = false;
          jump.done = true;
        }

        if (!control.pressed[1] && !jump.first && !jump.done) {
          jump.second = true;
        }
      }

      if (!control.pressed[1] && velocity.y > 0) {
        velocity.y /= 1.2;
      }

      if (position.x < 0 && map.isFirst()) {
        position.x = 0;
      } else if (position.x + size.x <= 0) {
        isGoingBack = true;
      }

      if (position.y + size.y < 0) toDie();

      if (position.x >= map.getEnd().x + 40) {
        levelIsCompleted = true;
      }
    },
    r: () => {
      c.save();
      characterAnimations.r(position);
      c.restore();

      if (stamina < MAX_STAMINA) {
        c.save();
        c.fillStyle = 'green';
        c.fillRect(position.x -10, position.y + size.y + 10, stamina * 4 < 0 ? 0 : stamina * 6, 8);
        c.restore();
      }

      // c.save();
      // c.strokeStyle = 'red';
      // c.strokeWidth = 1;
      // c.strokeRect(position.x, position.y, size.x, size.y);
      // c.restore();
    },
    position: () => position,
    isDead: () => die.isDead,
    levelIsCompleted: () => levelIsCompleted,
    isGoingBack: () => isGoingBack
  };
})();
