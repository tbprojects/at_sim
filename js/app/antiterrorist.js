Game.Antiterrorist = Game.Entity.extend({
    maxSpeed: 0.03,

    think: function(){
        switch(this.currentState) {
            case 'idle':
                var opponent = this.closestSeenOpponent();
                if (opponent) {
                    this.setTargetEntity(opponent);
                    this.seek();
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
