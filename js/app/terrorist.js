Game.Terrorist = Game.Entity.extend({

    RUNNING: 0.04,
    MOVING: 0.02,
    WALKING: 0.01,
    SHOOTING: 0.005,

    collisionRadius: 8,
    healthPoints: 100,
    reactionTimeMax:55,
    reactionTime: -1,
    shootInterval: 30,
    shootTime: -1,

    imageSrc: 'assets/ter.png',

    wanderCircleDistance: 50,
    wanderRadius: 5,
    wanderRate:0.15,
    wanderOrientation: 0,
    standingProbability: 0.001,
    standingTimeMax: 200,
    standingTime:-1,

    checkDirectionTimeMax: 1000,
    checkDirectionTime: 0,

    enemyName: 'antiterrorist',

    defaultConfig: {
        width: 12,
        height:12,
        rotation: 0,
        draggable: true,
        name: 'terrorist'
    },
    think: function(){
        this.watchForEnemy();
        switch(this.currentState) {
            case 'idle': break;
            case 'init': this.setup(); break;
            case 'stand': this.stand(); break;
            case 'wander': this.wander(); break;
            case 'check direction': this.checkDirection(); break;
            case 'attack': this.attack(); break;
            default: this.changeToDefaultState(); break;
        }
        if (this.avoiding) this.wanderOrientation = this.getRotation();
        this.avoiding = this.avoid();
    },
    setup: function(){
        this.changeState('wander');
    },
    stand: function(){
        this.standingTime -= 1;
        if (this.standingTime < 0) this.changeState('wander');
    },
    wander: function(){
        if (this._wantToStand()) return;
        this.maxSpeed = this.WALKING;
        var circlePos = this.getVecPosition().add(this.getVecVelocity().toUnitVector().multiply(this.wanderCircleDistance));
        this.wanderOrientation += (Math.random() * 2 * this.wanderRate) - this.wanderRate;
        var circleOffset = $V([this.wanderRadius*Math.cos(this.wanderOrientation), this.wanderRadius*Math.sin(this.wanderOrientation)]);
        var target = circlePos.add(circleOffset);
        this.setTarget(target.e(1),target.e(2));
        this.seek();
    },
    changeToDefaultState: function(){
        this.changeState('wander');
    },
    _wantToStand: function(){
        if (this.standingTime < 0 && Math.random() < this.standingProbability) {
            this.standingTime = Math.round((Math.random() * this.standingTimeMax) + this.standingTimeMax/2);
            this.stop();
            this.changeState('stand');
            return true;
        }
        return false;
    },
    _reactOnDamage: function(shooter){
        this.maxSpeed = this.MOVING;
        this.checkDirectionTime = this.checkDirectionTimeMax;
        this.calculatePath(shooter.getX(), shooter.getY());
        this.changeState('check direction');
    }
});