Game.Antiterrorist = Game.Entity.extend({
    maxSpeed: 0.03,
    imageSrc: 'assets/ct.png',

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
            case 'idle':
                var opponent = this.closestSeenOpponent();
                if (opponent) {
                    this.setTargetEntity(opponent);
//                    this.seek();
                }
                break;
            case 'seek':
                this.seek();
                break;
            case 'avoid':
                this.avoid();
                break;
            default:
                break;
        }
    }
});
