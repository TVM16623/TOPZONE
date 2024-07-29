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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users');
            $table->foreignId('payment_id')->references('id')->on('payments');
            $table->string('phone', 11);
            $table->string('name', 50);
            $table->string('address', 50);
            $table->string('city', 50);
            $table->string('district', 50);
            $table->string('sub_district', 50);
            $table->string('code', 20);
            $table->unsignedInteger('total')->default(0);
            $table->string('note', 255);
            $table->string('status', 50);
            // status: DA-DAT, DA-THANH-TOAN, DA-XAC-NHAN, DANG-GIAO, DA-HUY, DA-GIAO
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
