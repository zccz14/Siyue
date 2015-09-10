<?php require_once "db.php";
	$conn=new mysqli(DB_SERVERNAME,DB_USERNAME,DB_PASSWORD,"staff",DB_PORT);
	if($conn->connect_error){
		die($conn->connect_error);
	}
	$conn->set_charset(DB_CHARSERT);
	$sql = "select * from `2015`";
	$query=$conn->query($sql);
	
	class staff{
		var $idx;
		var $name,$sex;
		var $dept,$pos,$y_start,$y_end;
		var $tel,$qq;
		var $major,$class;
		var $hometown;
		function staff($data){
			$this->idx=$data['idx'];
			$this->name=$data['name'];
			$this->sex=$data['sex'];
			$this->dept=$data['dept'];
			$this->pos=$data['pos'];
			$this->y_start=$data['y_start'];
			$this->y_end=$data['y_end'];
			$this->tel=$data['tel'];
			$this->qq=$data['qq'];
			$this->major=$data['major'];
			$this->class=$data['class'];
			$this->hometown=$data['hometown'];
		}
	}
	$rtn=array();
	while($row=$query->fetch_assoc()){
		$temp=new staff($row);
		array_push($rtn,$temp);
	}
	echo '('.json_encode($rtn).')';
	$conn->close();
?>