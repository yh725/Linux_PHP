<?
/*
	작성자 : 이연호
	작성일 : 2020-07-12
	내 용 : 데이터 처리 페이지
*/

//인클루드
include "/home/yhc1/public_html/dbcon.php";		// DB connect

if ($_POST['action_mode'] == "insert") {
	mysqli_select_db($my_con, 'ymd1') or die('DB 연결 실패');

	$sql = "select max(no) as mno
	          from BBS ";
	$result = mysqli_query($my_con, $sql);
	$v = mysqli_fetch_array($result);
	$max_no = $v['mno'] + 1;

	$sql = "insert into BBS(title, memo, name, passwd, i_time) values('".$_POST['title']."', '".$_POST['memo']."', '".$_POST['name']."', '".$_POST['passwd']."', '".date("Y-m-d")."')";

	$result = mysqli_query($my_con, $sql) or die($sql);
	if ($result) {
		echo "<script>alert('저장 완료하였습니다.')</script>";
		echo "<script>location.replace('index.php')</script>";
	}
}else if($_POST['passwdValue'] == "N") {
	mysqli_select_db($my_con, 'ymd1') or die('DB 연결 실패');
	$sql = "select count(1) as cnt
	          from BBS 
			 where no = ".$_POST['no']." and passwd = '".$_POST['passwd']."' ";
	
	$result = mysqli_query($my_con, $sql);
	$v = mysqli_fetch_array($result);

	if ($v['cnt'] > 0) {
		echo "success";
	}else {
		echo "fail";
	}
	
}else if ($_POST['action_mode'] == "update") {
	mysqli_select_db($my_con, 'ymd1') or die('DB 연결 실패');

	$sql = "update BBS set title='".$_POST['title']."', memo='".$_POST['memo']."', name='".$_POST['name']."', passwd='".$_POST['passwd']."' where no=".$_POST['no'] ;

	$result = mysqli_query($my_con, $sql) or die ("쿼리 에러");
	if ($result) {
		echo "<script>alert('업데이트 완료하였습니다.')</script>";
		echo "<script>location.replace('index.php')</script>";
	}
}else if ($_POST['action_mode'] == "delete") {
	mysqli_select_db($my_con, 'ymd1') or die('DB 연결 실패');
	
	$sql = "update BBS set save_status='N', d_time='".date("Y-m-d")."' where no=".$_POST['no'] ;

	$result = mysqli_query($my_con, $sql) or die ("쿼리 에러");
	if ($result) {
		echo "<script>alert('삭제 완료하였습니다.')</script>";
		echo "<script>location.replace('index.php')</script>";
	}
}else {
	echo "잘못된 접근입니다.";
	echo "<script>location.replace('index.php')</script>";
	
}

// DB close
mysqli_close($my_con);
exit;
?>