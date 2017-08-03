(function() {
     
    var canvas;
    var context;
    var width;
    var height;
    var interval_id;
    var colour = 'green';
    var curr_gen;
    var next_gen;
    var start =  false;
    var generation = 0;

    document.addEventListener('DOMContentLoaded', init, false);

    function init() {    
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        curr_gen = [];
        next_gen = [];
        populate_grid(curr_gen);
        populate_grid(next_gen);
        window.addEventListener('click', mouse_click, false);
        window.addEventListener('keydown', begin, false);
        window.addEventListener('keydown', end, false);
		clearInterval(interval_id);
        interval_id = window.setInterval(draw, 40);
        
    }
    
    function draw() {
        context.clearRect(0, 0, width, height);
        if (start===true) {
            apply_life_rules(curr_gen, next_gen);
            for (var i=0; i<curr_gen.length; i++) {
                curr_gen[i] = next_gen[i].slice();
            }
        }     
        context.fillStyle = colour;
        for (var i=0; i<curr_gen.length; i++) {
            for (var j=0; j<100; j++) {
                if (curr_gen[i][j] === 1) {
                    context.fillRect(i*5, j*5, 5, 5);
                }
            }
        }

    } 

    function populate_grid(grid) {
        for (var i=0; i<100; i++) {
            grid.push([]);
            grid[i].push(new Array(100));

            for (var j=0; j<100; j++) {
                grid[i][j] = 0;
            }
        }   
    }

    function apply_life_rules(curr_gen, next_gen) {
        for (var i=1; i<99; i++) {
            for (var j=1; j<99; j++) {
                
                var neighbours = [curr_gen[i-1][j-1], curr_gen[i-1][j], curr_gen[i-1][j+1],
                                    curr_gen[i][j-1], curr_gen[i][j+1],
                                    curr_gen[i+1][j-1], curr_gen[i+1][j], curr_gen[i+1][j+1]]
                var count = 0;
                for (var k=0; k<neighbours.length; k++) {
                    if (neighbours[k] === 1) {
                        count++;
                    }
                }
                
                if (curr_gen[i][j]===1) { 
                    if (count < 2 || count > 3) {
                        next_gen[i][j] = 0;
                    } else {
                        next_gen[i][j]=1;
                    }

                } else {
                    if (count === 3) {
                        next_gen[i][j] = 1;
                    } else {
                        next_gen[i][j]=0;
                    }
                }   
            }
        }
             
      
    }

    function begin(event) {
        var keyCode = event.keyCode;
        if (keyCode === 32) {
            start = true;
        }   
    }

    function end(event) {
        var keyCode = event.keyCode;
        if (keyCode === 27) {
            start = false;
        }   
    }

    function mouse_click(event) {
        var x = event.x;
        var y = event.y;
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        x = Math.floor(x/5);
        y = Math.floor(y/5); 
        if (curr_gen[x][y]===0) {
            curr_gen[x][y]=1;
            return;
        }
        if (curr_gen[x][y]===1) {
            curr_gen[x][y]=0;
            return;
        }
    }

    
    
})();