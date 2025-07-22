<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PredictionModel extends Model
{
    //
    protected $table = "prediction_models";
    protected $fillable = [
        'model_name',
        'prediction',
        'mse',
        'rsquared',
    ];
}
