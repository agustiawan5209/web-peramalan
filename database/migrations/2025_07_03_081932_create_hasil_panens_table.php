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
        Schema::create('hasil_panens', function (Blueprint $table) {
            $table->id();
            $table->string('bulan', 40);
            $table->string('kecamatan', 20)->nullable();
            $table->string('desa', 20)->nullable();
            $table->integer('tahun');
            $table->string('total_panen', 30)
                ->comment('Total panen dalam satuan kg');
            $table->json('jenisRumputLaut');
            $table->json('parameter')
                ->comment('Hasil panen dalam format JSON');
            $table->text('keterangan')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_panens');
    }
};
