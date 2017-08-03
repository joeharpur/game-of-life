(function() {
     
    var canvas;
    var context;
    var width;
    var height;
    var interval_id;
    var form_element;
    var cell_colour = 'green';
    var grid_colour = 'gray';
    var curr_gen;
    var next_gen;
    var start =  false;
    var generation = 0;
    var cell_size = 10;
    var draw_speed = 50;

    document.addEventListener('DOMContentLoaded', init, false);

    function init() {    
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        // form_element = document.querySelector('form');
        width = canvas.width;
        height = canvas.height;
        // cell_size = document.getElementById("cell_size");
        // cell_size = cell_size.options[cell_size.selectedIndex].text;
        // console.log(cell_size);
        // draw_speed = document.getElementById("speed");
        // draw_speed = draw_speed.options[draw_speed.selectedIndex].text;
        // console.log(draw_speed);
        curr_gen = [];
        next_gen = [];
        populate_grid(curr_gen);
        populate_grid(next_gen);
        canvas.addEventListener('click', mouse_click, false);
        window.addEventListener('keydown', begin, false);
        window.addEventListener('keydown', end, false);
        // form_element.addEventListener('submit', init, false);
		clearInterval(interval_id);
        interval_id = window.setInterval(draw, draw_speed);
        
    }
    
    function draw() {
        context.clearRect(0, 0, width, height);
        if (start===true) {
            apply_life_rules(curr_gen, next_gen);
            for (var i=0; i<curr_gen.length; i++) {
                curr_gen[i] = next_gen[i].slice();
            }
            generation++;
        }     
        context.fillStyle = cell_colour;
        context.strokeStyle = grid_colour;
        for (var i=0; i<curr_gen.length; i++) {
            for (var j=0; j<100; j++) {
                context.strokeRect(i*cell_size, j*cell_size, cell_size, cell_size);
                if (curr_gen[i][j] === 1) {
                    context.fillRect(i*cell_size, j*cell_size, cell_size, cell_size);
                }
            }
        }

    } 

    function populate_grid(grid) {
        for (var i=0; i<200; i++) {
            grid.push([]);
            grid[i].push(new Array(100));

            for (var j=0; j<100; j++) {
                grid[i][j] = 0;
            }
        }   
    }

    function apply_life_rules(curr_gen, next_gen) {
        for (var i=1; i<199; i++) {
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
        x = Math.floor(x/cell_size);
        y = Math.floor(y/cell_size); 
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