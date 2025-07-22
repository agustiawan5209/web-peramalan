<?php

namespace App\Http\Controllers;

use App\Models\PredictionModel;
use Illuminate\Http\Request;

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
}
