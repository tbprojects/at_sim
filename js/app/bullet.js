Game.Bullet = Game.Entity.extend({

    MOVING: 0.2,

    collisionRadius: 4,
    imageSrc: 'assets/bullet.png',
    shooter: null,
    energy: 50,
    bulletRange: 1000,
    dieAlpha: 0,
    attentionRange: 150,

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
           this._drawTerroristsAttention();
           this._playSound();
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
        if (this.energy < 0 || entityHit === true) {
            this.die();
        } else if (entityHit &&
                   entityHit != this.shooter &&
                   entityHit.getName() != this.getName('bullet')) {
            this.die();
            entityHit.takeDamage(this.energy, this.shooter);
            this._drawTerroristsAttention();
        }
        this.energy -= 0.5;
        this.seek();
    },
    _drawTerroristsAttention: function(){
        var ters = Game.getAliveTerrorists();
        for (var i in ters){
            var ter = ters[i];
            if (['stand', 'wander'].indexOf(ter.currentState) == -1) continue;
            var distance = this.getVecPosition().distanceFrom(ter.getVecPosition());
            if (distance < this.attentionRange){
                ter.setCheckDirection(this);
            }
        }
    },
    _playSound: function(){
        if (this.shooter.getName() == 'terrorist') {
            Game.sounds.play('ter_fire');
        } else {
            Game.sounds.play('at_fire');
        }
    },
    _logDeath: function(){}
});