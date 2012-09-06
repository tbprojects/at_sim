Game.Terrorist = Game.Entity.extend({
    maxSpeed: 0.02,

    think: function(){
        switch(this.currentState) {
            case 'idle':
                var opponent = this.closestSeenOpponent();
                if (opponent) {
                    this.setTargetEntity(opponent);
                    this.avoid();
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