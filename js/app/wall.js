Game.Wall = Game.Line.extend(
    $.extend(PositionFunc,
    {
    valid: false,

    defaultConfig: {
        stroke: 'black',
        strokeWidth: Game.mapDensity/2,
        lineCap: 'round',
        listening: false,
        name: 'wall'
    },
    setEndPoint: function(x,y){
        this._super(x,y);
        this._validate();
    },
    isVertical: function(){
        return this.getStartPoint().x == this.getEndPoint().x;
    },
    isHorizontal: function(){
        return this.getStartPoint().y == this.getEndPoint().y;
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
}));