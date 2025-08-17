<?php

namespace App\Http\Controllers;

use App\Models\Indikator;
use App\Models\HasilPanen;
use App\Models\ModelStorage;
use Illuminate\Http\Request;
use App\Models\PredictionModel;
use App\Models\KriteriaTerpilih;

class PredictionModelController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'model_name' => 'required|string',
            'prediction' => 'required|json',
            'mse' => 'required',
            'rsquared' => 'required',
        ]);

        $model = PredictionModel::create($validated);

        return response()->json([
            'message' => 'Prediksi saved successfully',
            'model_id' => $model->id
        ]);
    }

    // Memuat model dari database
    public function show($modelName)
    {
        $model = PredictionModel::where('model_name', $modelName)
            ->latest()
            ->firstOrFail();

        return response()->json([
            'prediction' => $model->prediction,
            'mse' => $model->mse,
            'rsquared' => $model->rsquared,
        ]);
    }


    private function setTransaction($kriteria)
    {
        $panen = HasilPanen::all();

        $transaction = $panen->map(function ($item) use ($kriteria) {
            $parameter = $item->parameter;
            $jenis = $item->jenisRumputLaut;
            $data = [];
            foreach ($kriteria as $key => $value) {
                // Cek jika $value apakah array
                // jika array ubah menjadi object
                if (is_array($value)) {
                    $value = (object) $value;
                }
                $id = $value->id;
                $nilai = array_values(array_filter($parameter, function ($pm) use ($id) {
                    return $pm['indikator_id'] == $id;
                }))[0]['nilai'];

                $data[] = intval($nilai);
            }
            // $data[] = intval($item->total_panen);
            return $data;
        });
        $transactionY = $panen->map(function ($item) use ($kriteria) {
            $jenis = $item->jenisRumputLaut;
            $data = [];
            foreach ($jenis as $key => $value) {
                $data[$value['nama']] = $value['jumlah'];
            }
            return $data;
        });
        return [$transaction, $transactionY];
    }

    public function setTransactionAPI(Request $request)
    {
        $kriteria = Indikator::orderBy('id', 'asc')->get();

        // Ambil hasil dari KriteriaTerpilih terbaru, decode jika JSON
        $indikatorTerpilih = KriteriaTerpilih::latest()->value('hasil');
        $indikatorTerpilih = $indikatorTerpilih ?? [];

        // Ambil model terbaru (jika ada)
        $model = ModelStorage::latest()->first();

        // Jika model ada, pakai indikator dari model
        if ($model) {
            $kriteria = $model->indikator;
        }

        // Jika request indikator terisi dan true
        // dd($request->indikator);
        if ($request->filled('indikator') && $request->indikator === '1') {
            if (!empty($indikatorTerpilih)) {
                $kriteria = Indikator::whereIn('nama', $indikatorTerpilih)
                    ->orderBy('id', 'asc')
                    ->get();
            }
        } else if ($request->filled('indikator') && $request->indikator === '0') {
            $kriteria = Indikator::orderBy('id', 'asc')->get();
        }

        $transaction = $this->setTransaction($kriteria);

        return response()->json([
            'transactionX' => $transaction[0],
            'indikator' => $kriteria,
            'transactionY' => $transaction[1],
            'indikatorset' => $request->indikator,
        ]);
    }
}
