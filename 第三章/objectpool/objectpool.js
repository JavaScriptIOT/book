function ObjectPool(iLimit, fnConstructor) {
    this._aObjects =  new Array(iLimit);
        this._fnConstructor = fnConstructor;
        this._iLimit = iLimit;
        this._iSize = 0;
        this.obtain =  function () {
                var oTemp;
                if (this._iSize > 0) {
                        this._iSize--;
                        oTemp =  this._aObjects[this._iSize];
                        this._aObjects[this._iSize] =  null;
                        return oTemp;
                }
                 return fnConstructor();
        };
        this.recycle =  function (oRecyclable) {
                if (!oRecyclable  instanceof this._fnConstructor) {
                        throw new Error("Trying to recycle the wrong object for pool.");
                }
                if (this._iSize <  this._iLimit) {
                        this._aObjects[this._iSize] = oRecyclable;
                        this._iSize++;
                }  else {

                }
        };

        this.getSize =  function () {
                return this._iSize;
        };
}

function Point() {
        this.x =  0
        this.y = 0
}

var oPointPool = new ObjectPool(10, Point);

var oPoint1 = oPointPool.obtain();
var oPoint2 = oPointPool.obtain();

oPointPool.recycle(oPoint1);
oPointPool.recycle(oPoint2);
