<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HasilPanen extends Model
{
    /** @use HasFactory<\Database\Factories\HasilPanenFactory> */
    use HasFactory;

    protected $fillable = [
        "bulan",
        "kecamatan",
        "desa",
        "tahun",
        "total_panen",
        "jenisRumputLaut",
        "parameter",
        "keterangan",
    ];

    protected $casts = [
        // "tanggal_panen" => "date",
        "jenisRumputLaut" => "array",
        "parameter" => "json",
    ];
}
