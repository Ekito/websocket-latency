var socket = io.connect(document.location.host);

var interval = 100;
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
    //delete latencies[1];
    console.log(latencies);

    var min = latencies.reduce(function(a, b) { return Math.min(a,b); });
    var max = latencies.reduce(function(a, b) { return Math.max(a,b); });
    var sum = latencies.reduce(function(a, b) { return a + b; });
    var avg = sum / latencies.length;

    console.log(min);
    console.log(max);
    console.log(sum);
    console.log(avg);

};

var runTest = function () {

    $('.btn').prop('disabled', true);
    $('.progress-bar').css('animation', '0.2s linear 0s normal none infinite progress-bar-stripes')
    $('.progress-bar').removeClass('progress-bar-success').css('width', '0%').attr('aria-valuenow', 0);

    pings = [];
    var i = 1;

    //Send ping message every 100ms
    var pingInterval = setInterval(function () {

        if (i > 100) {
            clearInterval(pingInterval);
            $('.progress-bar').addClass('progress-bar-success').css('width', '100%').attr('aria-valuenow', 100);
            $('.btn').prop('disabled', false);
            displayResults(pings);
        }else {

            //Update the progress bar
            var progress = i * interval / 100;
            $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);

            //Send ping
            pings[i] = {};
            pings[i].start = new Date().getTime();
            socket.emit('ping', i);

            i++;
        }
    }, interval);

}
