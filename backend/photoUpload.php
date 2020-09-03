<?php

header('Access-Control-Allow-Credentials: true');
include './config.php';
mysqli_set_charset($link, "utf8");

$path = '/sitespace/Photos';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!@copy($_FILES['picture']['tmp_name'], $path . $_FILES['picture']['name']))
        echo 'Что-то пошло не так';
    else
        echo 'Загрузка удачна';
}
