Game.Bullet = Game.Entity.extend({

    MOVING: 0.2,

    collisionRadius: 4,
    imageSrc: 'assets/bullet.png',
    shooter: null,
    energy: 150,
    bulletRange: 1000,
    dieAlpha: 0,

    defaultConfig: {
        width: 4,
        height:4,
        rotation: 0,
        draggable: false,
        name: 'bullet'
    },
    init: function(config){
           this.setDefaultAttrs(this.defaultConfig);
           this._super(config || {});

           this.shooter = config.shooter;
           this.setPosition(this.shooter.getX(),this.shooter.getY());
           var target = this.getVecPosition().add(this.shooter.getVecVelocity().multiply(this.bulletRange));
           this.setTarget(target.e(1), target.e(2));
           return this;
   	},
    think: function(){
        switch(this.currentState) {
            case 'init': this.setup(); break;
            case 'move': this.move(); break;
            default: break;
        }
    },
    setup: function(){
        this.changeState('move');
    },
    move: function(){
        this.maxSpeed = this.MOVING;
        var entityHit = this.isInCollision();
        if (entityHit === true) {
            this.die();
        } else if (entityHit &&
                   entityHit != this.shooter &&
                   entityHit.getName() != this.getName('bullet')) {
            this.die();
            entityHit.takeDamage(this.energy, this.shooter);
        }
        this.energy -= 1;
        this.seek();
    },
    _logDeath: function(){}
});