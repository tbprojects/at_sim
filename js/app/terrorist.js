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