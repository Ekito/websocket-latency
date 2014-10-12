var ctx = $("#latencyChart").get(0).getContext("2d");

var socket = io.connect(document.location.host);

var interval = 100;
var pingCount = 100;
var pings = [];

socket.on('connect', function() {

    //Listen pong message
    socket.on('pong', function (idx) {
        pings[idx].stop = new Date().getTime();
    });


});

var displayResults = function(pings){

    var latencies = pings.map(function(data){
        return data.stop - data.start;
    });

    console.log(latencies);

    var min = latencies.reduce(function(a, b) { return Math.min(a,b); });
    var max = latencies.reduce(function(a, b) { return Math.max(a,b); });
    var sum = latencies.reduce(function(a, b) { return a + b; });
    var avg = sum / latencies.length;

    console.log(min);
    console.log(max);
    console.log(sum);
    console.log(avg);

    console.log(latencies.keys());

    var labels = []
    for (var i = 0; i < 100; ++i)
        labels[i] = i;

    var data = {
        labels: labels,
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: latencies
            }
        ]
    };

    var myLineChart = new Chart(ctx).Line(data, {
        responsive: true,
        scaleShowGridLines : false,
        showXLabels : 10
    });

};

var runTest = function () {

    $('.btn').prop('disabled', true);
    $('#graph').addClass('hide');
    $("#knob").removeClass('hide');

    pings = [];
    var i = 0;

    //Send ping message every 100ms
    var pingInterval = setInterval(function () {

        if (i > pingCount) {
            clearInterval(pingInterval);
            $('#knob').addClass('hide');
            $('.dial')
                .val(0)
                .trigger('change');

            $('#graph').removeClass('hide');

            displayResults(pings);

            $('.btn').prop('disabled', false);

        }else {

            //Update the progress bar
            var progress = i * 100 / pingCount;
            $('.dial')
                .val(progress)
                .trigger('change');

            //Send ping
            pings[i] = {};
            pings[i].start = new Date().getTime();
            socket.emit('ping', i);

            i++;
        }
    }, interval);

}
