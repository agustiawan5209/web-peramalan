<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatPengguna extends Model
{

    protected $table = "riwayat_penggunas";
    protected $fillable = [
        'model',
        'user',
        'parameter',
    ];

    protected $casts = [
        'model'=> 'json',
        'user'=> 'json',
        'parameter'=> 'json',
    ];
}
