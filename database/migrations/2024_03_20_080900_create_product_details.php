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
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->references('id')->on('products');
            $table->foreignId('color_id')->references('id')->on('colors');
            $table->foreignId('type_id')->nullable()->references('id')->on('types');
            $table->string('sku', 255);
            $table->unsignedInteger('price');
            $table->unsignedInteger('stock');
            $table->text('specifications'); // thông số kỹ thuật
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_details');
    }
};
