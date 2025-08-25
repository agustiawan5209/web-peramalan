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
            'bulan' => ['required', 'string', 'max:50'],
            'kecamatan' => ['required', 'string', 'max:50'],
            'desa' => ['required', 'string', 'max:50'],
            'tahun' => ['required', 'integer', 'digits:4'],
            'total_panen' => ['required', 'numeric', 'min:30'],
            'jenisRumputLaut' => ['required', 'array'],
            'jenisRumputLaut.*.nama' => ['required', 'string',],
            'jenisRumputLaut.*.jumlah' => ['required', 'numeric', 'min:0'],
            'parameter' => ['required'],
            'keterangan' => ['nullable', 'string'],
            'parameter.*.indikator_id'=> ['required', 'exists:indikators,id']
        ];
    }
}
