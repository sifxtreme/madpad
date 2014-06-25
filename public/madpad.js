$(function(){
    var room = window.location.pathname;
    var iosocket = io.connect();
    iosocket.on('connect', function () {
        iosocket.emit('connection', room);

        iosocket.on('message', function(message) {
            var textbox = $("#box").get(0);
            var beforeMessage = $("#box").val();

            var beforeLocation = getSelectionInfo(textbox);

            var afterMessage = message;
            
            $('#box').val(afterMessage);

            var beforeLength = beforeMessage.length;
            var afterLength = afterMessage.length;

            // console.log(beforeLength + ', ' + afterLength);

            var offset = 0;
            if(beforeLength == afterLength){
                console.log("1");
                offset = 0;
            }
            else{
                var difference = Math.abs(beforeLength - afterLength);
                // change is made before the cursor
                if(beforeLocation.start + 1 == getOffset(beforeMessage.substring(0, beforeLocation.start + 1), afterMessage.substring(0, beforeLocation.start + 1))){
                    offset = 0;
                }
                // change is made before the cursor
                else{
                    if(beforeLength <= afterLength){
                        offset = difference;
                    }
                    if(beforeLength > afterLength){
                        offset = -1*difference;
                    }
                }
                
            }

            afterStartSelection = beforeLocation.start + offset;
            afterEndSelection = beforeLocation.end + offset;

            if(afterStartSelection != afterEndSelection){
                if(beforeMessage.substring(beforeLocation.start, beforeLocation.end) != afterMessage.substring(afterStartSelection, afterEndSelection)){
                    afterEndSelection = afterStartSelection;
                }
            }

            // selection has to equal the same thng from before to after

            textbox.selectionStart = afterStartSelection;
            textbox.selectionEnd = afterEndSelection;
            textbox.focus();

        });
    });

    $('#box').on('input propertychange', function() {

        var message = $("#box").val();
        iosocket.emit('send', { room: room, message: message });
        // iosocket.send(message);
    });

    function getSelectionInfo (element) {
        var props = {};
        
        props.start  = element.selectionStart;
        props.end    = element.selectionEnd;
        props.length = props.end - props.start;
        props.text   = element.innerHTML.substr(props.start, props.length);
        
        return props;
    };

    function getOffset (before, after){
        compareNum = 0;

        l = Math.min(before.length, after.length);
        for( i=0; i<l; i++) {
            if( before.charAt(i) == after.charAt(i)) compareNum++;
        }

        return compareNum;
    }
});