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
        // database/migrations/xxxx_create_model_storage_table.php
        Schema::create('model_storages', function (Blueprint $table) {
            $table->id();
            $table->json('indikator');
            $table->string('model_name'); // conttoni_basah, conttoni_kering, dll
            $table->text('model_json'); // Model topology (JSON)
            $table->text('weight_data')->nullable(); // Binary weights (base64 encoded)
            $table->json('normalization_params')->nullable(); // Parameter normalisasi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model_storages');
    }
};
