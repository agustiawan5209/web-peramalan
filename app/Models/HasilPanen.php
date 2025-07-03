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
        "tahun",
        "total_panen",
        "eucheuma_conttoni",
        "gracilaria_sp",
        "hasil_panen",
        "keterangan",
    ];

    protected $casts = [
        // "tanggal_panen" => "date",
        // "jumlah_panen" => "integer",
        "eucheuma_conttoni" => "float",
        "gracilaria_sp" => "float",
        "hasil_panen" => "json",
    ];
}
