Game.Antiterrorist = Game.Entity.extend({
    maxSpeed: 0.03,

    defaultConfig: {
        fill: 'blue',
        radius: 5,
        draggable: true,
        name: 'antiterrorist'
    },

    think: function(){
        switch(this.currentState) {
            case 'idle':
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
