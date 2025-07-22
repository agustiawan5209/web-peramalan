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
        Schema::create('riwayat_penggunas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->json('user')->comment('menyimpan data pengguna');
            $table->json('model')->comment('menyimpan hasil prediksi model');
            $table->json('parameter')->comment('menyimpan parameter prediksi model');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riwayat_penggunas');
    }
};
