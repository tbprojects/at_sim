PositionFunc = {
    getNodeByPosition: function(){
        var x = Math.round(this.getX()/Game.mapDensity);
        var y = Math.round(this.getY()/Game.mapDensity);
        var node;
        try { node = Game.map.graph.nodes[x][y] } catch(e) { node = null}
        return node;
    },
    getVecPosition: function(){
      return $V([this.getX(), this.getY()])
    },
    _snapToGrid: function(n) {
        return Math.round(n/Game.mapDensity)*Game.mapDensity
    }
};