Game.Map = Kinetic.Rect.extend({
    newWall: null,
    graph: null,
    zone: null,
    zoneDraft: null,
    newKeypoint: null,
    walls: [],
    keypoints: [],

    defaultConfig: {
        width: Game.width,
        height: Game.height,
        name: 'map'
    },

	init: function(config){
        this.setDefaultAttrs(this.defaultConfig);
        this._super(config || {});
        this._buildGrid();
        this._buildGraph();
        this._bindEvents();
        this._buildZoneDraft();
        this._buildKeypoint();
        return this;
	},
    removeLastWall: function() {
        var wall = this.walls.pop();
        if (wall) {
            this._updateWallOnGraph(wall, GraphNodeType.OPEN);
            Game.configObjects.remove(wall);
        }
    },
    clearWalls: function(){
        while(this.walls.length > 0) {
            this.removeLastWall();
        }
    },
    removeLastKeypoint: function() {
        var keypoint = this.keypoints.pop();
        if (keypoint) {
            Game.configObjects.remove(keypoint);
            this.newKeypoint.setText((this.keypoints.length+1).toString());
        }
    },
    clearKeypoints: function(){
        while(this.keypoints.length > 0) {
            this.removeLastKeypoint();
        }
    },
    removeZone: function(){
        if (this.zone){
            Game.configObjects.remove(this.zone);
            this.zone = null;
        }
    },
    serializeConfig: function(){
        return {
            walls: $.map(this.walls, function(el, i){ return {s: el.getStartPoint(), e: el.getEndPoint()}}),
            zone: this.zone.getPosition(),
            keypoints: $.map(this.keypoints, function(el, i){ return el.getPosition()}),
            graph: $.map(this.graph.nodes, function(row, i){return [$.map(row, function(node,k){ return node.type})]})
        }
    },
    importConfig: function(config){
        Game.configObjects.removeChildren();
        this.graph = new Graph(config.graph);
        this.zone = null;
        this.walls = [];
        this.keypoints = [];
        var i;
        for (i in config.walls) {
            var data = config.walls[i];
            var wall = new Game.Wall({points: [data.s.x, data.s.y, data.e.x, data.e.y]});
            this.walls.push(wall);
            Game.configObjects.add(wall);
        }
        for (i in config.keypoints) {
            var data = config.keypoints[i];
            var keypoint = new Game.Keypoint({x: data.x, y: data.y, text: (parseInt(i)+1).toString(), visible: true, textFill: 'blue'});
            this.keypoints.push(keypoint);
            Game.configObjects.add(keypoint);
        }
        this.zone = new Game.Zone({x: config.zone.x, y: config.zone.y, visible: true, alpha: 0.8});
        Game.configObjects.add(this.zone);
    },
    _bindEvents: function(){
        var self = this;
        this.on("mousedown", function() {
            switch(Game.uiState) {
                case 'draw map':
                    self._initWall(); break;
            }
        });
        this.on("mousemove", function() {
            switch(Game.uiState) {
                case 'draw map':
                    self._updateWall(); break;
                case 'draw zone':
                    self._updateDraftZone(); break;
                case 'draw keypoints':
                    self._updateNewKeypoint(); break;
            }
        });
        this.on("mouseup", function() {
            switch(Game.uiState) {
                case 'draw map':
                    self._addWall(); break;
                case 'draw zone':
                    self._setZone(); break;
                case 'draw keypoints':
                    self._addKeypoint(); break;
            }
        });
        this.on("mouseout", function() {
            switch(Game.uiState) {
                case 'draw zone':
                    self._hideDraftZone(); break;
                case 'draw keypoints':
                    self._hideNewKeypoint(); break;
            }
        });
        this.on("mouseover", function() {
            switch(Game.uiState) {
                case 'draw zone':
                    self._showDraftZone(); break;
                case 'draw keypoints':
                    self._showNewKeypoint(); break;
            }
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
            Game.mapObjects.add(new Game.GridLine({
              points: [x, 0, x, this.getHeight()]
            }));
        }
        for (var y= Game.mapDensity; y < this.getHeight(); y += Game.mapDensity) {
            Game.mapObjects.add(new Game.GridLine({
              points: [0, y, this.getWidth(), y]
            }));
        }
    },
    _initWall:function() {
        this.newWall = new Game.Wall();
        Game.configObjects.add(this.newWall);
        var pos = Game.stage.getMousePosition();
        this.newWall.setStartPoint(pos.x, pos.y, true);
    },
    _updateWall:function(){
        if (this.newWall) {
            var pos = Game.stage.getMousePosition();
            this.newWall.setEndPoint(pos.x, pos.y, true);
        }
    },
    _addWall: function() {
        if (this.newWall.valid) {
            this.newWall.setStroke('black');
            this.walls.push(this.newWall);
            this._updateWallOnGraph(this.newWall, GraphNodeType.WALL);
        } else {
            Game.configObjects.remove(this.newWall);
        }
        this.newWall = null;
    },
    _updateWallOnGraph: function(wall, state){
        var i;
        if (wall.isVertical()) {
            var startY = wall.getStartPoint().y/Game.mapDensity;
            var endY = wall.getEndPoint().y/Game.mapDensity;
            var x = wall.getStartPoint().x/Game.mapDensity;
            for (i=Math.min(startY,endY)-1; i<Math.max(startY,endY)+1; i+=1) {
                this.graph.nodes[x][i].type = state;
                this.graph.nodes[x-1][i].type = state;
            }
        } else {
            var startX = wall.getStartPoint().x/Game.mapDensity;
            var endX = wall.getEndPoint().x/Game.mapDensity;
            var y = wall.getStartPoint().y/Game.mapDensity;
            for (i=Math.min(startX,endX)-1; i<Math.max(startX,endX)+1; i+=1) {
                this.graph.nodes[i][y].type = state;
                this.graph.nodes[i][y-1].type = state;
            }
        }
    },
    _buildZoneDraft: function(){
        this.zoneDraft = new Game.Zone();
        Game.mapObjects.add(this.zoneDraft);
    },
    _buildKeypoint: function(){
        this.newKeypoint = new Game.Keypoint({
            text: (this.keypoints.length+1).toString()
        });
        Game.mapObjects.add(this.newKeypoint);
    },
    _showDraftZone: function(){
        if (!this.zone) {
            this.zoneDraft.show();
        }
    },
    _hideDraftZone: function(){
        if (!this.zone) {
            this.zoneDraft.hide();
        }
    },
    _setZone: function(){
        if (!this.zone) {
            this._hideDraftZone();
            this.zone = new Game.Zone({
                x:this.zoneDraft.getX(),
                y: this.zoneDraft.getY(),
                alpha: 0.8,
                visible: true
            });
            Game.configObjects.add(this.zone);
        }
    },
    _updateDraftZone: function(){
        if (!this.zone) {
            var pos = Game.stage.getMousePosition();
            this.zoneDraft.setPosition(pos.x,pos.y);
        }
    },
    _addKeypoint: function(){
        if (this.newKeypoint.valid) {
            this.newKeypoint.setTextFill('blue');
            this.keypoints.push(this.newKeypoint);
            Game.mapObjects.remove(this.newKeypoint);
            Game.configObjects.add(this.newKeypoint);
            this._buildKeypoint();
            this._updateNewKeypoint();
            this._showNewKeypoint();
        }
    },
    _showNewKeypoint: function(){
        this.newKeypoint.show();
    },
    _hideNewKeypoint: function(){
        this.newKeypoint.hide();
    },
    _updateNewKeypoint: function(){
        var pos = Game.stage.getMousePosition();
        this.newKeypoint.updatePosition(pos.x,pos.y);
    }

});