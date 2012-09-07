Game.Wall = Kinetic.Line.extend({
    valid: false,

    defaultConfig: {
        stroke: 'black',
        strokeWidth: Game.mapDensity,
        lineCap: 'round',
        listening: false,
        name: 'wall'
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        return this;
	},
    getStartPoint: function(){
        return this.getPoints()[0];
    },
    getEndPoint: function(){
        return this.getPoints()[1];
    },
    setStartPoint: function(x,y){
        this.setPoints([
            this._snapToGrid(x),
            this._snapToGrid(y)
        ]);
    },
    setEndPoint: function(x,y){
        this.setPoints([
            this.getStartPoint().x,
            this.getStartPoint().y,
            this._snapToGrid(x),
            this._snapToGrid(y)
        ]);
        this._validate();
    },
    isVertical: function(){
        return this.getStartPoint().x == this.getEndPoint().x;
    },
    isHorizontal: function(){
        return this.getStartPoint().y == this.getEndPoint().y;
    },
    _snapToGrid: function(n) {
        return Math.round(n/Game.mapDensity)*Game.mapDensity
    },
    _validate: function(){
        if ( !(this.isVertical() && this.isHorizontal()) && (this.isVertical() || this.isHorizontal()) ) {
            this.setStroke('green');
            this.valid = true;
        } else {
            this.setStroke('red');
            this.valid = false;
        }
    }
});