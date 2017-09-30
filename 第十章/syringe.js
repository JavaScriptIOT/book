var STEP_MOTOR=0
var POSITITON_SENSNOR=0
var STUCK_STEP = 100
function get_position(){
    return 10;
}
function step_motor_move_step_forward(){}
function step_motor_move_step_back(){}
function syringe_stuck_check(){
    return false;
}

function syringe_forward_step(step)
{
    var i;
    for(i = 0; i < step; i++)
    {
        step_motor_move_step_forward(STEP_MOTOR);
        if (syringe_stuck_check())
        	return (step);
    }
    return (step);
}
function syringe_back_step(step)
{
    var i;
    for(i = 0; i < step; i++)
    {
        step_motor_move_step_back(STEP_MOTOR);
        if (syringe_stuck_check())
        	return (step);
    }
    return (step);
}

function syringe_run_forward(syringe_target)
{
    var i=0;
    var position = get_position(POSITITON_SENSNOR);
    console.log("syringe_target = %d\n", syringe_target);
    while(position > syringe_target) {
    	console.log("position = %d\n", position);
   	    step_motor_move_step_forward(STEP_MOTOR);
        if (get_position(POSITITON_SENSNOR) == position) {
        	i++;
        	if(i > STUCK_STEP)
        		return (0);
        } else {
        	i = 0;
        }
        position = get_position(POSITITON_SENSNOR);
    }
	console.log("position = %d\n", position);
    return (1);
}

function syringe_run_back(syringe_target)
{
    var i=0;
    var position = get_position(POSITITON_SENSNOR);
    console.log("syringe_target = %d\n", syringe_target);
    while(position > syringe_target) {
    	console.log("position = %d\n", position);
    	step_motor_move_step_back(STEP_MOTOR);
        if (get_position(POSITITON_SENSNOR) == position) {
        	i++;
        	if(i > STUCK_STEP)
        		return (0);
        } else {
        	i = 0;
        }
        position = get_position(POSITITON_SENSNOR);
    }
	console.log("position = %d\n", position);
    return (1);
}

syringe_run_back(100)
syringe_run_forward(100)