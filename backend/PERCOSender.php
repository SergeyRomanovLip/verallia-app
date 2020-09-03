<?php

header('Access-Control-Allow-Credentials: true');
include './config.php';
require './PHPMailer/src/Exception.php';
require './PHPMailer/src/PHPMailer.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

mysqli_set_charset($link, "utf8");

$todayUnix = floor($dateUnix / 86400);
$uploads_dir = 'photos/';
$request = $_POST;


if ($request['typeOfRequest'] == 'newRequest') {
    $recaptcha = $request['g-recaptcha-response'];
    if (!empty($recaptcha)) {
        makeNewRequest($request, $photos);
    } else {
        echo ('captchaFalse');
    }
}

function makeNewRequest($data)
{
    $id = md5(time());

    global $uploads_dir;
    global $_FILES;
    global $link;
    global $todayUnix;

    $date = $todayUnix;
    $email = $data['email'];
    $company = $data['company'];
    $cause = $data['cause'];
    $guests = (array) json_decode($data['guests'], true);

    foreach ($guests as &$guest) {
        $photoPath = '';
        foreach ($_FILES as $photo) {
            if ($guest['id'] === stristr($photo['name'], '.', true)) {
                $uploadfile = $uploads_dir . $id . '-' . $photo['name'];
                if (move_uploaded_file($photo['tmp_name'], $uploadfile)) {
                    $photoPath = $uploadfile;
                    echo "Image file is successfully loaded";
                } else {
                    echo "Image file not uploaded.";
                }
            }
        }
        $guest['photoPath'] = $photoPath;
    }

    $recaptcha = $_POST['g-recaptcha-response'];
    if (!empty($recaptcha)) {

        $mail = new PHPMailer(true);
        $mail_body = '
            <head>
            <style type="text/css">
            table {
                border: 1px solid black; 
                border-collapse: collapse;
            }
            tr {
                border: 1px solid black; 
                border-collapse: collapse;
            }
            td {
                border: 1px solid black; 
                border-collapse: collapse;
                padding: 3px;
            }
            </style>
            </head>
            <div>
        
        <table>
        <td>ФИО</td><td>Должность</td><td>Год рождения</td><td>Фотография</td>';
        var_dump($guests);
        foreach ($guests as $row) {
            $mail_body .= '<tr>';
            $mail_body .= '<td>'
                . $row['FIO']
                . '</td><td>'
                . $row['position']
                . '</td><td>'
                . $row['birthDate']
                . '</td><td><img style="width:100px; border-radius:10px" src="https://rsvisualstudio.ru/kamishibai/backend/'
                . $row['photoPath']
                . '"></td>';
            $mail_body .= '</tr>';
        }
        $mail_body .= '</table>';
        $guests = json_encode($guests);

        $requestWrite = "INSERT INTO PERCOSender (date, email, company, cause, guests) VALUES ('$date', '$email', '$company', '$cause', '$guests')";
        mysqli_query($link, $requestWrite);
        print_r($mail_body);
        try {
            $mail->CharSet = "utf-8";
            $mail->setFrom('info@rsvisualstudio.ru', 'Система приема заявок на пропуск');
            $mail->addAddress('nashe.dobrov@gmail.com');
            // if ($data['type'] == 'подрядчики на работы') {
            //     $mail->addAddress('nashe.dobrov@gmail.com');
            // } else if ($data['type'] == 'подрядчики на ознакомление') {
            //     $mail->addAddress('sergey.romanov.lip@yandex.ru');
            //     $mail->addAddress('nashe.dobrov@gmail.com');
            // }

            $mail->isHTML(true);
            $mail->Subject = 'Новая заявка на пропуск от ' . $data['email'];
            $mail->Body    = 'Добрый день! Прошу организовать пропуск сотрудников компании ' . $data['company'] . '<br><br>' . 'Дата приезда - ' . $data['date'] . '<br><br>' . $mail_body . '<br>' . '<b></b>Причина посещения - </b>' . $data['type'] . '<br> Комментарий - ' . $data['comment'];
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            $mail->send();
            echo 'Message has been sent';
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        echo ('captchaFalse');
    }
}
