Game.Keypoint = Kinetic.Text.extend(
    $.extend(PositionFunc,
    {
    valid: false,

    defaultConfig: {
        radius:40,
        textFill: 'green',
        fontSize: 14,
        fontStyle: 'bold',
        visible: false,
        listening: false,
        name: 'keypoint'
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
    _validate: function(){
        var node = this.getNodeByPosition();
        if (node && node.type == GraphNodeType.OPEN) {
            this.setTextFill('green');
            this.valid = true;
        } else {
            this.setTextFill('red');
            this.valid = false;
        }
    }
}));