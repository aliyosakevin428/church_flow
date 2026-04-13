<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunityRequest;
use App\Http\Requests\UpdateCommunityRequest;
use App\Http\Requests\BulkUpdateCommunityRequest;
use App\Http\Requests\BulkDeleteCommunityRequest;
use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CommunityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index community");

        $data = Community::query()
            //->with(['media'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            });

        return Inertia::render('community/index', [
            'communities' => $data->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create community"),
                'canShow' => $this->user->can("show community"),
                'canUpdate' => $this->user->can("update community"),
                'canDelete' => $this->user->can("delete community"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommunityRequest $request)
    {
        $this->pass("create community");

        $data = $request->validated();
        Community::create($data);

        return redirect()->route('community.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Community $community)
    {
        $this->pass("show community");

        return Inertia::render('community/show', [
            'community' => $community,
            'permissions' => [
                'canUpdate' => $this->user->can("update community"),
                'canDelete' => $this->user->can("delete community"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommunityRequest $request, Community $community)
    {
        $this->pass("update community");

        $data = $request->validated();
        $community->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Community $community)
    {
        $this->pass("delete community");

        $community->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateCommunityRequest $request)
    {
        $this->pass("update community");

        $data = $request->validated();
        $ids = $data['community_ids'];
        unset($data['community_ids']);

        Community::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteCommunityRequest $request)
    {
        $this->pass("delete community");

        $data = $request->validated();
        Community::whereIn('id', $data['community_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived community");

        return Inertia::render('community/archived', [
            'communities' => Community::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore community");

        $model = Community::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete community");

        $model = Community::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }


}
