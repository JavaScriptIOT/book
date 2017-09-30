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

function spheroid(r,phi,theta)
{
	this.r = r ? r : 0;
	this.phi = phi ? phi : 0;
	this.theta = theta ? theta : 0;
}

rectangular.prototype.cylindroid = function() { 
    var r = Math.sqrt(this.x*this.x + this.y*this.y);
    var phi = Math.atan2(this.y, this.x);
    var z = this.z;
    return (new cylindroid(r,phi,z));
}

rectangular.prototype.spheroid = function() { 

    var r = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    var phi = Math.atan2(this.y, this.x);
    var theta  = Math.atan2(Math.sqrt(this.x * this.x + this.y * this.y), this.z);
    return (new spheroid(r,phi,theta));
}


rectangular.prototype.distence =  function(input) {
    if (input instanceof rectangular) {
	var delta_x = this.x-input.x;
	var delta_y = this.y-input.y;
	var delta_z = this.z-input.z;
	return (Math.sqrt(delta_x * delta_x + delta_y * delta_y + delta_z * delta_z));
    } else {
        return null;
    } 
}

cylindroid.prototype.rectangular = function() { 
    var z = this.z;
    var y = this.r * Math.sin(this.phi);
    var x = this.r * Math.cos(this.phi);
    return (new rectangular(z,y,z));
}

cylindroid.prototype.spheroid = function() { 
    var r      = Math.sqrt(this.r * this.r + this.z * this.z);
    var phi    = this.phi;
    var theta  = Math.atan2(this.r, this.z);
    return (new spheroidr(r,phi,theta));
}

spheroid.prototype.cylindroid = function() { 
    var r     = this.r * Math.sin(this.theta);
    var phi   = this.phi;
    var z     = this.r * Math.cos(this.theta);
    return (new cylindroid(r,phi,z));
}

spheroid.prototype.rectangular = function() { 
    var x = this.r * sin(this.theta) * cos(this.phi);
    var y = this.r * sin(this.theta) * sin(this.phi);
    var z = this.r * cos(this.theta);
    return (new rectangular(x,y,z));
}

var x1 = new rectangular(1,2,3)
var x2 = new rectangular(3,2,1)
console.log(x1.cylindroid())
console.log(x1.spheroid())
console.log(x1.distence(x2))