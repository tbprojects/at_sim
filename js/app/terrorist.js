Game.Terrorist = Game.Entity.extend({
    maxSpeed: 0.02,

    defaultConfig: {
        fill: 'red',
        radius: 5,
        draggable: true,
        name: 'terrorist'
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