<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJemaatRequest;
use App\Http\Requests\UpdateJemaatRequest;
use App\Http\Requests\BulkUpdateJemaatRequest;
use App\Http\Requests\BulkDeleteJemaatRequest;
use App\Models\Community;
use App\Models\Jemaat;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;


class JemaatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index jemaat");

        $data = Jemaat::query()
            ->with(['komunitas', 'user'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            });

        return Inertia::render('jemaat/index', [
            'jemaats' => $data->get(),
            'communities' => Community::get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create jemaat"),
                'canShow' => $this->user->can("show jemaat"),
                'canUpdate' => $this->user->can("update jemaat"),
                'canDelete' => $this->user->can("delete jemaat"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJemaatRequest $request)
    {
        $this->pass("create jemaat");

        $data = $request->validated();

        $data['komunitas_id'] = $data['komunitas_id'] ?? null;

        // $exists = Jemaat::where('user_id', $data['userid'])
        //     ->where('name', $data['name'])
        //     ->exists();

        // if ($exists) {
        //     return back()->withErrors(['message' => 'Sudah join komunitas ini']);
        // }

        $data['tanggal_lahir'] = Carbon::parse($data['tanggal_lahir'])->format('Y-m-d');

        $data['user_id'] = auth()->id();

        Jemaat::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Jemaat $jemaat)
    {
        $this->pass("show jemaat");

        return Inertia::render('jemaat/show', [
            'jemaat' => $jemaat->load(['komunitas', 'user']),
            'permissions' => [
                'canUpdate' => $this->user->can("update jemaat"),
                'canDelete' => $this->user->can("delete jemaat"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJemaatRequest $request, Jemaat $jemaat)
    {
        $this->pass("update jemaat");

        $data = $request->validated();
        $jemaat->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jemaat $jemaat)
    {
        $this->pass("delete jemaat");

        $jemaat->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateJemaatRequest $request)
    {
        $this->pass("update jemaat");

        $data = $request->validated();

        $data = collect($data)->only([
            'name',
            'tanggal_lahir',
            'no_hp',
            'email',
        ])->toArray();

        $ids = $data['jemaat_ids'];
        unset($data['jemaat_ids']);

        Jemaat::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteJemaatRequest $request)
    {
        $this->pass("delete jemaat");

        $data = $request->validated();
        Jemaat::whereIn('id', $data['jemaat_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived jemaat");

        return Inertia::render('jemaat/archived', [
            'jemaats' => Jemaat::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore jemaat");

        $model = Jemaat::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete jemaat");

        $model = Jemaat::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }


}
