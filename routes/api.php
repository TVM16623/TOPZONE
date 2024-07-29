<?php

use App\Events\PublicChannelEvent;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\AuthController;
use App\Http\Controllers\Api\User\CartController;
use App\Http\Controllers\Api\User\MailController;
use App\Http\Controllers\Api\Admin\HomeController;
use App\Http\Controllers\Api\Admin\TypeController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\ColorController;
use App\Http\Controllers\Api\User\BannerController;
use App\Http\Controllers\Api\User\ReviewController;
use App\Http\Controllers\Api\User\AccountController;
use App\Http\Controllers\Api\User\AddressController;
use App\Http\Controllers\Api\User\InvoiceController;
use App\Http\Controllers\Api\Admin\OrderController as AdminInvoiceController;
use App\Http\Controllers\Api\User\PaymentController;
use App\Http\Controllers\Api\User\ProductController;
use App\Http\Controllers\Api\Admin\CommentController;
use App\Http\Controllers\Api\User\CategoryController;
use App\Http\Controllers\Api\Admin\SubCategoryController;
use App\Http\Controllers\Api\User\PromotionController;
use App\Http\Controllers\Api\User\ResetPasswordController;
use App\Http\Controllers\Api\Admin\StatisticController;
use App\Http\Controllers\Api\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\PromotionController as AdminPromotionController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;

Route::prefix('/auth')->group(function () {
    Route::prefix('/register')->group(function () {
        Route::post('/', [AuthController::class, 'register']);
        Route::post('/verify', [MailController::class, 'verifyRegister']);
    });

    Route::prefix('/login')->group(function () {
        Route::post('/', [AuthController::class, 'login']);
        Route::post('/gg-callback', [AuthController::class, 'handleLoginGoogle']);
    });

    Route::middleware(['checkToken'])->prefix('/account')->group(function () {
        Route::post('/get-info-user', [AuthController::class, 'handleGetInfoUser']);
    });

    Route::middleware(['checkToken'])->post('/logout', [AuthController::class, 'handleLogout']);
});

Route::post('/refresh-token', [AuthController::class, 'refresh']);
Route::prefix("reset-password")->controller(ResetPasswordController::class)->group(function () {
    Route::post('/', 'sendMail');
    Route::post('/{token}', 'reset');
});

// Route::middleware(['checkToken'])->prefix('user')->group(function () {
//     Route::
// });
// Route::prefix('/mail')->group(function () {
//     // Nhận code và kiểm tra code có hợp lệ không
//     Route::post('/verify/{code}', [MailController::class, 'verify']);
// });

Route::prefix('/category')->group(function () {
    Route::get('/', [CategoryController::class, 'getCategory']); // Lấy tất
    Route::get('/{slug}', [CategoryController::class, 'getDataByCategory']);
    Route::get('/subcategory/{slug}', [CategoryController::class, 'getDataBySubCategory']);
    Route::get('/product', [CategoryController::class, 'getProductByCategory']);
});

Route::prefix('/product')->group(function () {
    Route::get('/{slug}', [ProductController::class, 'getDataByProduct']);

    Route::prefix('/productdetail')->group(function () {
        Route::get('/{sku}', [ProductController::class, 'getDataByProductDetail']);
    });
    Route::post('/find', [ProductController::class, 'findByName']);
});

Route::prefix('/banner')->group(function () {
    Route::get('/', [BannerController::class, 'index']);
});

Route::middleware(['checkToken'])->prefix('/')->group(function () {
    Route::prefix('/user/address')->group(function () {
        Route::get('/', [AddressController::class, 'get']);
        Route::post('/create', [AddressController::class, 'create']);
        Route::post('/update', [AddressController::class, 'update']);
        Route::post('/delete', [AddressController::class, 'delete']);
        Route::get('/view/{id}', [AddressController::class, 'view']);
    });

    Route::prefix('user/information-account')->group(function () {
        Route::post('/update', [AccountController::class, 'update']);
        Route::post('/resetpassword', [AuthController::class, 'ResetPassWord']);
    });

    Route::prefix('/cart')->controller(CartController::class)->group(function () {
        Route::get('/', 'view');
        Route::post('/create', 'create');
        Route::post('/update', 'update');
        Route::post('/delete', 'delete');
    });
});

Route::prefix("directory")->middleware(['api'])->controller(AddressController::class)->group(function () {
    Route::get("/cities/{cityId?}", "getListCities");
    Route::get("/districts/{cityId}", "getListDistricts");
    Route::get("/wards/{districtId}", "getListWards");
});


Route::prefix("payment")->controller(PaymentController::class)->group(function () {
    Route::get("/", "view"); // Xem phương thức thanh toán
});


Route::prefix("invoice")->middleware(['checkToken'])->controller(InvoiceController::class)->group(function () {
    Route::get('/', "view"); // Xem hóa đơn
    Route::post("/create", "create");
    Route::post('/invoice-bank-pending', "getInvoiceBankPending");
    Route::get('/invoice-code-by-detail', 'getInvoiceCodeByDetail');
    Route::get('/invoice-load', 'getInvoiceProduct');
    Route::post('/invoice-cancel', 'CancelInvoice');
    Route::post('/update-invoice', 'updateInfoInvoice');
    Route::get('/invoice-id', 'getByInvoiceId');
});

Route::prefix("promotion")->controller(PromotionController::class)->group(function () {
    Route::get("/", "view"); // Xem mã khuyến mãi
    Route::post('/check/{code?}', 'check');
});


Route::prefix("review")->middleware(['checkToken'])->controller(ReviewController::class)->group(function () {
    Route::get('/review', 'index')->name('review');
    Route::post('/create', [ReviewController::class, 'CreateReview']);
    Route::get('/reviews', 'getDataReview');
    Route::get('/invoice/{invoiceDetailId}', 'getReviewsByInvoiceDetailId');
    Route::post('/delete', 'deleteReviewId');
    Route::post('/update', [ReviewController::class, 'update']);
});

Route::get('test', function () {

    event(new PublicChannelEvent('hello from Web.php'));

    return 'done';
});

# Middlaware auth:api: yêu cầu người dùng đã xác thực để truy cập route (Route ng dùng đã đăng nhập)


Route::prefix("/admin")->middleware('IsAdmin')->group(function () {
    Route::prefix('/')->group(function () {
        Route::get('/reports', [HomeController::class, "getReports"]);
        Route::get('/order-newest', [HomeController::class, "getOrderNewest"]);
        //Banner
        Route::get('/banner', [AdminBannerController::class, "index"]);
        Route::get('/banner/{slug}', [AdminBannerController::class, "show"]);
        Route::post('/banner/store', [AdminBannerController::class, "store"]);
        Route::post('/banner/delete', [AdminBannerController::class, "delete"]);
        //End Banner

        //Category
        Route::get('/categories', [AdminCategoryController::class, "index"]);
        Route::get('/categories/{slug}', [AdminCategoryController::class, "show"]);
        Route::post('/categories/store', [AdminCategoryController::class, "store"]);
        Route::post('/categories/delete', [AdminCategoryController::class, "delete"]);
        //End Category

        //Category
        Route::get('/subCategories', [SubCategoryController::class, "index"]);
        //End Category

        //User
        Route::get('/users', [UserController::class, "index"]);
        //End User

        //Promotion
        Route::get('/promotions', [AdminPromotionController::class, "index"]);
        Route::get('/promotions/{id}', [AdminPromotionController::class, "show"]);
        Route::post('/promotions/store', [AdminPromotionController::class, "store"]);
        Route::post('/promotions/delete', [AdminPromotionController::class, "delete"]);
        //End Promotion

        //Color
        Route::get('/colors', [ColorController::class, "index"]);
        Route::get('/colors/getAll', [ColorController::class, "getAll"]);
        Route::get('/colors/{id}', [ColorController::class, "show"]);
        Route::post('/colors/store', [ColorController::class, "store"]);
        Route::post('/colors/delete', [ColorController::class, "delete"]);
        //End Color

        //Type
        Route::get('/types', [TypeController::class, "index"]);
        //End Type

        //Product
        Route::get('/products', [AdminProductController::class, "index"]);
        Route::get('/products/{slug}', [AdminProductController::class, "show"]);
        Route::post('/products/store', [AdminProductController::class, "store"]);
        Route::post('/products/delete', [AdminProductController::class, "delete"]);
        //End Product

        //Invoice
        Route::get('/invoices', [AdminInvoiceController::class, "index"]);
        Route::get('/invoices/{id}', [AdminInvoiceController::class, "show"]);
        Route::post('/invoices/status', [AdminInvoiceController::class, "changeStatus"]);
        //End Invoice

        //Review
        Route::get('/reviews', [AdminReviewController::class, "index"]);
        Route::post('/review', [AdminReviewController::class, "reply"]);
        //End Review

        //Statistic
        Route::get('/statistic', [StatisticController::class, "index"]);
        //End Statistic
    });
});