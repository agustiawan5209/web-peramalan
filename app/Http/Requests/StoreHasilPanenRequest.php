<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHasilPanenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bulan' => ['required', 'string', 'max:20'],
            'tahun' => ['required', 'integer', 'digits:4'],
            'total_panen' => ['required', 'string', 'max:30'],
            'jenisRumputLaut' => ['required', 'array'],
            'jenisRumputLaut.*.nama' => ['required', 'string', 'in:eucheuma_conttoni,gracilaria_sp'],
            'jenisRumputLaut.*.jumlah' => ['required', 'numeric', 'min:0'],
            'parameter' => ['required'],
            'keterangan' => ['nullable', 'string'],
            'parameter.panjangGarisPantai' => ['required', 'integer', 'min:0'],
            'parameter.jumlahPetani' => ['required', 'integer', 'min:0'],
            'parameter.luasPotensi' => ['required', 'integer', 'min:0'],
            'parameter.luasTanam' => ['required', 'integer', 'min:0'],
            'parameter.jumlahTali' => ['required', 'integer', 'min:0'],
            'parameter.jumlahBibit' => ['required', 'integer', 'min:0'],
            'parameter.suhuAir' => ['required', 'integer', 'min:0'],
            'parameter.salinitas' => ['required', 'integer', 'min:0'],
            'parameter.kejernihanAir' => ['required', 'string', ],
            'parameter.cahayaMatahari' => ['required', 'string', ],
            'parameter.arusAir' => ['required', 'string', ],
            'parameter.kedalamanAir' => ['required', 'integer', 'min:0'],
            'parameter.phAir' => ['required', 'integer', 'min:0'],
            'parameter.ketersediaanNutrisi' => ['required', 'string', ],
        ];
    }
}
