<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Topzone - Mã OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        p {
            margin-bottom: 10px;
        }

        .otp-code {
            font-size: 32px;
            color: #ff6600;
            margin-bottom: 30px;
        }

        .btn {
            display: inline-block;
            background-color: #ff6600;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
        }

        .btn:hover {
            background-color: #ff5500;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Topzone - Mã OTP</h1>
        <p>Cảm ơn bạn đã sử dụng ứng dụng Topzone. Dưới đây là mã OTP của bạn:</p>
        <p class="otp-code">{{$code}}</p>
        <p>Hãy sử dụng mã OTP này để xác thực tài khoản của bạn, mã có hiệu lực trong 15 phút.</p>
        <p>Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này.</p>
        <p>Xin cảm ơn!</p>
        <a href={{env('APP_URL')}} class="btn" style="color:#f5f5f5;">Truy cập Topzone</a>
    </div>
</body>
</html>
