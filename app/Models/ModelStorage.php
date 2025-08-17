<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelStorage extends Model
{
    /** @use HasFactory<\Database\Factories\ModelStorageFactory> */
    use HasFactory;

    protected $fillable = [
        'indikator',
        'model_name',
        'model_json',
        'weight_specs',
        'weight_data',
        'normalization_params',
    ];
    protected $casts = [
        'indikator'=> 'array'
    ];

}
