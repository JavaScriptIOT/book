function angle_to_radian(angle)
{
    return (angle/360.0*(2*Math.PI));
}

function radian_to_angle(radian)
{
    return (radian*360.0/(2*Math.PI));
}

function rectangular(x,y,z)
{
	this.x = x ? x : 0;
	this.y = y ? y : 0;
	this.z = z ? z : 0;
}

function cylindroid(r,phi,z)
{
	this.r = r ? r : 0;
	this.phi = phi ? phi : 0;
	this.z = z ? z : 0;
}

rectangular.prototype.cylindroid = function() { 
    var r = Math.sqrt(this.x*this.x + this.y*this.y);
    var phi = Math.atan2(this.y, this.x);
    var z = this.z;
    return (new cylindroid(r,phi,z));
}

cylindroid.prototype.rectangular = function() { 
    var z = this.z;
    var y = this.r * Math.sin(this.phi);
    var x = this.r * Math.cos(this.phi);
    return (new rectangular(z,y,z));
}


var x1 = new rectangular(1,2,3)
var x2 = new rectangular(3,2,1)
console.log(x1.cylindroid())
function micorscope_run_to_coordinates() {}
function micorscope_get_coordinates() {
    return new rectangular()
}


var RADIUS = 1437;
var SAMPLES = 26;
var FIRST = 108;
function microscope_move_to_sample(index, ref_original, ref_angle)
{
    var target = new rectangular();
    var c = new cylindroid();
    var current = micorscope_get_coordinates();
    if(index > SAMPLES || index < 0)
        return ;
    if(index == 0)
    {
        target.x = 0;
        target.y = 0;
        target.z = current.z;
        micorscope_run_to_coordinates(target);
        return;
    }
    c.phi = angle_to_radian(-360.0/SAMPLES * index-1 + ref_angle + FIRST);
    c.r   = RADIUS;
    c.z   = current.z;
    target =  c.rectangular();
    target.x += ref_original.x;
    target.y += ref_original.y;
    target.z += ref_original.z;
    micorscope_run_to_coordinates(target);
    console.log("x = %d, y = %d, z = %d\n", target.x, target.y, target.z);
}

microscope_move_to_sample(1,{x:1,y:2,z:3}, 15)