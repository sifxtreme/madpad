$(function(){
    var iosocket = io.connect();
    iosocket.on('connect', function () {
        iosocket.on('message', function(message) {
            var textbox = $("#box").get(0);
            var currentValue = $("#box").val();

            var currentLocation = getSelectionInfo(textbox);
            
            $('#box').val(message);

            textbox.selectionStart = currentLocation.start;
            textbox.selectionEnd = currentLocation.end;
            textbox.focus();

        });
    });

    $('#box').bind('input propertychange', function() {
        var message = $("#box").val();
        // iosocket.emit('send', { room: "{{id}}", message: message });
        iosocket.send(message);
    });

    function getSelectionInfo (element) {
        var props = {};
        
        props.start  = element.selectionStart;
        props.end    = element.selectionEnd;
        props.length = props.end - props.start;
        props.text   = element.innerHTML.substr(props.start, props.length);
        
        return props;
    };
});