var gulp = require("gulp"),
    clean = require("gulp-clean"),
    imageResize = require("gulp-image-resize"),
    spritesmith = require("gulp.spritesmith");

var emojis = require("./shared/data/emojis.json");
var unicode = require("./shared/data/unicode.json");

gulp.task("emoji", function () {
    return gulp.src("./shared/img/emoji/*")
        .pipe(imageResize({
          width: 46,
          height: 46
        }))
        .pipe(gulp.dest("./tmp/"));
});

gulp.task("sprite", ["emoji"], function () {
  var spriteData = gulp.src("./tmp/*.png").pipe(spritesmith({
    imgName: "sprite.png",
    cssFormat: "json",
    cssTemplate: function (params) {
      var coll = params.items.reduce(function (c, item) {
        c[item.name] = {
          name: item.name,
          x: item.x,
          y: item.y
        };
        return c;
      }, {});

      Object.keys(emojis).forEach(function (k) {
        Object.keys(emojis[k]).forEach(function(emoji){
          coll[emoji].unicode = unicode[emoji];
          emojis[k][emoji] = coll[emoji];
        });
      });

      return JSON.stringify(emojis);
    },
    algorithm: "binary-tree",
    cssName: "sprite.json"
  }));
  spriteData.img.pipe(gulp.dest("./shared/img/"));
  return spriteData.css.pipe(gulp.dest("./shared/data"));
});

gulp.task("clean", ["emoji", "sprite"], function () {
    return gulp.src("./tmp", {read: false}).pipe(clean());
});

gulp.task("generate-sprite", ["emoji", "sprite", "clean"]);
