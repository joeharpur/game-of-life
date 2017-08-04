(function() {
     
    //initialise variables 
    var canvas;
    var context;
    var width;
    var height;
    var interval_id;
    var cell_colour = 'green';
    var grid_colour = 'gray';
    var curr_gen;
    var next_gen;
    var start =  false;
    var generation = 0;
    var cell_size = 10;
    var draw_speed = 50;

    document.addEventListener('DOMContentLoaded', init, false);
    //wait until DOM content is loaded before calling init

    function init() {    
        //define variables
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        curr_gen = [];
        next_gen = [];
        //populate 2d grid for current generation and next generation
        populate_grid(curr_gen);
        populate_grid(next_gen);
        canvas.addEventListener('click', mouse_click, false);//listen for mouse click
        window.addEventListener('keydown', begin, false);//listen for start button 
        window.addEventListener('keydown', end, false);//listen for finish button
		clearInterval(interval_id);
        interval_id = window.setInterval(draw, draw_speed);
        //call draw function once every draw_speed milliseconds  
    }
    
    function draw() {
        //for canvas animation
        context.clearRect(0, 0, width, height);//clear grid
        if (start===true) {
            apply_life_rules(curr_gen, next_gen);
            //if start button is pressed apply game rules
            for (var i=0; i<curr_gen.length; i++) {
                curr_gen[i] = next_gen[i].slice();
                //once rules are applied to next gen, assign copy of next gen to curr gen
            }
            generation++;
        }     
        context.fillStyle = cell_colour;
        context.strokeStyle = grid_colour;
        for (var i=0; i<curr_gen.length; i++) {
            for (var j=0; j<100; j++) {
                context.strokeRect(i*cell_size, j*cell_size, cell_size, cell_size);//draw grid lines
                if (curr_gen[i][j] === 1) {
                    context.fillRect(i*cell_size, j*cell_size, cell_size, cell_size);
                    //draw cell if it has a value of 1 (alive)
                }
            }
        }
    } 

    function populate_grid(grid) {
        //create an array of arrays, each element(cell) having an inital value of 0 (dead)
        for (var i=0; i<100; i++) {
            grid.push([]);
            grid[i].push(new Array(40));

            for (var j=0; j<40; j++) {
                grid[i][j] = 0;
            }
        }   
    }

    function apply_life_rules(curr_gen, next_gen) {
        //Conways Game of Life Rules:
        //1. Any live cell with less than 2 live neighbours dies as if by isolation
        //2. Any live cell with more than 3 live neighbours dies as if by overcrowding
        //3. Any live cells with 2 or 3 live neighbours lives on to the next generation
        //4. Any dead cell with exactly 3 live neighbours is alive in next generation as if by reproduction
        for (var i=1; i<99; i++) {
            for (var j=1; j<39; j++) {
                //loop excludes cells at the grid edge
   
                var neighbours = [curr_gen[i-1][j-1], curr_gen[i-1][j], curr_gen[i-1][j+1],
                                    curr_gen[i][j-1], curr_gen[i][j+1],
                                    curr_gen[i+1][j-1], curr_gen[i+1][j], curr_gen[i+1][j+1]]
                //Get value of cells 8 neighbours
                var live_neighbour_count = 0;
                for (var k=0; k<neighbours.length; k++) {
                    if (neighbours[k] === 1) {
                        live_neighbour_count++;
                        //Count how many are alive
                    }
                }
                
                if (curr_gen[i][j]===1) { 
                    //If cell in curr gen is alive
                    if (live_neighbour_count < 2 || live_neighbour_count > 3) {
                        //If it has less than 2 or more than 3 live neighbours
                        next_gen[i][j] = 0;
                        //Dies in next gen
                    } else {
                        next_gen[i][j]=1;
                        //Or else it survives to next gen
                    }

                } else {
                    //If cell in curr gen is dead
                    if (live_neighbour_count === 3) {
                        //If it has exactly 3 live neighbours
                        next_gen[i][j] = 1;
                        //Is alive in next gen
                    }
                }   
            }
        }   
    }

    function begin(event) {
        //If spacebar is pressed, start = true
        var keyCode = event.keyCode;
        if (keyCode === 32) {
            start = true;
        }   
    }

    function end(event) {
        //If esc is pressed, start = false
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
        //Get x and y of mouse click location in terms of cell positions 
        if (curr_gen[x][y]===0) {
            curr_gen[x][y]=1;
            return;//If cell under click is 0, change to 1
        }
        if (curr_gen[x][y]===1) {
            curr_gen[x][y]=0;
            return;//If cell under click is 1, change to 0
        }
    }  
    
})();