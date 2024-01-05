# Super Simple Node TcpServer
Tcp-Server based on NodeJs. Can be used as a CLI-Tool.
Supports multiple clients.

# Options
- -h or -help => Parameter Informations
- -ip [string] => Set Ip-Address
- -p [int] => Set Port
- -echo [0 or 1] => Enable Echo-Mode
- -auto [0 or 1] => Sending repeatly a message
- -msg [string]  => Message Text
- -interval [int] => Interval for auto sending

# Usage
`node simpleTcpServer.js -ip 0.0.0.0 -p 8000 -echo 1`

