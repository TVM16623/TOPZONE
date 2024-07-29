<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('review', function (Blueprint $table) {
            $table->id(); // Tạo cột id tự động tăng
            $table->unsignedBigInteger('user_id');
            // $table->unsignedBigInteger('invoice_id');
            $table->foreignId('invoice_detail_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->integer('star');
            $table->string('reply')->nullable();
            $table->string('image')->nullable();
            $table->timestamps(); // Tạo các cột created_at và updated_at
            $table->softDeletes(); // Tạo cột deleted_at để sử dụng soft deletes

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review');
    }
};