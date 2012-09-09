Game.Antiterrorist = Game.Entity.extend({
    maxSpeed: 0.03,
    followDistance: 8,
    imageSrc: 'assets/ct.png',
    isLeader: false,
    keypointIndex:-1,
    nodeIndex: -1,
    path: [],

    defaultConfig: {
        width: 12,
        height:12,
        rotation: 0,
        draggable: true,
        name: 'antiterrorist'
    },
    closestSeenOpponent: function(){
        //TODO: temporary solution for testing
        return Game.entities.get('.terrorist')[0];
    },
    think: function(){
        switch(this.currentState) {
            case 'init': this.setup(); break;
            case 'follow entity': this.followEntity(); break;
            case 'follow path': this.followPath(); break;
            case 'calculate path': this.calculatePath(); break;
            default: break;
        }
    },
    setup: function(){
        if (this.groupIndex == 0) {
                this.isLeader = true;
                this.changeState('calculate path');
            } else {
                this.changeState('follow entity')
            }
    },
    followEntity: function(){
        //TODO: it should be done once in setup, but it did not work
        this.unsetTargetEntity();
        this.setTargetEntity(Game.entities.get('.antiterrorist')[this.groupIndex-1]);

        var pos = this.currentTargetEntity().getVecPosition().subtract(this.currentTargetEntity().getVecVelocity().multiply(this.followDistance));
        this.setTarget(pos.e(1), pos.e(2));
        this.seek();
    },
    followPath: function(){
        var node = this.path[this.nodeIndex];
        if (!node) {
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
            this.stop();
            this.changeState('idle');
        }
    },
    _buildPathTo: function(object){
        var startNode = this.getNodeByPosition();
        var endNode = object.getNodeByPosition();
        return astar.search(Game.map.graph.nodes, startNode, endNode);
    }
});
