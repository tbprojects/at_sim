Sounds = {
	list: {},

	play: function(name, attrs) {
		this.list[name].play();
	},

	stop: function(name) {
		this.list[name].pause();
	}
};