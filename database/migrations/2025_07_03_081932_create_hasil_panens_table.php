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
            $table->string('bulan', 20);
            $table->integer('tahun');
            $table->string('total_panen', 30)
                ->comment('Total panen dalam satuan kg');
            $table->string('eucheuma_conttoni', 30);
            $table->string('gracilaria_sp', 30);
            $table->json('hasil_panen')
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
