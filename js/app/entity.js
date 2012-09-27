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
    groupIndex: 1,
    isAlive: true,
    dieAlpha: 0.5,
    speed: 0,
    avoidDistance: 12,
    lookAhead: 14,
    arrivePrecision: 3,
    targetEntity: null,
    watchedEntity: null,
    healthPoints: 100,
    collisionRadius: 12,
    kills: 0,

    nodeIndex: -1,
    path: [],

    currentState: 'init',

    checkLocationTimeMax: 0,
    checkLocationTime: 0,

    sightDistance: 200,
    enemyName: '',

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
        this.rayLine.setStartPoint(this.getX(),this.getY(), false);
        this.rayLine.setEndPoint(this.getX(),this.getY(), false);
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
        this.targetEntity = entity;
        this.updateTargetEntity();
    },
    currentTargetEntity: function(){
        return this.targetEntity;
    },
    unsetTargetEntity: function(){
        this.targetEntity = null;
    },
    updateTargetEntity: function(){
        this.setTarget(this.currentTargetEntity().getX(), this.currentTargetEntity().getY());
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
        if (!Game.paused && this.isAlive) {
            this.think();
            if (this.hasVelocity()) {
                this._updateCollisionRay();
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
        this.setAlpha(this.dieAlpha);
        this.changeState('idle');
        this._logDeath();
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
        for (i in Game.map.walls) {
            var wall = Game.map.walls[i];
            if (this.rayLine.getIntersectionPointWithLine(wall)) {
                return true;
            }
        }
        for (i in Game.getEntities()) {
            var entity = Game.getEntities()[i];
            if (!entity.isAlive) continue;
            var distance = this.getVecPosition().distanceFrom(entity.getVecPosition());
            var radiusSum = this.collisionRadius+entity.collisionRadius;
            if (this != entity && distance < radiusSum) return entity;
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
    avoid: function(collisionPoint, wall){},
    checkForCollision: function(){
        for (var i in Game.map.walls) {
            var wall = Game.map.walls[i];
            var collisionPoint = this.rayLine.getVecIntersectionPoint(wall);
            if (collisionPoint) {
                this.avoid(collisionPoint, wall);
                return true;
            }
        }
        return false;
    },
    closestSeenOpponent: function(){
        var result = null;
        var resultDistance = this.sightDistance;
        var enemies = Game.entities.get('.'+this.enemyName);
        for (var i= 0; i < enemies.length; i+=1) {
            var enemy = enemies[i];
            if (!enemy.isAlive) continue;
            lDist = this.getVecPosition().distanceFrom(enemy.getVecPosition());
            sDist = this.rayLine.getVecEndPoint().distanceFrom(enemy.getVecPosition());
            if (sDist < lDist && sDist < resultDistance) {
                var lineToEnemy = new Game.Line();
                lineToEnemy.setStartPoint(this.getX(), this.getY(), false);
                lineToEnemy.setEndPoint(enemy.getX(), enemy.getY(), false);

                // checking walls on the way
                var behindWall = false;
                var walls = Game.map.walls;
                for (var k= 0; k < walls.length; k+=1) {
                    var wall = Game.map.walls[k];
                    if (lineToEnemy.getIntersectionPointWithLine(wall)){
                        behindWall = true;
                        break;
                    }
                }
                if (behindWall) continue;

                resultDistance = sDist;
                result = enemy;
            }
        }
        return result;
    },
    takeDamage: function(damage, shooter) {
        this._reactOnDamage(shooter);
        this.healthPoints -= damage;
        if (this.healthPoints < 0) {
            shooter.kills += 1;
            this.die();
        }
        Game.updateStat(shooter);
        Game.updateStat(this);
    },
    watchForEnemy: function(){
        var opponent = this.closestSeenOpponent();
        if (!opponent){
            // can not see opponent
            if(this.currentState == 'attack') {
                while(this.currentTargetEntity() &&
                      this.currentTargetEntity().getName() == this.enemyName) {
                    this.unsetTargetEntity();
                }
                this.reactionTime  = this.reactionTimeMax;
                this.watchedEntity = null;
                this.changeState('after attack');
            }
        } else {
            if (opponent != this.watchedEntity) {
                // new opponent seen
                this.watchedEntity = opponent;
                this.reactionTime = this.reactionTimeMax;
            } else {
                // opponent is observed
                this.reactionTime -= 1;
                if (this.reactionTime < 0) {
                    var lineToEnemy = new Game.Line();
                    lineToEnemy.setStartPoint(this.getX(), this.getY(), false);
                    lineToEnemy.setEndPoint(opponent.getX(), opponent.getY(), false);

                    // checking allies on the way
                    var behindAlly = false;
                    var allies = Game.entities.get('.'+this.getName());
                    for (var j= 0; j < allies.length; j+=1) {
                        var ally = allies[j];
                        if (this == ally) continue;
                        if (lineToEnemy.getVecIntersectionPointWithSphere(ally.getVecPosition(), this.collisionRadius)){
                            behindAlly = true;
                            break;
                        }
                    }
                    if (!behindAlly) {
                        this.setTargetEntity(opponent);
                        this.changeState('attack');
                    }
                }
            }
        }
    },
    attack: function(){
        this.maxSpeed = this.SHOOTING;
        this.updateTargetEntity();
        this.seek();
        if (this.shootTime < 0) {
            // shoot at opponent
            this.shootTime = this.shootInterval;
            var bullet = new Game.Bullet({ shooter: this });
            Game.entities.add(bullet);
        }
        this.shootTime -=1;
    },
    calculatePath: function(x,y) {
        this.nodeIndex = 0;
        var startNode = this.getNodeByPosition();
        var endNode = Game.getNodeByPosition(x,y);
        this.path = astar.search(Game.map.graph.nodes, startNode, endNode, true);
    },
    checkLocation: function(){
        var node = this.path[this.nodeIndex];
        if (this.checkLocationTime < 0 || !node ) {
            this.changeToDefaultState();
        } else {
            this.setTarget(node.x*Game.mapDensity,node.y*Game.mapDensity);
            if (this.arrived()) this.nodeIndex += 1;
            this.checkLocationTime -= 1;
            this.seek();
        }
    },
    setCheckLocation: function(entity){
        this.maxSpeed = this.MOVING;
        this.checkLocationTime = this.checkLocationTimeMax;
        this.calculatePath(entity.getX(), entity.getY());
        this.changeState('check location');
    },
    _reactOnDamage: function(shooter){},
    _logDeath: function(){
        Game.log(this.getName()+' #'+this.groupIndex+' killed');
        Game.checkAliveEntities();
    },
    _updateCollisionRay: function(){
        var rayVector = this.getVecVelocity().toUnitVector().multiply(this.lookAhead);
        var rayEndPos = this.getVecPosition().add(rayVector);
        this.rayLine.setStartPoint(this.getX(), this.getY(), false);
        this.rayLine.setEndPoint(rayEndPos.e(1), rayEndPos.e(2), false);
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