<?php

namespace App\Http\Controllers;

use App\Models\ModelStorage;
use Illuminate\Http\Request;
use App\Http\Requests\StoreModelStorageRequest;
use App\Http\Requests\UpdateModelStorageRequest;
use App\Models\Indikator;

class ModelStorageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'indikator'=> 'required',
            'model_name' => 'required|string',
            'model_json' => 'required|json',
            // 'weight_specs' => 'required|json',
            // 'weight_data' => 'required|string', // base64 encoded
            'normalization_params' => 'required|json'
        ]);

        $model = ModelStorage::create($validated);

        return response()->json([
            'message' => 'Model saved successfully',
            'model_id' => $model->id
        ]);
    }

    // Memuat model dari database
    public function show($modelName)
    {
        $model = ModelStorage::where('model_name', $modelName)
            ->latest()
            ->firstOrFail();
        return response()->json([
            'indikator'=> $model->indikator,
            'model_json' => $model->model_json,
            // 'weight_data' => $model->weight_data,
            // 'weight_specs' => $model->weight_specs,
            'normalization_params' => $model->normalization_params
        ]);
    }
}
