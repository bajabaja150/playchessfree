<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {
	protected $allConnections;
	protected $connectionPairs;
	protected $blackQueue;
	protected $whiteQueue;
	public function __construct() {
		$this->allConnections = array();
		$this->connectionPairs = array();
		$this->whiteQueue = new \SplDoublyLinkedList();
		$this->blackQueue = new \SplDoublyLinkedList();
		$this->queues = array('white'=>$this->whiteQueue,'black'=>$this->blackQueue);
		$this->db = mysqli_connect("localhost","baja","baja1997","chess_db");
		echo "Server started\n";
	}

	public function onOpen(ConnectionInterface $conn) {
		
		$query=$conn->httpRequest->getUri()->getQuery();
		parse_str($query, $queryParams);

		if (!isset($queryParams['token'])) {
			echo "Token is not set\n";
			$conn->close();
			return;
		}

		$token = $queryParams['token'];
		$query = "SELECT * FROM user WHERE ws_token='$token';";
		$res = mysqli_query($this->db, $query);
		if(mysqli_num_rows($res) == 1) {
			$user = mysqli_fetch_assoc($res);
			$conn->userId = $user['id'];
			echo $conn->userId." logging in\n";
			$query = "UPDATE players_online SET total = total + 1;";
			$res = mysqli_query($this->db, $query);
			$this->allConnections[$conn->userId] = $conn;
			$this->sendToEveryOne('{"playersOnline":'.$this->getOnlinePlayersCount().'}');
		}else{
			echo "Token is not valid\n";
			$conn->close();
		}
			
	}

	public function onMessage(ConnectionInterface $from, $msg) {
		$id = $from->userId;
		echo "Recieved ".$msg." from ".$id."\n";
		$json = json_decode($msg, true);
		if (isset($json['color'])) {
			if (isset($from->inQueue) && $from->inQueue == true) {
				return;
			}
			$color = $json['color'];
			$this->connectionPairs[$id]=array("me"=>$from,"opponent"=>null,"exit"=>false);
			if (($color == "white" && !$this->queues['black']->isEmpty()) || ($color=="black" && !$this->queues['white']->isEmpty())) {
				if ($color == "white") {
					$opponentId = $this->queues['black']->shift();
				}else{
					$opponentId = $this->queues['white']->shift();
				}
				$this->allConnections[$opponentId]->inQueue=false;
				$from->send('{"found":'.$opponentId.'}');
				$this->connectionPairs[$opponentId]["me"]->send('{"found":'.$id.'}');
				$this->connectionPairs[$id]["opponent"]=$this->connectionPairs[$opponentId]["me"];
				$this->connectionPairs[$opponentId]["opponent"]=$this->connectionPairs[$id]["me"];
				$from->opponentId = $opponentId;
				$this->connectionPairs[$opponentId]["me"]->opponentId = $id;
				echo "Game between ".$id." and ".$opponentId." is started.\n";
			} else {
				$from->send('{"status":"waitingOpponent"}');
				$this->queues[$color]->push($id);
				$from->inQueue = true;
				echo "OK. Now in queue.\n";
			}
		} else if (isset($json['cancel'])) {
			$from->send('{"status":"canceled"}');
			$this->removeFromQueues($from);
		} else if (isset($json['exit'])) {
			$this->connectionPairs[$id]["exit"] = true;
			if ($this->connectionPairs[$id]["exit"] && $this->connectionPairs[$from->opponentId]["exit"]) {
				echo "Breaking connection between ".$id." and ".$from->opponentId.".\n";
				$this->connectionPairs[$id]["opponent"]=null;
				$this->connectionPairs[$from->opponentId]["opponent"]=null;
			}
		} else if (isset($json['acceptRematch'])) {
			$this->connectionPairs[$id]["opponent"]=$this->connectionPairs[$from->opponentId]["me"];
			$this->connectionPairs[$from->opponentId]["opponent"]=$this->connectionPairs[$id]["me"];
			$this->connectionPairs[$id]["exit"]=false;
			$this->connectionPairs[$from->opponentId]["exit"]=false;
			$this->sendToOpponent($from, $msg);
		} else {
			$this->sendToOpponent($from, $msg);
		}
	}

	public function onClose(ConnectionInterface $conn) {
		echo $conn->userId." logging out\n";
		$query = "UPDATE players_online SET total = total - 1;";
		$res = mysqli_query($this->db, $query);
		unset($this->allConnections[$conn->userId]);	
		$this->sendToEveryOne('{"playersOnline":'.$this->getOnlinePlayersCount().'}');
		$this->removeFromQueues($conn);
		$this->sendToOpponent($conn, '{"logout":'.$conn->userId.'}');
		echo "Goodbye\n";
	}

	public function onError(ConnectionInterface $conn, \Exception $e) {
		echo "An error has occurred: {$e->getMessage()}\n";
		$conn->close();
	}
	
	private function removeFromQueues(ConnectionInterface $conn) {
		if (isset($conn->inQueue)&&$conn->inQueue==true) {
			$conn->inQueue = false;
			for ($i = 0; $i < $this->whiteQueue->count(); $i++) {
				if ($this->whiteQueue->offsetGet($i) == $conn->userId) {
					$this->whiteQueue->offsetUnset($i);
					break;
				}
			}
			for ($i = 0; $i < $this->blackQueue->count(); $i++) {
				if ($this->blackQueue->offsetGet($i) == $conn->userId) {
					$this->blackQueue->offsetUnset($i);
					break;
				}
			}
		}
	}
	private function sendToOpponent(ConnectionInterface $conn, $msg) {
		if (isset($this->connectionPairs[$conn->userId])) {
			if (isset($this->connectionPairs[$conn->userId]["opponent"])) {
				$this->connectionPairs[$conn->userId]["opponent"]->send($msg);
			}
		}
	}
	private function sendToEveryOne($msg) {
		foreach($this->allConnections as $cn) {
			$cn->send($msg);
		}
	}
	private function getOnlinePlayersCount() {
		$query = "SELECT total FROM players_online";
		$res = mysqli_query($this->db, $query);
		$players_online = mysqli_fetch_assoc($res);
		return $players_online['total'];
	}
}
