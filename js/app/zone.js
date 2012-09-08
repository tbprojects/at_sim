Game.Zone = Kinetic.Circle.extend(
    $.extend(PositionFunc,
    {
    defaultConfig: {
        radius:40,
        fill: 'green',
        alpha: 0.5,
        visible: false,
        listening: false,
        name: 'zone'
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        return this;
	}
}));