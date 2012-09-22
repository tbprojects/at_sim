Sounds = {
    init: function(){
        Game.sounds = this;
    },
	list: {
        at_fire: 'assets/sounds/at_fire.mp3',
        ter_fire: 'assets/sounds/ter_fire.mp3',
        ambiance: 'assets/sounds/ambiance.mp3'
    },

    instances: {},

	play: function(name, attrs) {
        this.instances[name] = new Audio(Sounds.list[name]);
        this.instances[name].play();
	},

	stop: function(name) {
        this.instances[name].pause();
	}
};