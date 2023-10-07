
    function Vector(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    Vector.prototype.negative = function() {
        return new Vector(-this.x, -this.y, -this.z);
    }

    Vector.prototype.add = function(v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }

    Vector.prototype.subtract = function(v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }

    Vector.prototype.multiply = function(v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector(this.x * v, this.y * v, this.z * v);
    }

    Vector.prototype.divide = function(v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }
    
    Vector.prototype.equals = function(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    Vector.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    Vector.prototype.cross = function(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    Vector.prototype.length =  function() {
        return Math.sqrt(this.dot(this));
    }

    Vector.prototype.unit = function() {
        return this.divide(this.length());
    }

    Vector.prototype.min = function() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    Vector.prototype.max = function() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    Vector.prototype.toAngles = function() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length())
        };
    }

    Vector.prototype.angleTo = function(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    Vector.prototype.toArray = function(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    Vector.prototype.clone = function() {
        return new Vector(this.x, this.y, this.z);
    }

    Vector.prototype.init = function(x, y, z) {
        this.x = x; this.y = y; this.z = z;
        return this;
    }

    Vector.prototype.fromAngles = function(theta, phi) {
        return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
    }

    Vector.prototype.randomDirection = function() {
        return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
    }

    Vector.prototype.lerp = function(a, b, fraction) {
        return b.subtract(a).multiply(fraction).add(a);
    }

    Vector.prototype.fromArray = function(a) {
        return new Vector(a[0], a[1], a[2]);
    }

    Vector.prototype.angleBetween = function(a, b) {
        return a.angleTo(b);
    }