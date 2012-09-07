Game.Zone = Kinetic.Circle.extend({
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
	},
    getVecPosition: function(){
      return $V([this.getX(), this.getY()])
    }
});