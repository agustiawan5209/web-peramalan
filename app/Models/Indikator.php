<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indikator extends Model
{
    /** @use HasFactory<\Database\Factories\IndikatorFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'keterangan',
        'attribut',
    ];

    protected $casts = [
        'attribut'=> 'json'
    ];
}
