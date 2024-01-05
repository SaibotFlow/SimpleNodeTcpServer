const { Console } = require("console");
var net = require("net");
const internal = require("stream");
let ip = "0.0.0.0";
let port = 8000;
let enableSending = false;
let sendingIntervallinSeconds = 10;
let messageToSend = "Hello Client!";
let echoMode = false;

var args = process.argv.slice(2);

if (args.includes("-h") || args.includes("-help") || args.includes("--help"))
{
    console.log("########################################################################################################")
    console.log("");
    console.log("\t -p [port]\t\tDefines the port to open the listener\t\tDefault: 8000");
    console.log("\t -ip [IP]\t\tDefines the Ip-Address to open the listener\tDefault: 0.0.0.0");
    console.log("\t -auto [1 or 0]\t\tEnables automatic sending of a message\t\tDefault: 0");
    console.log("\t -msg [text]\t\tDefines message which should be send\t\tDefault: Hello Client!");
    console.log("\t -interval [int]\tInterval (seconds) for sending the messsage\tDefault: 10");
    console.log("\t -echo [1 or 0]\t\tEnable / Disable echo mode\t\t\tDefault: 0");
    console.log("");
    console.log("########################################################################################################")
    return;
}

for(var i = 0; i <= args.length -1; i=i+2)
{
   switch(args[i])
   {
    case '-ip':
        if (net.isIP(args[i+1]) != 0)
        {
            ip = args[i+1];
        }
        else
        {
            console.error("IP Address is not a valid IP");
            return;
        }
        break;
    case '-p':
        var val = Number(args[i+1]);
        if (typeof(val) == 'number' && args[i+1] < 65536 && !isNaN(val))
        {
            port = args[i+1];
        }
        else
        {
            console.error("Port is not a number or bigger than 65.535");
            return;
        }
        break;
    case '-interval':
        var val = Number(args[i+1]);
        if (typeof(val) == 'number' && !isNaN(val))
        {
            sendingIntervallinSeconds = args[i+1];
        }
        else
        {
            console.error("Interval is not a number");
            return;
        }
        break;
    case '-auto':
        if (args[i+1] == 0 || args[i+1] == 1)
        {
            
            enableSending = args[i+1];
        }
        else
        {
            console.error("-auto only accepts 0 or 1 as value");
            return;
        }
        break;
    case '-msg':
        if (args[i+1] != null || args[i+1] != '')
            messageToSend = args[i+1];
        break;
    case '-echo':
        if (args[i+1] == 0 || args[i+1] == 1)
        {
            echoMode = args[i+1];
        }
        else
        {
            console.error("-echo only accepts 0 or 1 as value");
            return;
        }
        break;
    default:
        console.log("Parameter: "+args[i] +" is unknown and will be ignored. Use -h or -help for more info");
   }
}

var connections = [];
var autoSender = [];

var server = net.createServer(function(socket) {
    console.log("Client connected: "+socket.address().address+":"+socket.address().port);
	
    if (!connections.includes(socket))
    {
        connections.push(socket);
        if (enableSending == 1)
        {   
            console.log("Start auto sending for client: "+socket.address().address+":"+socket.address().port);
            console.log("Interval: "+sendingIntervallinSeconds+"s");
            console.log("Repeating message is: "+messageToSend);
            var sender = setInterval(function() {
                console.log("Sending message to client: "+ socket.address().address+":"+socket.address().port);
                socket.write(messageToSend);
            },sendingIntervallinSeconds*1000);
            autoSender.push({"socket":socket,"sender":sender});
        }
        else if (echoMode == 1)
        {   
            socket.on("data",function(data)
            {   
                console.log('Received: '+ data);
                console.log("Sending echo...");
                socket.write(data);
            });
        }
        socket.on('close', function() {
            var socketIndex = connections.indexOf(socket);
            connections.splice(socketIndex,1);
            autoSender.forEach(element => {
                if (element.socket == socket)
                {
                    console.log("Delete auto sender");
                    clearInterval(element.sender);
                }
            });
            console.log("Connection closed");
        });
    }
});
server.listen(port, ip);
console.log("Server is listening on: "+ip+":"+port);