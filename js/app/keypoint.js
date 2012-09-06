Game.Keypoint = Kinetic.Text.extend({
    valid: false,

    defaultConfig: {
        radius:40,
        textFill: 'green',
        fontSize: 14,
        fontStyle: 'bold',
        visible: false,
        listening: false
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        return this;
	},
    updatePosition: function(x,y) {
      this.setPosition(this._snapToGrid(x),this._snapToGrid(y));
      this._validate();
    },
    _snapToGrid: function(n) {
        return Math.round(n/Game.mapDensity)*Game.mapDensity
    },
    _validate: function(){
        var node;
        try{
            node = Game.map.graph.nodes[this.getX()/Game.mapDensity][this.getY()/Game.mapDensity];
        } catch(e) {
            node = null;
        }
        if (node && node.type == GraphNodeType.OPEN) {
            this.setTextFill('green');
            this.valid = true;
        } else {
            this.setTextFill('red');
            this.valid = false;
        }
    }
});