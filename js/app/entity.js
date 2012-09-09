Game.Entity = Kinetic.Image.extend(
    $.extend(PositionFunc,
    {
    imageSrc: '',
    maxSpeed: 0,
    velX: 0,
    velY: 0,
    tarX: null,
    tarY: null,
    rayLine: null,
    groupIndex: 0,
    isAlive: true,
    speed: 0,
    avoidDistance: 12,
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
        this.rayLine = new Game.Line({stroke: 'red'});
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
    hasVelocity: function(){
        return this.velX != 0 || this.velY != 0;
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
        if (!Game.paused) {
            this.think();
            if (this.hasVelocity()) {
                var pos = this.getVecPosition().add(this.getVecVelocity().multiply(frame.timeDiff * this.speed));
                this.setPosition(pos.e(1),pos.e(2));
                var rot = Math.atan2(-this.getVecVelocity().e(1), this.getVecVelocity().e(2));
                this.setRotation(rot);
            }
        }
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
    stop: function(){
        this.setVelocity(0,0);
    },
    arrived: function(){
        var distance = this.getVecPosition().distanceFrom($V([this.tarX, this.tarY]));
        return distance < this.arrivePrecision;
    },
    avoid: function(){
        var rayVector = this.getVecVelocity().toUnitVector().multiply(this.lookAhead);
        var rayEndPos = this.getVecPosition().add(rayVector);
        this.rayLine.setStartPoint(this.getX(), this.getY());
        this.rayLine.setEndPoint(rayEndPos.e(1), rayEndPos.e(2));
        for (var i in Game.map.walls) {
            var wall = Game.map.walls[i];
            var collisionPoint = this.rayLine.getVecIntersectionPoint(wall);
            if (collisionPoint) {
                var norm;
                var n0 = this.getVecPosition().distanceFrom(collisionPoint.add(wall.getNormals()[0]));
                var n1 = this.getVecPosition().distanceFrom(collisionPoint.add(wall.getNormals()[1]));
                if (n0 < n1) {
                    norm = wall.getNormals()[0];
                } else {
                    norm = wall.getNormals()[1];
                }
                var target = collisionPoint.add(norm.multiply(this.avoidDistance));
                this.setTarget(target.e(1), target.e(2));
                this.seek();
                return true;
            }
        }
        return false;
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