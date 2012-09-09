Game.Terrorist = Game.Entity.extend({

    RUNNING: 0.02,
    WALKING: 0.01,

    maxSpeed: 0,
    imageSrc: 'assets/ter.png',

    wanderCircleDistance: 50,
    wanderRadius: 5,
    wanderRate:0.15,
    wanderOrientation: 0,
    standingProbability: 0.001,
    standingTimeMax: 200,
    standingTime:-1,


    defaultConfig: {
        width: 12,
        height:12,
        rotation: 0,
        draggable: true,
        name: 'terrorist'
    },
    closestSeenOpponent: function(){
        //TODO: temporary solution for testing
        return Game.entities.get('.antiterrorist')[0];
    },
    think: function(){
        switch(this.currentState) {
            case 'init': this.setup(); break;
            case 'stand': this.stand(); break;
            case 'wander': this.wander(); break;
            default: break;
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
    _wantToStand: function(){
        if (this.standingTime < 0 && Math.random() < this.standingProbability) {
            this.standingTime = Math.round((Math.random() * this.standingTimeMax) + this.standingTimeMax/2);
            this.stop();
            this.changeState('stand');
            return true;
        }
        return false;
    }
});