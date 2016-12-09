$(function() {

        var source = null;
		var data = [];
		var retData = [];
		var	totalPoints = 100;


        function onDataReceived(series) {
            if(series !== undefined && series.data !== undefined){
                var dataJson = JSON.parse(series.data);
                var points = dataJson['data'].split(",");
                var p1 = parseInt(points[0]);
                var p2 = parseInt(points[1]);

                p1 = isNaN(p1)? 0 : p1;
                p2 = isNaN(p2)? 0 : p2;

                $("#p1").html(p1);
                $("#p2").html(p2);

                changeSegmentColor(p1, p2);

                if (data.length > 0)
                    if(data.length > totalPoints){
                        retData = retData.slice(1);
                        data = data.slice(1);
                    }

                    data.push([p1, p2]);

                    var res1 = [];
                    var res2 = [];
                    for (var i = 0; i < data.length; ++i) {
                        res1.push([i, data[i][0]])
                        res2.push([i, data[i][1]])
                    }
                    var pt1 = {
                        data: res1,
                        xaxis: 1
                    };
                    var pt2 = {
                        data: res2,
                        xaxis: 2
                    };
                    retData = [pt1, pt2];
            }
        }

        function changeSegmentColor(p1, p2){
            p1 = p1 - 3000;
            p2 = p2 - 3000;
            p1 = p1 < 0 ? 0 : p1;
            p2 = p2 < 0 ? 0 : p2;

            p1 = p1 * 2;
            p2 = p2 * 2;
            p1 = p1 > 255 ? 255 : p1;
            p2 = p2 > 255 ? 255 : p2;

            console.log(p1,p2);
            $("#seg1").css("background","rgb("+p1+", 0, 0)");
            $("#seg2").css("background","rgb("+p2+", 0, 0)");

        }

		function getFlexoData(){
                    if (!!window.EventSource) {
                            //source = new EventSource("v1/devices/events?access_token=fdf602d824c35aeb1a821e436d009037b0c6970d");
                            source = new EventSource("https://api.particle.io/v1/devices/events?access_token=fdf602d824c35aeb1a821e436d009037b0c6970d");

                        source.onmessage = function (e) {
                          // a message without a type was fired
                          console.log("on message");
                          console.log(e);
                        };

                        source.addEventListener("open", function(e) {
                            console.log("Connection was opened.");
                            console.log(e)
                        }, false);

                        source.addEventListener("DEBUG", function(e) {
                            onDataReceived(e);
                        }, false);
                    } else {
                        console.log("Your browser does not support Server-sent events! Please upgrade it!");
                    }

                    return [{"data":[[100,3000]],"xaxis":1},{"data":[[100,3000]],"xaxis":2}];
        		}

		// Set up the control widget

		var updateInterval = 100;
		$("#updateInterval").val(updateInterval).change(function () {
			var v = $(this).val();
			if (v && !isNaN(+v)) {
				updateInterval = +v;
				if (updateInterval < 1) {
					updateInterval = 1;
				} else if (updateInterval > 2000) {
					updateInterval = 2000;
				}
				$(this).val("" + updateInterval);
			}
		});

		var plot = $.plot("#placeholder",  getFlexoData() , {
			series: {
				shadowSize: 0	// Drawing is faster without shadows
			},
			yaxis: {
				min: 2850,
				max: 3200
			},
			xaxis: {
                min: 0,
                show: false
			}
		});
		$("canvas").css("width", "100%");

		function update() {

			plot.setData(retData);
			// Since the axes don't change, we don't need to call plot.setupGrid()
			plot.draw();
			setTimeout(update, updateInterval);
		}
		update();
	});