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
