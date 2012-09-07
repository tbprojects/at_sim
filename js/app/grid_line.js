Game.GridLine = Kinetic.Line.extend({
    defaultConfig: {
        stroke: "black",
        strokeWidth: 0.2,
        listening: false,
        name: 'grid_line'
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        return this;
	}
});