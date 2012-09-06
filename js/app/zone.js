Game.Zone = Kinetic.Circle.extend({
    defaultConfig: {
        radius:40,
        fill: 'green',
        alpha: 0.5,
        visible: false
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        return this;
	}
});