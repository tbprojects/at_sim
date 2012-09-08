Game.Entity = Kinetic.Image.extend(
    $.extend(PositionFunc,
    {
    imageSrc: '',
    maxSpeed: 0,
    velX: 0,
    velY: 0,
    tarX: null,
    tarY: null,
    groupIndex: 0,
    isAlive: true,
    speed: 0,
    avoidDistance: 10,
    lookAhead: 12,
    arrivePrecision: 2,
    targetEntityStack: [],
    path: [],
    currentState: 'init',

    defaultConfig: {
        width: 12,
        height:12,
        rotation: 0,
        draggable: true,
        name: 'entity'
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        this.groupIndex  = config.groupIndex;
        var image = new Image();
        image.src = this.imageSrc;
        this.setImage(image);
        this.setOffset(this.getWidth()/2, this.getHeight()/2);
        return this;
	},
    setTarget: function(x,y) {
        this.tarX = x;
        this.tarY = y;
    },
    setTargetEntity: function(entity){
        this.targetEntityStack.push(entity);
        this.setTarget(entity.getX(), entity.getY());
    },
    currentTargetEntity: function(){
        return this.targetEntityStack[this.targetEntityStack.length-1];
    },
    unsetTargetEntity: function(){
        this.targetEntityStack.pop();
        if (this.currentTargetEntity()) {
            this.setTarget(this.currentTargetEntity().getX(), this.currentTargetEntity().getY());
        }
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
        var rot = Math.atan2(-this.getVecVelocity().e(1), this.getVecVelocity().e(2));
        this.setRotation(rot);
   	},
    changeState: function(state) {
        this.currentState = state;
    },
    think: function(){
        // put thinking logic in subclasses - do nothing here
    },
    die: function(){
        this.isAlive = false;
    },
    setRandomPositionInCircle: function(center, radius){
        var theta = Math.random() * Math.PI * 2;
        var length = Math.random();
        var x = Math.cos(theta) * radius * length;
        var y = Math.sin(theta) * radius * length;
        var pos = center.add($V([x,y]));
        this.setPosition(pos.e(1), pos.e(2));
    },
    isInCollision: function(){
        var node = this.getNodeByPosition();
        if (!node || node.type == GraphNodeType.WALL) return true;
        for (i in Game.getEntities()) {
            var entity = Game.getEntities()[i];
            var distance = this.getVecPosition().distanceFrom(entity.getVecPosition());
            var radiusSum = this.getWidth()+entity.getWidth();
            if (this != entity && distance < radiusSum) return true;
        }
        return false;
    },
    seek: function(){
        this._calculateVelocity(this.getVecTarget().subtract(this.getVecPosition()));
    },
    flee: function(){
        this._calculateVelocity(this.getVecPosition().subtract(this.getVecTarget()));
    },
    avoid: function(){

    },
    stop: function(){
        this.setVelocity(0,0);
    },
    arrived: function(){
        var distance = this.getVecPosition().distanceFrom($V([this.tarX, this.tarY]));
        return distance < this.arrivePrecision;
    },
    _calculateVelocity: function(vector){
        var desired_velocity = vector.multiply(this.maxSpeed);
        this.speed = Math.sqrt(desired_velocity.e(1)*desired_velocity.e(1) + desired_velocity.e(2)*desired_velocity.e(2));
        var vel = $V([desired_velocity.e(1)/this.speed,desired_velocity.e(2)/this.speed]);
        if (isNaN(this.speed)) this.speed = 0;
        if (isNaN(vel.e(1))) vel = Vector.Zero(2);
        this.setVelocity(vel.e(1),vel.e(2));
        this.speed = Math.min(this.speed, this.maxSpeed);
    }
}));