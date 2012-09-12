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
    keypointIndex:0,

    checkDirectionTimeMax: 40,
    checkDirectionTime: 0,

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
            case 'idle': break;
            case 'init': this.setup(); break;
            case 'follow entity': this.followEntity(); break;
            case 'follow path': this.followPath(); break;
            case 'check direction': this.checkDirection(); break;
            case 'attack': this.attack(); break;
            default: this.changeToDefaultState(); break;
        }
    },
    setup: function(){
        this.changeState('follow entity')
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
            this.keypointIndex = Game.keypointIndex;
            var target = Game.map.keypoints[this.keypointIndex];
            this.calculatePath(target.getX(),target.getY());
            this.changeState('follow path');
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
            var target = Game.map.keypoints[this.keypointIndex+1];
            if (!target) {
                Game.log('Plan executed');
                this.stop();
                this.changeState('idle');
            } else {
                this.keypointIndex += 1;
                Game.keypointIndex = this.keypointIndex;
                this.calculatePath(target.getX(),target.getY());
            }
        } else {
            if (this.arrived()) this.nodeIndex += 1;
            this.setTarget(node.x*Game.mapDensity,node.y*Game.mapDensity);
            this.seek();
        }
    },
    changeToDefaultState: function(){
        this.changeState('follow entity')
    },
    _reactOnDamage: function(shooter){
        this.checkDirectionTime = this.checkDirectionTimeMax;
        this.calculatePath(shooter.getX(), shooter.getY());
        this.changeState('check direction');
    }
});
