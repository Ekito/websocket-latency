//var ctx = $("#latencyChart").get(0).getContext("2d");

var socket = io.connect(document.location.host);

var interval = 100;
var pingCount = 100;
var wsPings = [];
var httpPings = [];

socket.on('connect', function() {

    //Listen pong message
    socket.on('pong', function (idx) {
        wsPings[idx].stop = new Date().getTime();
    });


});

var displayResults = function(wsPings, httpPings){

    var wsLatencies = wsPings.map(function(data){
        return data.stop - data.start;
    });

    var httpLatencies = httpPings.map(function(data){
        return data.stop - data.start;
    });

    var wsMin = wsLatencies.reduce(function(a, b) { return Math.min(a,b); });
    var wsMax = wsLatencies.reduce(function(a, b) { return Math.max(a,b); });
    var wsSum = wsLatencies.reduce(function(a, b) { return a + b; });
    var wsAvg = wsSum / wsLatencies.length;

    var httpMin = httpLatencies.reduce(function(a, b) { return Math.min(a,b); });
    var httpMax = httpLatencies.reduce(function(a, b) { return Math.max(a,b); });
    var httpSum = httpLatencies.reduce(function(a, b) { return a + b; });
    var httpAvg = httpSum / httpLatencies.length;

    console.log('wsMin : ' + wsMin);
    console.log('wsMax : ' + wsMax);
    console.log('wsAvg : ' + wsAvg);

    console.log('httpMin : ' + httpMin);
    console.log('httpMax : ' + httpMax);
    console.log('httpAvg : ' + httpAvg);

    $('#minLatency')[0].innerHTML = 'Min : ' + wsMin + '/' + httpMin;
    $('#maxLatency')[0].innerHTML = 'Max : ' + wsMax + '/' + httpMax;
    $('#avgLatency')[0].innerHTML = 'Average : ' + wsAvg + '/' + httpAvg;

    var i = 1;
    var latenciesData = wsLatencies.map(function(data){
        result = [i, data, httpLatencies[i -1]];
        i++;
        return result;
    });

    g2 = new Dygraph(document.getElementById("graph"),
        latenciesData,
        {
            labels: [ "x", "Websocket latency", "Http latency" ]
        });

};

var runTest = function () {

    $('.btn').prop('disabled', true);
    $('#graph').addClass('hide');
    $("#knob").removeClass('hide');

    wsPings = [];
    httpPings = [];
    var i = 0;

    //Send ping message every 100ms
    var pingInterval = setInterval(function () {

        if (i > pingCount) {
            clearInterval(pingInterval);

            //Wait 1 seconde to get the latest ws response
            setTimeout(function() {
                $('#knob').addClass('hide');
                $('.dial')
                    .val(0)
                    .trigger('change');

                $('#graph').removeClass('hide');

                displayResults(wsPings, httpPings);

                $('.btn').prop('disabled', false);

            },1000);

        }else {

            //Update the progress bar
            var progress = i * 100 / pingCount;
            $('.dial')
                .val(progress)
                .trigger('change');

            //Send ping
            wsPings[i] = {};
            wsPings[i].start = new Date().getTime();
            socket.emit('ping', i);

            httpPings[i] = {};
            httpPings[i].start = new Date().getTime();
            $.get('/ping', { 'index' : i }, function(data){
              httpPings[data.index].stop = new Date().getTime();
            })

            i++;
        }
    }, interval);

}
