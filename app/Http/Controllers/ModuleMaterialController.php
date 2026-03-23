<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Module;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ModuleMaterial;

class ModuleMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $selectedProductId = $request->integer('product_id');

        $materials = ModuleMaterial::with('module')
            ->when($selectedProductId, function ($query) use ($selectedProductId) {
                $query->whereHas('module.course', function ($courseQuery) use ($selectedProductId) {
                    $courseQuery->where('product_id', $selectedProductId);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $modules = Module::when($selectedProductId, function ($query) use ($selectedProductId) {
            $query->whereHas('course', function ($courseQuery) use ($selectedProductId) {
                $courseQuery->where('product_id', $selectedProductId);
            });
        })->select('id', 'name')->orderBy('name')->get();

        $products = Product::select('id', 'title')
            ->where('status', 'active')
            ->orderBy('title')
            ->get();

        return Inertia::render('admin/module-material', [
            'materials' => $materials,
            'modules' => $modules,
            'products' => $products,
            'selectedProductId' => $selectedProductId,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     return redirect()->route('admin.modules.index');
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'text' => 'nullable|string',
            'module_id' => 'required|exists:modules,id',
        ]);

        ModuleMaterial::create($validated);

        return redirect()->route('admin.module-materials.index')
            ->with('success', 'Materials created successfully.');
    }

    /**
     * Display the specified resource.
     */
    // public function show(Module $module)
    // {
    //     return redirect()->route('admin.modules.index');
    // }

    /**
     * Show the form for editing the specified resource.
     */
    // public function edit(Module $module)
    // {
    //     return redirect()->route('admin.modules.index');
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModuleMaterial $module_material, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'module_id' => 'required|exists:modules,id',
            'url' => 'nullable|string|max:255',
            'text' => 'nullable|string',
        ]);


        try {
            $module_material->update($validated);
        } catch (Exception $e) {
            return redirect()->route('admin.module-materials.index')
                ->with('error', 'Module update failed.');
        }

        return redirect()->route('admin.module-materials.index')
            ->with('success', 'Module updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModuleMaterial $material)
    {
        $material->delete();

        return redirect()->route('admin.module-materials.index')
            ->with('success', 'Module deleted successfully.');
    }
}
