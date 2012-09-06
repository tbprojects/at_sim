Game.Map = Kinetic.Rect.extend({
    newWall: null,
    graph: null,
    zone: null,
    walls: [],
    keypoints: [],

    defaultConfig: {
        width: Game.width,
        height: Game.height
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        this._buildGrid();
        this._buildGraph();
        this._bindEvents();
        return this;
	},
    removeLastWall: function() {
        var wall = this.walls.pop();
        if (wall) {
            this._updateWallOnGraph(wall, GraphNodeType.OPEN);
            Game.mapObjects.remove(wall);
        }
    },
    clearWalls: function(){
        while(this.walls.length > 0) {
            this.removeLastWall();
        }
    },
    _bindEvents: function(){
        var self = this;
        this.on("mousedown", function() {
            self.newWall = new Game.Wall();
            Game.mapObjects.add(self.newWall);
            var pos = Game.stage.getMousePosition();
            self.newWall.setStartPoint(pos.x, pos.y);
        });
        this.on("mousemove", function() {
            if (self.newWall) {
                var pos = Game.stage.getMousePosition();
                self.newWall.setEndPoint(pos.x, pos.y);
            }
        });
        this.on("mouseup", function() {
            self._addWall();
        });
    },
    _buildGraph: function(){
        var array = [];
        for (var x= 0; x < Math.floor(this.getWidth()/Game.mapDensity); x+=1){
            array[x] = [];
            for (var y= 0; y < Math.floor(this.getHeight()/Game.mapDensity); y+=1){
                array[x][y] = 1;
            }
        }
        this.graph = new Graph(array);
    },
    _buildGrid: function() {
        for (var x= Game.mapDensity; x < this.getWidth(); x += Game.mapDensity) {
            Game.mapObjects.add(new Kinetic.Line({
              points: [x, 0, x, this.getHeight()],
              stroke: "black",
              strokeWidth: 0.2
            }));
        }
        for (var y= Game.mapDensity; y < this.getHeight(); y += Game.mapDensity) {
            Game.mapObjects.add(new Kinetic.Line({
              points: [0, y, this.getWidth(), y],
              stroke: "black",
              strokeWidth: 0.2
            }));
        }
    },
    _addWall: function() {
        if (this.newWall.valid) {
            this.newWall.setStroke('black');
            this.walls.push(this.newWall);
            this._updateWallOnGraph(this.newWall, GraphNodeType.WALL);
        } else {
            Game.mapObjects.remove(this.newWall);
        }
        this.newWall = null;
    },
    _updateWallOnGraph: function(wall, state){
        if (wall.isVertical()) {
            var startY = wall.getStartPoint().y/Game.mapDensity-1;
            var endY = wall.getEndPoint().y/Game.mapDensity+1;
            var x = wall.getStartPoint().x/Game.mapDensity;
            for (var i=startY; i<endY; i+=1) {
                this.graph.nodes[x][i].type = state;
                this.graph.nodes[x-1][i].type = state;
            }
        } else {
            var startX = wall.getStartPoint().x/Game.mapDensity-1;
            var endX = wall.getEndPoint().x/Game.mapDensity+1;
            var y = wall.getStartPoint().y/Game.mapDensity;
            for (var i=startX; i<endX; i+=1) {
                this.graph.nodes[i][y].type = state;
                this.graph.nodes[i][y-1].type = state;
            }
        }
    }
});