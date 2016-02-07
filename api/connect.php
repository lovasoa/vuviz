<?php
/**
VUVIZ
Connection à la base de données
**/
$opts = array(
  PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
);
$BDD = new PDO("mysql:host=localhost;dbname=prefibcoti1", "prefibcoti1", "", $opts);
?>
