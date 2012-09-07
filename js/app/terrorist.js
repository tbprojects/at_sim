Game.Terrorist = Game.Entity.extend({
    maxSpeed: 0.02,
    imageSrc: 'assets/ter.png',

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
            case 'idle':
                var opponent = this.closestSeenOpponent();
                if (opponent) {
                    this.setTargetEntity(opponent);
//                    this.avoid();
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