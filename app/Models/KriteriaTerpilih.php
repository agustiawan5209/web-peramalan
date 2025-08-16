<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KriteriaTerpilih extends Model
{
    protected $table = "kriteria_terpilihs";
    protected $fillable = ['hasil'];

    protected $casts = ['hasil' => 'array'];
}
