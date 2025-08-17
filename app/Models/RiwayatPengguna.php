<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatPengguna extends Model
{

    protected $table = "riwayat_penggunas";
    protected $fillable = [
        'user_id',
        'model',
        'user',
        'parameter',
    ];

    protected $casts = [
        'model'=> 'json',
        'user'=> 'json',
        'parameter'=> 'json',
        'created_at'=> 'datetime'
    ];
}
