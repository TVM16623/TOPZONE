<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Topzone - Thanks For Your Business!</title>
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdn.tailwindcss.com" rel="stylesheet">
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
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-2xl text-sky-700 font-bold text-center">{{env("APP_NAME")}}</h1>
        <h3 class="text-center text-base py-2">--- Hóa đơn mua hàng của bạn ---</h3>

        {{-- content --}}
        <table class="table-auto w-full">
            <thead class="border-b rounded-lg pd-2 bg-sky-500">
              <tr>
                <th class="text-start">ID</th>
                <th class="text-start">Name</th>
                <th class="text-start">Quantity</th>
                <th class="text-start">Price</th>
                <th class="text-start">Image</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b pb-10">
                <td class="px-6 py-4">1</td>
                <td class="px-6 py-4">iPhone 15 Pro Max</td>
                <td class="px-6 py-4">x5</td>
                <td class="px-6 py-4">16.000.600</td>
                <td class="px-6 py-4">
                  <img
                    src="https://cdn.tgdd.vn/Products/Images/42/305658/s16/iphone-15-pro-max-blue-1-2-650x650.png"
                    alt="anh-san-pham"
                    width="80"
                    class="m-auto"
                  >
                </td>
              </tr>
            </tbody>
          </table>
          {{-- End content --}}
          <p class="m-2">Phương thức thanh toán: COD</p>
          <a
          href={{env('APP_URL')}}
          class="text-white bg-blue-600 rounded-lg px-2 py-2 items-center hover:bg-blue-400"
          style="text-decoration: none"
          >Truy cập Topzone</a>
    </div>
</body>
</html>
