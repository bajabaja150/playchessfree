<?php
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use MyApp\Chat;
use React\Socket\SocketServer;
use React\Socket\SecureServer;
use React\EventLoop\Factory;

require dirname(__DIR__) . '/vendor/autoload.php';

// Create the event loop
$loop = React\EventLoop\Loop::get();

// Create an unencrypted socket server on port 8080 (localhost)
$socket = new SocketServer('0.0.0.0:8080', [], $loop);

// Wrap it in a TLS (SSL) server using your certificate and key
$secureSocket = new SecureServer($socket, $loop, [
    'local_cert' => '/etc/letsencrypt/live/playchessfree.com/fullchain.pem',
    'local_pk'   => '/etc/letsencrypt/live/playchessfree.com/privkey.pem',
    'verify_peer' => false // Only for development; set this true for production with CA
]);

// Your Ratchet app
$server = new IoServer(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    $secureSocket,
    $loop
);

$server->run();
