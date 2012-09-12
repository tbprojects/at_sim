Game.Antiterrorist = Game.Entity.extend({

    MOVING: 0.025,
    SHOOTING: 0.005,

    collisionRadius: 8,
    healthPoints: 150,
    reactionTimeMax:50,
    reactionTime: -1,
    shootInterval: 25,
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
        this.unsetTargetEntity();

        var allies  = Game.entities.get('.antiterrorist');
        var index   = this.groupIndex-1;
        var ally    = null;
        do {
            index -= 1;
            ally = allies[index];
        } while(ally && !ally.isAlive);

        if (!ally){
            // i'm a leader
            this.isLeader = true;
            this.keypointIndex = Game.keypointIndex-1;
            this.changeState('calculate path');
            return;
        } else {
            this.setTargetEntity(ally);
        }

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
            Game.keypointIndex = this.keypointIndex;
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
