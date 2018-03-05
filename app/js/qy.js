var Qy = function (opt) {
  this.dataLists = opt.data;
  this.nowProgress = 0;
  this.allProgress = opt.data.length;
  this.allType = opt.allType;
  this.loading = opt.loading;
  this.complate = opt.complate;
  this._dataLists = [];
  this.init();
}
Qy.prototype.init = function () {
  this._setData();
  //console.log(this._dataLists);
  this._load();
}
// 初始化需要加载的队例
Qy.prototype._setData = function () {
  var me = this;
  this
      .dataLists
      .forEach(function (e) {
          var _url = e.url || e;
          var _type = me._getType(_url);
          me
              ._dataLists
              .push({url: _url, type: _type});
      })
}
// 获取加载url的类型
Qy.prototype._getType = function (u) {
  var _type = (u.match(/[^\.]+$/)[0]);
  var _result = null;
  for (var key in this.allType) {
      if (this.allType[key].join(',').indexOf(_type) !== -1) {
          _result = key;
          break;
      } else {
          _result = 'notsupport';
      }
  }
  return _result;
}
// 加载队列
Qy.prototype._load = function () {
  var _this = this;
  this
      ._dataLists
      .forEach(function (e, i, o) {
          if (e.type !== 'notsupport') {
              // image
              switch (e.type) {
                  case 'image':
                      _this._loadImage(e);
                      break;
                  case 'json':
                      _this._json(e);
                      break;
                  case 'audio':
                      _this._audio(e);
                      break;
              }
          } else {
              console.log('not support');
              _this.nowProgress++;
              _this._loading();
          }
      });
}
// 加载图片
Qy.prototype._loadImage = function (o) {
  var _this = this;
  var i = new Image();
  i.src = o.url;
  i.onload = function () {
      _this._loading();
  }
  i.onerror = function () {
      _this._error();
  }
}
// ajax资源
Qy.prototype._get = function (o, type) {
  var _this = this;
  var _xhr = new XMLHttpRequest();
  _xhr.open('post', o.url, true);
  _xhr.responseType = type;
  _xhr.send();
  _xhr.onload = function (e) {
      _this._loading();
  };
  _xhr.onerror = function (e) {
      _this._error();
  };
}
// 加载json
Qy.prototype._json = function (o) {
  this._get(o, 'json');
}

// 加载audio
Qy.prototype._audio = function (o) {
  var _this = this;
  var audio = new Audio(o.url);
  audio.oncanplaythrough = function(){
      _this._loading();
  }
}

// 加载完一个的时候回调
Qy.prototype._loading = function () {
  this.nowProgress++;
  this.loading && this.loading({nowProgress: this.nowProgress, allProgress: this.allProgress});
  this._complate();
}
//全部加载完的时候回调
Qy.prototype._complate = function () {
  this.complate && this.nowProgress == this.allProgress && this.complate();
}

Qy.prototype._error = function (e) {
  console.log(e);
}
module.exports = Qy;