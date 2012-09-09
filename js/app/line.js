Game.Line = Kinetic.Line.extend(
    $.extend(PositionFunc,
    {
    defaultConfig: {
        listening: false,
        name: 'line'
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
    getVecStartPoint: function(){
      return $V([this.getStartPoint().x, this.getStartPoint().y])
    },
    getVecEndPoint: function(){
      return $V([this.getEndPoint().x, this.getEndPoint().y])
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
    },
    getIntersectionPoint: function(line) {
        var denom = (line.getEndPoint().y - line.getStartPoint().y) *
                    (this.getEndPoint().x - this.getStartPoint().x) -
                    (line.getEndPoint().x - line.getStartPoint().x) *
                    (this.getEndPoint().y - this.getStartPoint().y);
        var n_a = (line.getEndPoint().x - line.getStartPoint().x) *
                  (this.getStartPoint().y - line.getStartPoint().y) -
                  (line.getEndPoint().y - line.getStartPoint().y) *
                  (this.getStartPoint().x - line.getStartPoint().x);
        var n_b = (this.getEndPoint().x - this.getStartPoint().x) *
                  (this.getStartPoint().y - line.getStartPoint().y) -
                  (this.getEndPoint().y - this.getStartPoint().y) *
                  (this.getStartPoint().x - line.getStartPoint().x);
        if (denom == 0) return null;

        var ua = n_a / denom;
        var ub = n_b / denom;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)
        {
            var x = this.getStartPoint().x + (ua * (this.getEndPoint().x - this.getStartPoint().x));
            var y = this.getStartPoint().y + (ua * (this.getEndPoint().y - this.getStartPoint().y));
           return {x: x, y: y};
        }
        return null;
    },
    getVecIntersectionPoint: function(line){
      var point = this.getIntersectionPoint(line);
      if (point) {
        return $V([point.x, point.y]);
      } else {
        return null;
      }
    },
    getNormals: function() {
        var dx = this.getEndPoint().x - this.getStartPoint().x;
        var dy = this.getEndPoint().y - this.getStartPoint().y;
        return [$V([-dy, dx]), $V([dy, -dx])];
    }
}));