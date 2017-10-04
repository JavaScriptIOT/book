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

function angle_to_radian(angle)
{
    return (angle/360.0*(2*Math.PI));
}

function radian_to_angle(radian)
{
    return (radian*360.0/(2*Math.PI));
}


function distance(x, y) {

	var delta_x = x.x-y.x;
	var delta_y = x.y-y.y;
	var delta_z = x.z-y.z;
	return (Math.sqrt(delta_x * delta_x + delta_y * delta_y + delta_z * delta_z));

}

function microscope_original_angle(ref_point) 
{
    var original = {};
    var angle;
    var d =  new Array(3);
    var org_x, org_y;
    var x, y;
    d[0] = distance(ref_point[0], ref_point[1]);
    d[1] = distance(ref_point[1], ref_point[2]);
    d[2] = distance(ref_point[2], ref_point[0]);
    if (d[2] > d[1] && d[2] > d[0])
    {
    	org_x  = (ref_point[0].x+ref_point[2].x) /2;
    	org_y =  (ref_point[0].y+ref_point[2].y) /2;
    } else if (d[1] > d[0] && d[1] > d[2])
    {
    	org_x  = (ref_point[1].x+ref_point[2].x) /2;
    	org_y =  (ref_point[1].y+ref_point[2].y) /2;
    }
    else
    {
    	org_x  = (ref_point[0].x+ref_point[1].x) /2;
     	org_y =  (ref_point[0].y+ref_point[1].y) /2;
    }
    original.x = org_x;
    original.y = org_y;
    if (d[2] < d[1] && d[2] < d[0])
    {
    	x = (ref_point[0].y+ref_point[2].y)/2 - org_x;
    	y = (ref_point[0].x+ref_point[2].x)/2 - org_y;
     	angle = radian_to_angle(Math.atan2(y,x));
    }
    else if (d[1] < d[0] && d[1] < d[2])
    {
     	x = (ref_point[1].y+ref_point[2].y)/2 - org_x;
     	y = (ref_point[1].x+ref_point[2].x)/2 - org_y;
     	angle = radian_to_angle(atan2(y,x));
    }
    else
    {
     	x = (ref_point[0].y+ref_point[1].y)/2 - org_x;
     	y = (ref_point[0].x+ref_point[1].x)/2 - org_y;
     	angle = radian_to_angle(Math.atan2(y,x));
    }
    return {
        original: original,
        angle: angle
    };
}

var x1 = new rectangular(1,2,3);
var x2 = new rectangular(1,2,3);
var x3 = new rectangular(1,2,3);

console.log(microscope_original_angle([x1,x2,x3]))
