Game.Entity = Kinetic.Circle.extend({
    maxSpeed: 0,
    velX: 0,
    velY: 0,
    tarX: null,
    tarY: null,
    active: true,
    speed: 0,
    targetEntity: null,
    currentState: 'idle',

    defaultConfig: {
        radius: 5,
        draggable: true
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});

        return this;
	},
    setTarget: function(x,y) {
        this.tarX = x;
        this.tarY = y;
    },
    setTargetEntity: function(entity){
        this.targetEntity = entity;
        this.setTarget(entity.getX(), entity.getY());
    },
    setVelocity: function(x,y) {
        this.velX = x;
        this.velY = y;
    },
    getVecPosition: function(){
      return $V([this.getX(), this.getY()])
    },
    getVecVelocity: function(){
      return $V([this.velX, this.velY])
    },
    getVecTarget: function(){
      return $V([this.tarX, this.tarY])
    },
    update: function(frame) {
   		this.think();
        var pos = this.getVecPosition().add(this.getVecVelocity().multiply(frame.timeDiff * this.speed));
        this.setPosition(pos.e(1),pos.e(2));
   	},
    changeState: function(state) {
        this.currentState = state;
    },
    think: function(){
        // put thinking logic in subclasses - do nothing here
    },
    die: function(){
        this.active = false;
    },
    closestSeenOpponent: function(){
        for (i in Game.getEntities()) {
            var entity = Game.getEntities()[i];
            if (this != entity) {
                return entity;
            }
        }
        return null;
    },
    seek: function(){
        this.changeState('seek');
        if (this.targetEntity) this.setTargetEntity(this.targetEntity);

        var desired_velocity = (this.getVecTarget().subtract(this.getVecPosition())).multiply(this.maxSpeed);
        this.speed = Math.sqrt(desired_velocity.e(1)*desired_velocity.e(1) + desired_velocity.e(2)*desired_velocity.e(2));
        var vel = $V([desired_velocity.e(1)/this.speed,desired_velocity.e(2)/this.speed]);
        if (isNaN(this.speed)) this.speed = 0;
        if (isNaN(vel.e(1))) vel = Vector.Zero(2);
        this.setVelocity(vel.e(1),vel.e(2));
        this.speed = Math.min(this.speed, this.maxSpeed);
    },
    avoid: function(){
        this.changeState('avoid');
        if (this.targetEntity) this.setTargetEntity(this.targetEntity);

        var desired_velocity = (this.getVecPosition().subtract(this.getVecTarget())).multiply(this.maxSpeed);
        this.speed = Math.sqrt(desired_velocity.e(1)*desired_velocity.e(1) + desired_velocity.e(2)*desired_velocity.e(2));
        var vel = $V([desired_velocity.e(1)/this.speed,desired_velocity.e(2)/this.speed]);
        if (isNaN(this.speed)) this.speed = 0;
        if (isNaN(vel.e(1))) vel = Vector.Zero(2);
        this.setVelocity(vel.e(1),vel.e(2));
        this.speed = Math.min(this.speed, this.maxSpeed);
    }

});