Game.Antiterrorist = Game.Entity.extend({

    MOVING: 0.03,
    SHOOTING: 0.005,

    collisionRadius: 8,
    healthPoints: 150,
    reactionTimeMax:70,
    reactionTime: -1,
    shootInterval: 30,
    shootTime: -1,

    followDistance: 10,
    imageSrc: 'assets/ct.png',
    isLeader: false,
    keypointIndex:-1,
    nodeIndex: -1,
    path: [],

    enemyName: 'terrorist',

    defaultConfig: {
        width: 12,
        height:12,
        rotation: 0,
        draggable: true,
        name: 'antiterrorist'
    },
    think: function(){
        this.watchForEnemy();
        switch(this.currentState) {
            case 'init': this.setup(); break;
            case 'follow entity': this.followEntity(); break;
            case 'follow path': this.followPath(); break;
            case 'calculate path': this.calculatePath(); break;
            case 'after attack': this.afterAttack(); break;
            case 'attack': this.attack(); break;
            default: break;
        }
    },
    setup: function(){
        if (this.groupIndex == 1) {
                this.isLeader = true;
                this.changeState('calculate path');
            } else {
                this.changeState('follow entity')
            }
    },
    followEntity: function(){
        this.maxSpeed = this.MOVING;
        //TODO: it should be done once in setup, but it did not work
        this.unsetTargetEntity();
        this.setTargetEntity(Game.entities.get('.antiterrorist')[this.groupIndex-2]);

        var pos = this.currentTargetEntity().getVecPosition().subtract(this.currentTargetEntity().getVecVelocity().multiply(this.followDistance));
        this.setTarget(pos.e(1), pos.e(2));
        this.seek();
    },
    followPath: function(){
        this.maxSpeed = this.MOVING;
        var node = this.path[this.nodeIndex];
        if (!node) {
            Game.log('Keypoint #'+(this.keypointIndex+1)+' reached');
            this.changeState('calculate path');
        } else {
            if (this.arrived()) this.nodeIndex += 1;
            this.setTarget(node.x*Game.mapDensity,node.y*Game.mapDensity);
            this.seek();
        }
    },
    calculatePath: function() {
        var nextKeypoint = Game.map.keypoints[this.keypointIndex+1];
        if (nextKeypoint) {
            this.keypointIndex += 1;
            this.nodeIndex = 0;
            this.path = this._buildPathTo(Game.map.keypoints[this.keypointIndex]);
            this.changeState('follow path')
        } else {
            Game.log('Plan executed');
            this.stop();
            this.changeState('idle');
        }
    },
    afterAttack: function(){
        this.isLeader ?  this.changeState('follow path') : this.changeState('follow entity')
    },
    _buildPathTo: function(object){
        var startNode = this.getNodeByPosition();
        var endNode = object.getNodeByPosition();
        return astar.search(Game.map.graph.nodes, startNode, endNode);
    }
});
